const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();
const http = require('http').Server(app);
const fetch = require("node-fetch");

const { Pool, Client } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function deckID(){
  await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(async (response) => {
      if (response.ok) {
        var temp = await response.json();
        newDeckID = temp.deck_id;
      } else {
        throw new Error('Response did not return 200');
      }
    })
    .catch(async (error) => {
        console.log(error);
    })
  return newDeckID;
}

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
    console.log(findUser);
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
    console.log(findUser);
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
var roomNum;
var playerIDs = {};
var rooms = {};
app.post('/multiplayerBlackjack',(req,res)=> {
    console.log("post multiplayerBlackjack");
    var user = req.body.id;
    var findUser = `SELECT * FROM users WHERE users.username = '${user}'`;
    pool.query(findUser, async (error,result)=>{
      try{
        if (error)
            res.send(error);
        else{
            var userinfo= {'row' : result.rows[0]};
            console.log(userinfo);
            if (userinfo === undefined || result.rows.length == 0) {
                res.redirect('loginUI.html'); //fail in staying logged in
            }
            else{
                roomNum = await deckID();
                console.log("CHECK HERE", roomNum)
                playerIDs[`${roomNum}`] = [];
                res.render('pages/multiplayerBlackjack', userinfo);
            }
        }
      }
      catch (error){
        res.send(error)
      }
    })


   /*
   //I made this before we chatted on discord so imma just leave it here in case it'll save you any work LOL.

   var createRoom = req.body.roomid;
   var createQuery = ` insert into rooms(roomid, username, score) select '${createRoom}', '${user}', 0);`;
   console.log(createQuery);
   pool.query(createQuery, (error, result) => {
       if (error)
           res.send('ERROR',error);
       else {
           if (result.rowCount === 0) {
               res.render('pages/mainMenu.ejs')
           }
           else {
               res.render('pages/multiplayerBlackjack.ejs')
           }
       }
   });
    */

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

app.post('/roomNum',(req,res)=> {
    var user = req.body.id;
    roomNum = req.body.roomid;
    var findUser = `SELECT * FROM users WHERE users.username = '${user}'`;
    pool.query(findUser, async (error,result)=>{
      try{
        if (error)
            res.send(error);
        else{
            var userinfo= {'row' : result.rows[0]};
            console.log(userinfo);
            if (userinfo === undefined || result.rows.length == 0) {
                res.redirect('loginUI.html'); //fail in staying logged in
            }
            else{
                console.log("CHECK HERE", roomNum)
                res.render('pages/multiplayerBlackjack', userinfo);
            }
        }
      }
      catch (error){
        res.send(error)
      }
    })
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


// .io stuff
io.on('connection', function(socket){
    console.log('connection index');
    //Check how long it has been since last login
    rooms[`${socket.id}`] = roomNum;
    socket.join(`${roomNum}`);
    playerIDs[`${roomNum}`].push(socket.id);
    io.to(`${roomNum}`).emit('IDlist', playerIDs[`${roomNum}`])
    io.to(`${roomNum}`).emit('room', roomNum)
    console.log(playerIDs)
    socket.on('chat msg', function(message){
        console.log(roomNum)
        console.log(message[1]);
        if(rooms[`${socket.id}`] == message[1]){
          io.to(`${rooms[`${socket.id}`]}`).emit('chat msg', socket.username + ' said: ' + message[0] );
        }
    });
    socket.on('username', function(username){
        socket.username = username;
        console.log("username " + username + " and socket.id: " + socket.id);
        io.to(`${rooms[`${socket.id}`]}`).emit('chat msg', `${socket.username} has joined the chat!`)
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
    //test
    socket.on('disconnect', (reason) => {
      var j = playerIDs[`${rooms[`${socket.id}`]}`].indexOf(socket.id);
      playerIDs[`${rooms[`${socket.id}`]}`].splice(j,1);
      if(playerIDs[`${rooms[`${socket.id}`]}`].length == 0){
        delete playerIDs[`${rooms[`${socket.id}`]}`];
      }
      else{
        io.to(`${rooms[`${socket.id}`]}`).emit('IDlist',playerIDs[`${roomNum}`]);
      }
    });
});
