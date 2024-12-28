const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vikramsw@210',
    database: 'registration_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.post('/register', async (req, res) => {
    const { first_name, last_name, mobile_number, password, created_by } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'CALL CreateUser(?, ?, ?, ?, ?)';
    db.query(sql, [first_name, last_name, mobile_number, hashedPassword, created_by], (err, result) => {
        if (err) throw err;
        res.send('User registered');
    });
});

app.get('/user/:id', (req, res) => {
    const sql = 'CALL GetUser(?)';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    });
});

app.put('/user/:id', async (req, res) => {
    const { first_name, last_name, mobile_number, password, updated_by } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'CALL UpdateUser(?, ?, ?, ?, ?, ?)';
    db.query(sql, [req.params.id, first_name, last_name, mobile_number, hashedPassword, updated_by], (err, result) => {
        if (err) throw err;
        res.send('User updated');
    });
});

app.delete('/user/:id', (req, res) => {
    const sql = 'CALL DeleteUser(?)';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send('User deleted');
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

app.post('/login', (req, res) => {
    const { mobile_number, password } = req.body;
    const sql = 'SELECT * FROM registration WHERE mobile_number = ?';
    db.query(sql, [mobile_number], async (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const greeting = `Good ${getGreeting()}, Mr. ${user.first_name} ${user.last_name}`;
                res.send(greeting);
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(404).send('User not found');
        }
    });
});

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
}