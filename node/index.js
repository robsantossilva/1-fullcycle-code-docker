const express = require('express')
const mysql = require('mysql');
const app = express()

const config = {
    host:'db',
    user:'root',
    password:'root',
    database:'nodedb',
};

const conn = mysql.createConnection(config);


app.get('/', (req, res) => {
    const sql = `INSERT INTO people(name) values('Robson')`;
    console.log(conn.query(sql));
    conn.end();

    res.send('<h1>Robson!!!</h1>');
})

app.listen(3000, () => {
    console.log('Run in 3000')
});