const express = require('express')
const app = express()
const cors = require('cors');
const sqlite3 = require('sqlite3')
app.use(express.json());
app.use(cors());
const db = new sqlite3.Database('todo.db', (err) => {
    if (err) {
        console.log("Error in connectin to db");
    }
    else {
        console.log("Connected Sucessfully");
    }
})
app.use(cors({
    origin: '',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));
app.get('/gettodos', (req, res) => {
    let getTodosQuery = `select * from todos order by todoId desc`
    db.all(getTodosQuery, (error, result) => {
        if (error) {
            res.status(401).json({ err: "Error in getting data" })
        }
        else {
            res.status(200).json({ result })
        }
    })
})

app.get('/gettodos/:id', (req, res) => {
    let todoId = req.params.id
    let getParticularTodoQuery = `select * from todos where todoId=${todoId}`
    db.all(getParticularTodoQuery, (error, result) => {
        if (error) {
            res.status(401).json({ err: "Error in getting data" })
        }
        else {
            res.status(200).json({ result })
        }
    })
})
app.delete('/deleteTodo/:todoId', (req, res) => {
    const { todoId } = req.params
    let deleteTodoQuery = `delete from todos where todoId=${todoId}`
    db.run(deleteTodoQuery, (error, result) => {
        if (error) {
            res.status(401).json({ err: "Error in getting data" })
        }
        else {
            res.status(200).json({ msg: "Sucessfully Deleted Data" })
        }
    })
})

app.post('/addTodo', (req, res) => {
    let { text, isCompleted } = req.body
    let insertTodoQuery = `INSERT INTO todos (todoDescription, isCompleted) VALUES
  ('${text}', ${isCompleted})`
    db.run(insertTodoQuery, (error, result) => {
        if (error) {
            res.status(401).json({ err: "Error in Inserting todo" })
        }
        else {
            res.status(200).json({ msg: "Inserted todo sucessfully" })
        }
    })
})

app.put('/updateIsComplete/:todoId', (req, res) => {
    let todoId = req.params.todoId
    let isCompleted = null
    let updatedQuery = null
    let getTodoQuery = `select * from todos where todoId=${todoId}`
    db.get(getTodoQuery, (error, result) => {
        if (error) {

             res.status(401).json({ err: 'Error in fetching data' })
        }
        else {
            isCompleted = result.isCompleted
        }
        if (isCompleted === 0) {
            updatedQuery = `UPDATE todos SET isCompleted = 1 WHERE todoId = ${todoId}`
        }
        else {
            updatedQuery = `UPDATE todos SET isCompleted = 0 WHERE todoId = ${todoId}`
        }
        db.run(updatedQuery, (error, result) => {
            if (error) {
                res.status(401).json({ err: "Error in updating " })
            }
            else {
               res.status(200).json({ msg: 'Updated Sucessfully' })
            }
        })

    })
})
app.put('/updateDescription/:todoId',(req,res)=>{
    let todoId = req.params.todoId
    let updateDescription =req.body.text
    let updateDescriptionQuery =`update todos set todoDescription='${updateDescription}' where todoId=${todoId}`
    db.run(updateDescriptionQuery,(error,result)=>{
        if(error){
            res.status(400).json({err:"Error in updating"})
        }
        else{
          
            res.status(200).json({msg:"Sucessfully Deleted"})
        }
    })
})


app.listen(3000, () => {
    console.log("listeing in port 3000");
})