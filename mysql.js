const mysql = require('mysql')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'test'
})

function _query (sql,callback) {
  pool.query(sql, function (err, data, fields) {
    if (err) throw err
    callback(data)
  })
}

exports.query = _query
