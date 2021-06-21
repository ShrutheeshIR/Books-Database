import pool from './pool';
// const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'books_user',
//   host: '127.0.0.1',
//   database: 'books',
//   password: 'password',
//   port: 5432,
// })

pool.on('connect', () => {
  console.log('connected to the db');
});

// console.log(pool);
const createBookTable = () => {
    const BookCreateQuery = `CREATE TABLE IF NOT EXISTS books
    (book_id SERIAL PRIMARY KEY, 
    book_name VARCHAR(200) NOT NULL, 
    author_first_name VARCHAR(100), 
    author_last_name VARCHAR(100), 
    type VARCHAR(15),
    series_name VARCHAR(200),
    language VARCHAR(20),
    series_no SMALLINT,
    year integer,
    pages integer,
    duplicate BOOL,
    photo VARCHAR(260),
    comments VARCHAR(1000))`;
  
    pool.query(BookCreateQuery)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  };

  const createGenreTable = () => {
    const GenreCreateQuery = `CREATE TABLE IF NOT EXISTS Genres
    (genre_id SERIAL PRIMARY KEY,
    genre VARCHAR(100)
    )`;
  
    pool.query(GenreCreateQuery)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  };

const createBookGenreTable = () => {
    const bookGenreCreateQuery = `CREATE TABLE IF NOT EXISTS BookGenres
    (book_id SERIAL, 
     genre_id SERIAL,
    PRIMARY KEY (book_id, genre_id)
    )`;
  
    pool.query(bookGenreCreateQuery)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  };


const createAllTables = () => {
    createBookTable();
    createGenreTable();
    createBookGenreTable();
  };

module.exports = {
    createAllTables,
  }

require('make-runnable');