//run main once the document is ready
$(document).ready(main);

//declare global variables here
const db = firebase.database().ref('/');
var gameRoom, player, admin;

function main(){
    $('#btn-create-room').on('click', createRoom);
    $('#btn-go-to-join').on('click', goToJoinRoom);
}

//this function will after the waiting room
function start(){
    if (!admin){
        $('#settings').remove();
    }
    $('.nav-item').click(e=>{
        if(!$(e.currentTarget).hasClass('active')){
            $('.nav-item').removeClass('active');
            $(e.currentTarget).addClass('active');
            load($(e.currentTarget).html());
        }
    });
    loadTransactions();
}

function load(page){;
    resetPage();
    switch(page){
        case 'Transactions':
            loadTransactions();
            break;
        case 'My account':
            loadMyAccount();
            break;
        case 'Pay':
            loadPay();
            break;
        case 'Settings':
            loadSettings();
            break;
        default:
            break;
    }
}

function resetPage(){
    $('main').empty();
}

function loadTransactions(){
    $('main').html('These are the transactions!');
}

function loadMyAccount(){
    $('main').html('These is your account!');
}

async function loadPay(){
    $('main').html('\
        <div id="pay-page" class="container my-5">\
            <h3>To</h3>\
            <select id="to" class="custom-select mb-3">\
                <option value="bank">Bank</option>\
            </select>\
            \
            <h3>Type</h3>\
            <select id="type" class="custom-select mb-3">\
                <option value="pay">Pay</option>\
                <option value="charge">Charge</option>\
            </select>\
            \
            <h3>Amount</h3>\
            <input id="amount" class="input-group-text w-100 mb-3" type="number">\
            \
            <h3>Concept</h3>\
            <input id="concept" class="input-group-text w-100 mb-3">\
            \
            <button id="make-transaction" class="btn btn-primary">Make Transaction</button>\
        </div>\
    ');

    let playersSnap = await gameRoom.child('players').once('value');
    playersSnap.forEach(childSnap =>{
        if(player.key !== childSnap.key){
            $('#to').append(`\
                <option value="${childSnap.key}">${childSnap.key}</option>\
            `);
        }
    });

    $('#make-transaction').click(()=>{
        makeTransaction($('#to').val(), $('#type').val(), $('#amount').val(), $('#concept').val())
    })

}

function invalidTransaction(message){
    $('#pay-page').prepend(`\
        <div class="alert alert-danger alert-dismissible fade show" role="alert">\
            <strong>Invalid transaction!</strong> ${ message }\
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                <span aria-hidden="true">&times;</span>\
            </button>\
        </div>\
        `);
}

function completedTransaction(){
    $('#pay-page').prepend(`\
        <div class="alert alert-success alert-dismissible fade show" role="alert">\
            <strong>Transaction Completed Successfuly!</strong>\
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                <span aria-hidden="true">&times;</span>\
            </button>\
        </div>\
        `);
}

async function makeTransaction(to, type, amount, concept){
    amount = parseInt(amount);
    let playerSnap = await player.once('value');
    let money = playerSnap.val().money;

    if (amount > money && type === 'pay'){
        invalidTransaction('You do not have enough money.');
        return;
    } 

    if(to === 'bank'){
        if(type === 'pay'){
            player.update({
                money: money-amount
            });
        }else{
            player.update({
                money: money+amount
            });
        }
    }else{
        if(type === 'pay'){
            let receiver = gameRoom.child('players/' +to);
            let receiverSnap = await receiver.once('value');
            let receiverMoney = receiverSnap.val().money;

            player.update({
                money: money-amount
            });
            receiver.update({
                money: receiverMoney+amount
            });
        }else{
            invalidTransaction('You are not allowed to charge other people than the bank.');
            return;
        }
    }

    gameRoom.child('transactions').push({
        from: player.key,
        to: to,
        amount: amount,
        concept: concept,
    });
    completedTransaction();
}

function loadSettings(){
    $('main').html('\
        <div id="settings-page" class="container my-5">\
        <button id="reset-game" class="btn btn-danger">Reset Game</button>\
        </div>\
    ');
    $('#reset-game').click(()=>{
        resetGame();
    });
}