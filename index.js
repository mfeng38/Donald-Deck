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
                //console.log(`mystats index.js`, userinfo);
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

app.post('/soloBlackjack',(req,res)=> {
    console.log("post soloBlackjack");
    var user = req.body.id;
    var findUser = `SELECT * FROM users WHERE users.username = '${user}'`;
    pool.query(findUser, (error,result)=>{
        if (error)
            res.send(error);
        else{
            var userinfo= {'row' : result.rows[0]};
            console.log(userinfo);
            if (userinfo === undefined || result.rows.length == 0) {
                res.redirect('loginUI.html'); //fail in staying logged in
            }
            else{
                res.render('pages/soloBlackjack', userinfo);
            }
        }
    })


});

var roomIDs = [];  // FOR MULTIPLAYER
app.post('/createMatch', (req,res)=>{
    //create a room ID that's not already there
    var roomID = roomIDs.length;
    roomIDs.push(roomID);
    console.log('create match room ID: ', roomID); 
    var user = req.body.id;
    var UsertoRoom = 'UPDATE users SET roomid ='
    UsertoRoom = UsertoRoom + `'${roomID}' WHERE username = '${user}';`;
    console.log('usertoRoom: ', UsertoRoom);
    pool.query(UsertoRoom,(error, result)=>{
        if (error)
            res.send('createMatch ERROR: ' + error);
        else{
            var findUser = `SELECT * FROM users WHERE username = '${user}'`;
            pool.query(findUser, (error2,result2)=>{
                if (error2)
                    res.send(error2);
                else{

                    var userinfo= {'row' : result2.rows[0]};
                    console.log(userinfo);
                    if (userinfo === undefined || result2.rows.length == 0) {
                        res.redirect('loginUI.html'); //fail in staying logged in
                    }
                    else{
                        res.render('pages/multiplayerBlackjack', userinfo);
                    }
                }
            });
        }
    });
});

app.post('/multiplayerBlackjack',(req,res)=> {
    // this is for joining rooms that have already been created
    console.log("post multiplayerBlackjack");
    var user = req.body.id;
    var givenRoomID = req.body.roomid;
    //search current room IDs
    for (var i=0; i< roomIDs.length; i++){
        if (roomIDs[i] == givenRoomID){
            var UsertoRoom = `UPDATE users SET roomid = '${givenRoomID}' WHERE username = '${user}';`;
            console.log('usertoRoom: ', UsertoRoom);
            pool.query(UsertoRoom,(error, result)=>{
                if (error)
                    res.send('joinMatch ERROR: ' + error);
                else{
                    var findUser = `SELECT * FROM users WHERE users.username = '${user}'`;
                    pool.query(findUser, (error2,result2)=>{
                        if (error2)
                            res.send(error2);
                        else{
                            var userinfo= {'row' : result2.rows[0]};
                            console.log(userinfo);
                            if (userinfo === undefined || result2.rows.length == 0) {
                                res.redirect('loginUI.html'); //fail in staying logged in
                            }
                            else{
                                res.render('pages/multiplayerBlackjack', userinfo);
                                
                            }
                        }
                    });
                }
            });
        }
    }
    //If cannot find, load the join fail page
    var findUser = `SELECT * FROM users WHERE users.username = '${user}'`;
    pool.query(findUser, (error2,result2)=>{
        if (error2)
            res.send(error2);
        else{
            var userinfo= {'row' : result2.rows[0]};
            console.log(userinfo);
            if (userinfo === undefined || result2.rows.length == 0) {
                res.redirect('loginUI.html'); //fail in staying logged in
            }
            else{
                res.render('pages/JoinMatchfail.ejs', userinfo);
            }
        }
    });
});

app.post('/joinMatch', (req, res) => {
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
                res.render('pages/JoinMatch.ejs', userinfo);
            }
        }
    });
});


//rebuys
app.post('/rebuy', (req,res)=>{
    var user = req.body.id;
    var findUser = `SELECT * FROM users WHERE users.username = '${user}'`;
    //console.log("mainmenu",findUser);
    pool.query(findUser, (error, result) => {
        if (error){
            res.send('ERROR',error);
        }
        else {
            if (result.rowCount === 0) {
                res.render('pages/createAccountIncorrect.ejs')
            }
            else {
                newCreditCount = result.rows[0].credits + 100;
                var update = `UPDATE users SET credits = ${newCreditCount} WHERE users.username = '${user}';`;
                console.log(result.rows[0].rebuys);
                var newrebuys = result.rows[0].rebuys + 1;
                update = update + ` UPDATE users SET rebuys = ${newrebuys} WHERE users.username = '${user}';`;
                console.log(update);
                pool.query(update, (erroragain,resultagain)=>{
                    if (erroragain)
                        res.send('ERROR', erroragain);
                        //otherwise, do nothing i suppose? or maybe send something?
                    else{
                        pool.query(findUser, (erragains, finalinfo)=>{
                            if (erragains){
                                res.send('ERROR', erragains);
                            }
                            else{
                                var userinfo = {'row': result.rows[0]};
                                res.render('pages/mystats.ejs', userinfo);
                            }
                        })

                    }
                });
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


// .io stuff --> multiplayer
var playerIDs = [];
//setInterval(()=>io.emit('time',new Date().toTimeString()), 1000);
io.of('/multiplayerBlackjack').on('connection', function(socket){
    console.log('connection index');
    //Check how long it has been since last login
    playerIDs.push(socket.id);
    io.of('/multiplayerBlackjack').emit('IDlist', playerIDs)
    socket.on('chat msg', function(message){
        //console.log(message);
        io.of('/multiplayerBlackjack').emit('chat msg', socket.username + ' said: ' + message );
    });
    socket.on('username', function(username){
        socket.username = username;
        console.log("username " + username + " and socket.id: " + socket.id);
        io.of('/multiplayerBlackjack').emit('chat msg', `${socket.username} has joined the chat!`)
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
                                io.of('/multiplayerBlackjack').to(`${socket.id}`).emit('startGame', newCreditCount);
                                io.of('/multiplayerBlackjack').to(`${socket.id}`).emit('newCredits', newCreditCount);
                            }
                        });
                    }
                }
            }
        });
    });
    socket.on('blackjackPay',function(bet){ //if get 21 - pay 3:2
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
                    var newCreditCount = bet *3 + credits;
                    var addCredits = `UPDATE users SET credits = ${newCreditCount} WHERE users.username = '${socket.username}'`;
                    pool.query(addCredits, (err, res)=>{
                        if (error) socket.emit("ERROR", err);
                        else{
                            console.log("index bjplay new credits: ", newCreditCount);
                            io.of('/multiplayerBlackjack').to(`${socket.id}`).emit('newCredits', newCreditCount);
                        }
                    });
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
                    var newCreditCount = bet * 2 + credits;
                    var addCredits = `UPDATE users SET credits = ${newCreditCount} WHERE users.username = '${socket.username}'`;
                    pool.query(addCredits, (err, res)=>{
                        if (error) socket.emit("ERROR", err);
                        else{
                            console.log("multiplayer index new credits: ", newCreditCount);
                            io.of('/multiplayerBlackjack').to(`${socket.id}`).emit('newCredits', newCreditCount);
                        }
                    });
                }
            }
        });

    });
    socket.on('disconnect', (reason) => {
      var j = playerIDs.indexOf(socket.id);
      playerIDs.splice(j,1);
      io.of('/multiplayerBlackjack').emit('IDlist',playerIDs);
    });
});


//solo  

io.of('/soloBlackjack').on('connection', function(socket){
    socket.on('chat msg', function(message){
        //console.log(message);
        io.of('/soloBlackjack').emit('chat msg', socket.username + ' said: ' + message );
    });
    socket.on('username', function(username){
        socket.username = username;
        console.log("username " + username + " and socket.id: " + socket.id);
        io.of('/soloBlackjack').emit('chat msg', `${socket.username} has joined the chat!`)
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
                        var UpdateQuery = `UPDATE users SET credits = '${newCreditCount}' WHERE users.username = '${socket.username}'`;
                        pool.query(UpdateQuery, (error,result)=>{
                            if (error){
                                socket.emit("ERROR:", error);
                            }
                            else{
                                io.of('/soloBlackjack').to(`${socket.id}`).emit('startGame', newCreditCount);
                                io.of('/soloBlackjack').to(`${socket.id}`).emit('newCredits', newCreditCount);
                            }
                        });
                    }
                }
            }
        });
    });
    socket.on('blackjackPay',function(bet){ //if get 21 - pay 3:2
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
                    var newCreditCount = bet *3 + credits;
                    var addCredits = `UPDATE users SET credits = ${newCreditCount} WHERE users.username = '${socket.username}'`;
                    pool.query(addCredits, (err, res)=>{
                        if (error) 
                            socket.emit("ERROR", err);
                        else{
                            //console.log("index bjplay new credits: ", newCreditCount);
                            io.of('/soloBlackjack').to(`${socket.id}`).emit('newCredits', newCreditCount);
                        }
                    });
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
                    var newCreditCount = bet * 2 + credits;
                    var addCredits = `UPDATE users SET credits = ${newCreditCount} WHERE users.username = '${socket.username}'`;
                    pool.query(addCredits, (err, res)=>{
                        if (error) socket.emit("ERROR", err);
                        else{
                            //console.log("index payout solo new credits: ", newCreditCount);
                            io.of('/soloBlackjack').to(`${socket.id}`).emit('newCredits', newCreditCount);
                        }
                    });
                }
            }
        });
    });
});