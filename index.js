const mysql = require('mysql2/promise')
const {wrappedTransactionQuery} = require('./temp')

isoLv = 'SET TRANSACTION ISOLATION LEVEL READ COMMITTED'
const vr = wrappedTransactionQuery(isoLv, async () => {
    const [items] = await connection.execute('SELECT name FROM product')
    for(item of items){
        console.log(item.name)
    }
})

console.log(vr)