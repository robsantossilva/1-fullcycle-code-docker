const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('<h1>Robson!!!</h1>')
})

app.listen(3000, () => {
    console.log('Run in 3000')
});