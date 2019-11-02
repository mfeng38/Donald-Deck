const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.redirect('loginUI.html'));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
app.get('/soloBlackjack',(req,res)=> res.render('pages/soloBlackjack'));