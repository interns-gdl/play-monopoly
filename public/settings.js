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