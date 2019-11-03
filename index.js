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
    var loginUsername = req.body.username;
    var loginPassword = req.body.password;
    var loginQuery = `SELECT * FROM users WHERE users.username = '${loginUsername}'`;
    console.log(loginQuery);
    pool.query(loginQuery, (error, result) => {
        if (error)
            res.send(error);
        else {
            var results = {'rows': result.rows };
            if (results === undefined) res.send("Username not found");
            else {
                var databasePassword = results.rows[0].password;
                if (loginPassword === databasePassword) {
                    res.send("correct password");
                }
                else {
                    res.send("incorrect password");
                }
            }
            console.log(req.body.username);
            console.log(req.body.password);
            console.log(results);
            console.log(results.rows[0].username);
            console.log(results.rows[0].password);
        }
    });
});