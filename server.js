import dbQuery from './db/dev/dbQuery';

const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use(express.static("public"));

var bookid = 0;
var genreid = 0;
var presentGenres;

app.get("/", (req, res) => {

  const genreQueryText = "SELECT * from Genres";

  let bookIdQueyText = "SELECT MAX(book_id) from books"
  dbQuery.query(bookIdQueyText)
      .then(bookIdRes => {
          console.log("SUCCESS");
          bookid = bookIdRes.rows[0].max;
      })
      .catch(err => {
      console.log(err)
      res.status(400).json({ message: "unable to create a new task" });
      });


  dbQuery.query(genreQueryText)
    .then((data) => {
    //   console.log(typeof(data.rows));
        // let genres_present = data.rows.map(({ genre }) => genre);
        // currentGenreIDs = data.rows.map(({ genre_id }) => genre_id);
        presentGenres = data.rows
        res.render("index", { genres: presentGenres, bookID : bookid });
    })
    .catch(err => res.status(400).json(err));

});


// create new task
app.post("/addTask", (req, res) => {
    const { textTodo } = req.body;

    const bID = bookid + 1;
    let req_body = req.body;
    // console.log(req_body)

    let myBookGenres = req_body.genres;
    if(typeof(myBookGenres) == 'string')
        myBookGenres = [myBookGenres].map(x=>+x)

    if(myBookGenres.includes("-1")){
        myBookGenres = myBookGenres.filter(e => e !== '-1').map(x=>+x)
        let additionalBookGenres = req_body.genres_extra.split(', ').map(v => v.toLowerCase());
        console.log(additionalBookGenres)
        let maxExistingGenreID = presentGenres.reduce((prev, current) => (prev.genre_id > current.genre_id) ? prev.genre_id : current.genre_id)
        let additionalBookGenreInsertQuery = `INSERT INTO Genres(genre_id, genre) VALUES`;
        for(let additionalBookGenre of additionalBookGenres){
            let additionalBookGenreID = maxExistingGenreID + 1;
            additionalBookGenreInsertQuery += "(" + additionalBookGenreID + "," + "'" + additionalBookGenre + "'" + ")" + ",";
            myBookGenres = myBookGenres.concat(additionalBookGenreID);
            maxExistingGenreID += 1
        }
        
        // console.log(additionalBookGenreInsertQuery.substring(0, additionalBookGenreInsertQuery.length - 1))

        dbQuery.query(additionalBookGenreInsertQuery.substring(0, additionalBookGenreInsertQuery.length - 1))
            .then(todo => {
            })
            .catch(err => {
            res.status(400).json({ message: "unable to create a new task" });
            });

    }
    // console.log(myBookGenres)
    

    const queryText = `INSERT INTO books(book_id, 
                                        book_name, 
                                        author_first_name, 
                                        author_last_name, 
                                        type, 
                                        series_name, 
                                        series_no, 
                                        year, 
                                        pages,
                                        language,
                                        duplicate, 
                                        photo,
                                        comments) 
                                        VALUES (${bID}, 
                                                '${req_body.bookName}', 
                                                '${req_body.authorFirstName}', 
                                                '${req_body.authorLastName}', 
                                                '${req_body.type}', 
                                                '${req_body.seriesName}', 
                                                ${req_body.seriesNo}, 
                                                ${req_body.year}, 
                                                ${req_body.pages}, 
                                                '${req_body.lang}', 
                                                ${req_body.duplicate}, 
                                                '${req_body.photo}',
                                                '${req_body.comments}'
                                                );`;
    
    console.log(queryText);
    dbQuery.query(queryText)
        .then(todo => {
        })
        .catch(err => {
        res.status(400).json({ message: "unable to insert" });
        });
    
    let genresString = ''
    for (var myBookGenre of myBookGenres)
        genresString = genresString + "(" + bID + ', ' +  myBookGenre  + ")" + ",";


    let genresInsertQuery = `INSERT INTO bookgenres(book_id, genre_id) VALUES ${genresString.substring(0, genresString.length - 1)}`
    console.log(genresInsertQuery, typeof(myBookGenres));

    dbQuery.query(genresInsertQuery)
        .then(todo => {
        res.redirect("/");
        })
        .catch(err => {
        // console.log(err)
        res.status(400).json({ message: "unable to create a new task" });
        });
    
});

app.get("/showPreviousEntry", (req, res) => {


    let lastBookQueryText = `SELECT * FROM books WHERE book_id = ${bookid}`;
    var bookObject;
    dbQuery.query(lastBookQueryText)
        .then(lastBook => {
                bookObject = lastBook.rows[0]
                // console.log(bookObject)
        })
        .catch(err => {
        console.log(err)
        res.status(400).json({ message: "unable to create a new task" });
        });
    
    
    let lastBookGenresQueyText = `SELECT genre from bookgenres inner join genres on genres.genre_id=bookgenres.genre_id where book_id = ${bookid}`
    var myBookGenres;
    dbQuery.query(lastBookGenresQueyText)
        .then(lastBookGenres => {
            // console.log("SUCCESS");
            myBookGenres = lastBookGenres.rows.map(({ genre }) => genre);
            bookObject.genres = myBookGenres
            console.log(bookObject);

            res.render('prevbook', {bookObj : bookObject, genres : presentGenres})
        })
        .catch(err => {
        console.log(err)
        res.status(400).json({ message: "unable to create a new task" });
        });
    
      
});


app.post("/removeBook", (req, res) => {

    let removeBookQueryText = `DELETE FROM books WHERE book_id = ${bookid}`;
    dbQuery.query(removeBookQueryText)
        .then(rembook => {
        })
        .catch(err => {
        console.log(err)
        res.status(400).json({ message: "unable to create a new task" });
        });

    let removeBookGenreQueryText = `DELETE FROM bookgenres WHERE book_id = ${bookid}`;
    dbQuery.query(removeBookGenreQueryText)
        .then(rembook => {
            res.redirect("/")
        })
        .catch(err => {
        console.log(err)
        res.status(400).json({ message: "unable to create a new task" });
        });
            
});

app.post("/updateBook", (req, res) => {
    console.log("IN UPDATE")

    let req_body = req.body;
    // console.log(req_body)
    const bID = bookid;

    const queryText = `UPDATE books SET book_name = '${req_body.bookName}', 
                                        author_first_name = '${req_body.authorFirstName}', 
                                        author_last_name = '${req_body.authorLastName}', 
                                        type = '${req_body.type}', 
                                        series_name = '${req_body.seriesName}', 
                                        series_no = ${req_body.seriesNo},
                                        year = ${req_body.year},
                                        pages = ${req_body.pages},
                                        language = '${req_body.lang}',
                                        duplicate = ${req_body.duplicate}, 
                                        photo = '${req_body.photo}',
                                        comments = '${req_body.comments}'
                                    WHERE book_id = ${bID};`;

    console.log(queryText)                               
    dbQuery.query(queryText)
        .then(todo => {
            res.redirect("/");
        })
        .catch(err => {
        res.status(400).json({ message: "unable to create a new task" });
        });
    
    


});

app.listen(8080, () => console.log("app is running on port 8080"));

