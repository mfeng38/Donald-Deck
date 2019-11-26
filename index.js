const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();
const http = require('http').Server(app);

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
//app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.get('/test', (req, res) => res.render('pages/soloBlackjackTEST'));
app.post('/soloBlackjack',(req,res)=> {
    console.log("post soloBlackjack");
    var findUser = `SELECT * FROM users WHERE users.username = '${req.body.id}'`; // Maybe not from users, maybe from diff table
    pool.query(findUser, (error,result)=>{
        if (error)
            res.send(error);
        else{
            var userinfo= {'row' : result.rows[0]};
            console.log(userinfo);
            if (userinfo === undefined || result.rows.length == 0) {
                res.redirect('pages/loginUI.html'); //fail in staying logged in
            }
            else{
                res.render('pages/soloBlackjack', userinfo);
            }
        }
    })


});

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
            res.send('ERROR',error);
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

app.post('/myStats', (req, res) => {
    var user = req.body.id;
    var findUser = `SELECT * FROM users WHERE users.username = '${user}'`;
    //console.log("mystats",findUser);
    pool.query(findUser, (error, result) => {
        if (error)
            res.send('ERROR',error);
        else {
            if (result.rowCount === 0) {
                res.render('pages/createAccountIncorrect.ejs')
            }
            else {
                var userinfo= {'row' : result.rows[0]};
                console.log(`mystats index.js`, userinfo);
                res.render('pages/mystats.ejs', userinfo);
                //console.log("rendered");
            }
        }
    });
});

app.post('/mainMenu', (req,res)=>{
    var user = req.body.id;
    var findUser = `SELECT * FROM users WHERE users.username = '${user}'`;
    //console.log("mainmenu",findUser);
    pool.query(findUser, (error, result) => {
        if (error)
            res.send('ERROR',error);
        else {
            if (result.rowCount === 0) {
                res.render('pages/createAccountIncorrect.ejs')
            }
            else {
                var userinfo = {'rows': result.rows };
                res.render('pages/mainMenu.ejs', userinfo );
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


//For socket.io using express
const io = require('socket.io')(http);
var server = http.listen(PORT, function(){
    console.log('listening http index.js Port: ' + PORT);
});


// Socket.io stuff
setInterval(()=>io.emit('time',new Date().toTimeString()), 1000);
io.on('connection', function(socket){
    console.log('connection index ');
    socket.emit('test', {msg: 'testing: socket.io emit from index.js'});
    /*socket.on('subtractbet', function(data){ //data = user, bet
        console.log(data);
        var poolquery = ``; // access credits using user, and return credits

    })*/
    socket.on('chat msg', function(message){
        //console.log(message);
        io.emit('chat msg', socket.username + ' said: ' + message );
    });
    socket.on('username', function(username){
        socket.username = username;
        console.log("username " + username + " and socket.id: " + socket.id);
        io.emit('chat msg', `${socket.username} has joined the chat!`)
    });
    socket.on('checkBet', function(bet){
        var findUser = `SELECT * FROM users WHERE users.username = '${socket.username}'`;
        //console.log("mystats",findUser);
        pool.query(findUser, (error, result) => {
            if (error)
                socket.emit('ERROR',error);
            else {
                if (result.rowCount === 0) {
                    socket.emit('ERROR', error);
                }
                else {
                    var credits = result.rows[0].credits;
                    console.log(`index.js finds credits: `, credits);
                    var newCreditCount = credits - bet;
                    if (newCreditCount >= 0){
                        //pool query again replace new credit count
                        var UpdateQuery = `UPDATE users SET credits = ${newCreditCount} WHERE users.username = '${socket.username}'`;
                        pool.query(UpdateQuery, (error,result)=>{
                            if (error){
                                socket.emit("ERROR:", error);
                            }
                            else{
                                io.to(`${socket.id}`).emit('startGame', newCreditCount);
                                io.to(`${socket.id}`).emit('newCredits', newCreditCount);
                            }
                        });
                    }
                }
            }
        });
    });
    socket.on('payout', function(bet){
        var findUser = `SELECT * FROM users WHERE users.username = '${socket.username}'`;
        pool.query(findUser, (error, result)=>{
            if (error)
                socket.emit('ERROR', error);
            else{
                if (result.rowCount === 0){
                    socket.emit('ERROR', error);
                }
                else{
                    var credits = result.rows[0].credits;
                    var newCreditCount = bet * 3 + credits;
                    var addCredits = `UPDATE users SET credits = ${newCreditCount} WHERE users.username = '${socket.username}'`;
                    pool.query(addCredits, (err, res)=>{
                        if (error) socket.emit("ERROR", err);
                        else{
                            //console.log("new credits: ", newCreditCount);
                            io.to(`${socket.id}`).emit('newCredits', newCreditCount);
                        }
                    });
                }
            }
        });
        
    });
});
