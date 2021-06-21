import dbQuery from './db/dev/dbQuery';

const express = require("express");

// const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'task_user',
//   host: '127.0.0.1',
//   database: 'tasks',
//   password: 'password',
//   port: 5432,
// })

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use(express.static("public"));

// res.render
app.get("/", (req, res) => {

  const quertText = "SELECT * from todo";
  console.log(quertText);
  console.log(dbQuery);

  dbQuery.query(quertText)
    .then((data) => {
      console.log(data);
      res.render("index", { todos: data.rows });
    })
    .catch(err => res.status(400).json(err));

});

// create new task
app.post("/addTask", (req, res) => {
  const { textTodo } = req.body;
  const id = 16;
  const queryText = `INSERT INTO todo(id, task, status) VALUES (${id}, '${textTodo}', 0);`;
  console.log(queryText)

  dbQuery.query(queryText)
    .then(todo => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({ message: "unable to create a new task" });
    });
});

app.put("/moveTaskDone", (req, res) => {
  const { name, id } = req.body;

  if (name === "todo") {
    pool("task")
      .where("id", "=", id)
      .update("status", 1)
      .returning("status")
      .then(task => {res.json(task[0])});
  } else {
    pool("task")
      .where("id", "=", id)
      .update("status", 0)
      .returning("status")
      .then(task => {res.json(task[0])});
  }
});

app.listen(8080, () => console.log("app is running on port 8080"));

