async function loadPay(){
    $('main').html('\
        <div id="main-page" class="container my-5">\
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