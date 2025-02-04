const express = require('express')
const app = express()
const cors = require('cors')
const Database = require('better-sqlite3')

app.use(express.json())
app.use(cors())

// Connect to SQLite database using better-sqlite3
const db = new Database('todo.db', { verbose: console.log("connected") })

app.use(cors({
    origin: '',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}))

app.get('/gettodos', (req, res) => {
    try {
        const getTodosQuery = 'SELECT * FROM todos ORDER BY todoId DESC'
        const result = db.prepare(getTodosQuery).all()
        res.status(200).json({ result })
    } catch (error) {
        res.status(401).json({ err: 'Error in getting data' })
    }
})

app.get('/gettodos/:id', (req, res) => {
    const todoId = req.params.id
    try {
        const getParticularTodoQuery = 'SELECT * FROM todos WHERE todoId = ?'
        const result = db.prepare(getParticularTodoQuery).get(todoId)
        res.status(200).json({ result })
    } catch (error) {
        res.status(401).json({ err: 'Error in getting data' })
    }
})

app.delete('/deleteTodo/:todoId', (req, res) => {
    const { todoId } = req.params
    try {
        const deleteTodoQuery = 'DELETE FROM todos WHERE todoId = ?'
        db.prepare(deleteTodoQuery).run(todoId)
        res.status(200).json({ msg: 'Successfully Deleted Data' })
    } catch (error) {
        res.status(401).json({ err: 'Error in deleting data' })
    }
})

app.post('/addTodo', (req, res) => {
    const { text, isCompleted } = req.body
    try {
        const insertTodoQuery = 'INSERT INTO todos (todoDescription, isCompleted) VALUES (?, ?)'
        db.prepare(insertTodoQuery).run(text, isCompleted)
        res.status(200).json({ msg: 'Inserted todo successfully' })
    } catch (error) {
        res.status(401).json({ err: 'Error in Inserting todo' })
    }
})

app.put('/updateIsComplete/:todoId', (req, res) => {
    const todoId = req.params.todoId
    try {
        const getTodoQuery = 'SELECT * FROM todos WHERE todoId = ?'
        const result = db.prepare(getTodoQuery).get(todoId)

        if (!result) {
            return res.status(404).json({ err: 'Todo not found' })
        }

        const updatedQuery = result.isCompleted === 0
            ? 'UPDATE todos SET isCompleted = 1 WHERE todoId = ?'
            : 'UPDATE todos SET isCompleted = 0 WHERE todoId = ?'

        db.prepare(updatedQuery).run(todoId)
        res.status(200).json({ msg: 'Updated Successfully' })
    } catch (error) {
        res.status(401).json({ err: 'Error in updating' })
    }
})

app.put('/updateDescription/:todoId', (req, res) => {
    const todoId = req.params.todoId
    const updateDescription = req.body.text
    try {
        const updateDescriptionQuery = 'UPDATE todos SET todoDescription = ? WHERE todoId = ?'
        db.prepare(updateDescriptionQuery).run(updateDescription, todoId)
        res.status(200).json({ msg: 'Successfully Updated' })
    } catch (error) {
        res.status(400).json({ err: 'Error in updating' })
    }
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})
