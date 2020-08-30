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
        case 'Players':
            loadPlayers();
            break;
        default:
            break;
    }
}

function resetPage(){
    $('main').empty();
}

function invalidTransaction(message){
    $('#main-page').prepend(`\
        <div class="alert alert-danger alert-dismissible fade show" role="alert">\
            <strong>Invalid transaction!</strong> ${ message }\
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                <span aria-hidden="true">&times;</span>\
            </button>\
        </div>\
        `);
}

function completedTransaction(){
    $('#main-page').prepend(`\
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
