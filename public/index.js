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
            loadSettins();
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

function loadPay(){
    $('main').html('These is where you pay others!');
}

function loadSettings(){
    $('main').html('These are the settings!');
}