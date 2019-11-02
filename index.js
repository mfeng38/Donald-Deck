const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();

const { Pool, Client } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.redirect('loginUI.html'));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.get('/soloBlackjack',(req,res)=> res.render('pages/soloBlackjack'));

app.post('/login', (req, res) => {
    var loginQuery = `SELECT * FROM users WHERE users.username = '${req.body.username}'`;
    console.log(loginQuery);
    pool.query(loginQuery, (error, result) => {
        if (error)
            res.send("Username not found");
        else {
            var results = {'rows': result.rows };
            console.log(results);
        }
    });
});