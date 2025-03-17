const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MySQL Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Change this if you use a different username
    password: '',       // Add your MySQL password if set
    database: 'todo_db' // Make sure you created this database
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL');
});

// 🎯 API to get all tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// 🎯 API to add a new task
app.post('/tasks', (req, res) => {
    const { task, time } = req.body;
    if (!task || !time) {
        return res.status(400).json({ error: "Task and Time are required" });
    }
    db.query('INSERT INTO tasks (task, time) VALUES (?, ?)', [task, time], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: result.insertId, task, time });
        }
    });
});

// 🎯 API to delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: 'Task deleted successfully' });
        }
    });
});

// ✅ Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
