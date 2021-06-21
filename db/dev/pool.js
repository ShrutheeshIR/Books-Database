const Pool = require('pg').Pool
const pool = new Pool({
  user: 'books_user',
  host: '127.0.0.1',
  database: 'books',
  password: 'password',
  port: 5432,
})
// console.log(pool)
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

// const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'task_user',
//   host: '127.0.0.1',
//   database: 'tasks',
//   password: 'password',
//   port: 5432,
// })


export default pool;