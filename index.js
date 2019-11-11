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
            console.log(results.rows)
            if (results.rows === undefined || results.rows.length == 0) {
                res.render('pages/loginIncorrect.ejs');
            }
            else {
                var databasePassword = results.rows[0].password;
                if (loginPassword === databasePassword) {
                    if (loginUsername === "admin"){
                        res.redirect('/admin');
                    }
                    else {
                        res.render('pages/mainMenu.ejs', results );
                    }
                }
                else {
                    res.render('pages/loginIncorrect.ejs');
                }
            }
        }
    });
});

app.post('/createAccount', (req, res) => {
    var createUsername = req.body.username;
    var createPassword = req.body.password;
    var createQuery = ` insert into users(username, password, credits) select '${createUsername}', '${createPassword}', 2000 where not exists (select 1 from users where username='${createUsername}');`;
    console.log(createQuery);
    pool.query(createQuery, (error, result) => {
        if (error)
            res.send(error);
        else {
            if (result.rowCount === 0) {
                res.render('pages/createAccountIncorrect.ejs')
            }
            else {
                res.render('pages/loginPostCreate.ejs')
            }
        }
    });
});

// If Log in as administrator, redirect to here 
app.get('/admin', (req,res)=>{
    var GetUsersQuery = `SELECT * FROM USERS WHERE users.username != 'admin'`;
    console.log(GetUsersQuery);
    pool.query(GetUsersQuery, (error, result)=>{
        if (error){
            res.send(error);
        }
        else{
            var results = {'rows': result.rows};
            res.render('pages/adminview.ejs', results);
        }
    })
});



