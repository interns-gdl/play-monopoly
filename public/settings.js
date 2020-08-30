function loadSettings(){
    $('main').html(`
        <div id="settings-page" class="container text-center my-5">
        <h3>Code: ${gameRoom.key}</h3>
        <button id="reset-game" class="btn btn-danger m-3">Reset Game</button>\
        </div>
    `);
    $('#reset-game').click(()=>{
        if (confirm('Are you sure you want to reset? This action cannot be undone.'))
            resetGame();
    });
}