async function loadTransactions(){
    $('main').html('\
    <div class="container-fluid text-center my-4">\
        <div class="d-flex justify-content-center align-items-center w-100">\
            <div>\
            <h3>Transactions</h3>\
            <ul id="transaction-list" class="list-group mx-2"></ul>\
            </div>\
        </div>\
    </div>\
    ');

    let gameFormat = await gameRoom.child('format').once('value');
    let formatSnap = await db.child('formats/'+gameFormat.val()).once('value');
    let format = formatSnap.val();
    let verb, conector, color;    

    gameRoom.child('transactions').orderByKey().limitToLast(10).on('child_added', snap=>{
        let transaction = snap.val();
        if (transaction.type === 'pay'){
            verb = 'paid';
            conector = 'to';
            color = 'danger';
            img = 'minus';
        }else{
            verb = 'got paid';
            conector = 'by';
            color = 'success';
            img = 'plus';
        }
        let li = `\
        <li id="${ snap.key }-w" class="list-group-item">
            <div class="m-2">
                <strong>${ transaction.from }</strong> 
                ${ verb }
                <span class="alert-${color} rounded border border-${color} p-1 m-1">
                    <img src="/${img}.svg"> 
                    ${format.currency} ${ transaction.amount } ${format.scale} 
                </span>
                ${conector} 
                <strong>${transaction.to}</strong>
            </div>
            Concept: ${transaction.concept}
        </li>`
        $('#transaction-list').prepend(li);
    })
}