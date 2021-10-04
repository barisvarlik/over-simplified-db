const config = {//DB konfigürasyonu, ayrı dosyaya alınacak
     host: '127.0.0.1',
     user: 'student',
     password: 'student',
     database: 'over-simplified-example',
     port: '3306',
     waitForConnections: true,
     connectionLimit: 2,
     queueLimit: 0,
     debug: false
 }

const mysql = require('mysql2/promise') //mysql importu

exports.wrappedTransactionQuery = async (isoLvQuery, callback) => { //Query wrapped fonksiyonu
  //parametreler:
  //isoLvQuery: Isolation Level Query, istediğimiz database okunabilirliği
  //callback(): Çalıştırmak istediğimiz esas fonksiyon
  connection = await mysql.createConnection(config) //DB'e bağlantı kuruyor
  await connection.execute(isoLvQuery) //Okunabilirlik seviyesini ayarlıyor
  await connection.beginTransaction() //Transaction (tablolar arası iletişim) işlemini başlatıyor

  try {
    await callback() //Callback'i çalıştırıyor
    console.log('Callback is executed successfully')
    await connection.commit() //Callback çalıştığı durumda işlemleri database'e kaydediyor
    console.log('Commit is executed successfully')
  }
  catch (err) {
    console.error('Transaction error: ${err.message}', err) //Error handling
    connection.rollback() //Hata durumunda sıkıntıyı önlemek için bir önceki DB Instance'ı yüklüyor, değişiklikleri kaydetmiyor
    console.log('Rollback is executed successfully')
  }
  finally {
      connection.close() //DB ile bağlantıyı kesiyor
  }
}