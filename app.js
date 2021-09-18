const express = require('express')
var expressLayouts = require('express-ejs-layouts');
const app = express()
var mysql = require('mysql');
var path = require('path');

var compression = require('compression');

app.use(compression());

//app.set('port', (process.env.PORT || 5500));

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('views', './views');
 
    var mysql      = require('mysql');
    var con = mysql.createConnection({
      host     : '89.163.146.147',
      user     : 'yilsoft_kutup',
      password : 'of.616161',
      database : 'yilsoft_kutup'
    });
/*
function baglan() {
       con = mysql.createConnection({
       // host: ENV['89.163.146.147'],
        host: "89.163.146.147",
        user: "yilsoft_kutup",
        // password: ENV['of.616161'],
        password: "of.616161",   
        //database: ENV['yilsoft_kutup'],
        database: "yilsoft_kutup",  
    });
} // bağlantı END
*/

app.get("/", function (req, res) {

   // baglan();
    var sql = 'SELECT * FROM ogrenciler WHERE ogrencilerid < 20';

    con.query(sql, function (err, results) {
        console.log(results);
        res.render('home', { bilgim: results });     
    })
})

/*
app.get('/', (req, res) => {
    res.send('Haydi Bismillah!')
})

 app.listen(port, () => {
   console.log("Örnek uygulama dinleniyor inşallah." + port);
 })

 app.listen(app.get('port'), function() {
    console.log('Elhamdülillah', app.get('port'));
});*/

app.listen(PORT, () => {
    console.log(`HAMDOLSUN ${PORT}.`);
  })