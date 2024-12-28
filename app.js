const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: '52.72.129.133',
    user: 'root',
    password: 'your_mysql_root_password',
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

app.listen(3000, () => {
    console.log('Server started on port 3000');
});