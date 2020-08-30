async function loadMyAccount(){
    let playerSnap = await player.once('value');
    let money = playerSnap.val().money;
    let gameFormat = await gameRoom.child('format').once('value');
    let formatSnap = await db.child('formats/'+gameFormat.val()).once('value');
    let format = formatSnap.val();

    $('main').html(`\
        <div id="main-page" class="container text-center my-5">\
        <h2>Balance</h2>\
        <h3>${format.currency} <span id="money">${money}</span> ${format.scale}</h3>\
        <br>\
        <button id="go" class="btn btn-success">Go!</button>\
        </div>\
    `);

    $('#go').click(()=>{
        $('#money').html(parseInt($('#money').html()) + format.go);
        makeTransaction('bank', 'charge', format.go, 'Go!')
    })
    
}