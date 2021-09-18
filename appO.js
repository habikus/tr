var express = require('express');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var app = express();
var mysql = require('mysql');
var path = require('path');
const port = process.env.PORT || 5500 ;

const session = require('express-session');
app.use(session({
    secret: 'Özel-Anahtar',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(require('body-parser').urlencoded({
    extended: true
}));
app.use(require('body-parser').json());
app.use(expressLayouts);

// connect to database
function baglan() {
    con = mysql.createConnection({
        
        host: "89.163.146.147",
        user: "yilsoft_kutup", 
        password: "of.616161",       
        database: "yilsoft_kutup",  
       
      /*      host: "localhost",
          user: "root",
          password: "",
          database: "yilsoft_kutup",                 
          timezone: 'utc' // çoook şükür elhamdülillah   "UTC+0"
      */  

        });
        
        /*
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            console.log("Şükürler Olsun")
            console.log('BAĞLANTI BAŞARILIDIR');
 
            var sql = 'SELECT * FROM uyeler';
            con.query(sql, function (err, results) { 
                if (!err) { console.log(results);} 
                     else {console.log('Tablo için Bağlantı başarısız!')}  
            }); 
          });
        */ 
} // bağlantı END
// *************************************

global.kisi="Kullanıcı";

app.get("/", (req, res) => {
    if (req.session.adSoySes) return res.render('index', {
        bilgiler: req.session.adSoySes        
    });   
    res.render('giris');
})

app.get('/sefkat', function (req, res) {
    baglan();  
    var sql = 'SELECT * FROM ogrenciler WHERE ogrencilerid < 20';

    con.query(sql, function (err, results) { 
        res.render('sefkat',{bilgim:results});   
    });

});

app.get('giris', function (req, res) {
    res.render('giris');
});
app.post('/giris', function (req, res) {
    kulanici = req.body.username;
    var sifre = req.body.password;
    baglan();
    var sql = 'SELECT * FROM uyeler WHERE Email LIKE ' + mysql.escape(kulanici) +
        'and Password LIKE ' + mysql.escape(sifre);
    con.query(sql, function (error, results) {
        if (error) {
            console.log('Tabloya bağlantı sağlanamadı!')
        } else {
            if (results.length < 1) {
                console.log("ARADIĞINIZ KAYIT BULUNAMAMIŞTIR");
                //  res.send('Bad user/pass');
                res.render('giris', {
                    durum: "YANLIŞ"
                });
            } else {
                results.forEach(row => {
                    console.log(row.Email + " --> " + row.Password)
                    // isLogin = false;
                    req.session.adSoySes = row.AdSoyad;
                    global.kisi=row.AdSoyad;
                    res.render('index', {durum: row.AdSoyad
                    });
                    // for içinde tanımlı row        
                });
            }
        }
    });
});
app.get('/kitaplar', function (req, res) {
    if (req.session.adSoySes) return res.render('kitaplar', {
        bilgiler: req.session.adSoySes
    });
    // res.render('giris');
    //  res.render('kitaplar');
});
app.get('/ogrenciler', function (req, res) {
    if (req.session.adSoySes) return res.render('ogrenciler', {
        bilgiler: req.session.adSoySes
    });
    res.render('giris');
});
app.get('/islemler', function (req, res) {
    if (req.session.adSoySes) return res.render('islemler', {
        bilgiler: req.session.adSoySes
    });
    res.render('giris');
});
app.get('/hakkimizda', function (req, res) {
    if (req.session.adSoySes) return res.render('hakkimizda', {
        bilgiler: req.session.adSoySes
    });
    res.render('giris');
});
app.get('/iletisim', function (req, res) {
    if (req.session.adSoySes) return res.render('iletisim', {
        bilgiler: req.session.adSoySes
    });
    res.render('giris');
});
app.get('/listeyukle', function (req, res) {
    console.log("ELHAMDÜ LİLLAHİ GELDİ")
    baglan();
    var sql = 'SELECT adisoyadi, dogumtarihi FROM liste';
    con.query(sql, function (err, results) {
        if (!err) {
            data = results;
            console.log(data);
            console.log("ELHAMDÜ LİLLAHİ ALA KÜLLİ HAL")
            res.json(data);
            //  result = JSON.stringify(data);
            //  res.render('table',{data:results});  
        }
    });
});
app.get('/kuran', function (req, res) {
    if (req.session.adSoySes) return res.render('kuran', {
        bilgiler: req.session.adSoySes
    });
    res.render('giris');
});
app.get('/kuranyukle', function (req, res) {

    baglan();
    var sql = 'SELECT * FROM Ayetler order by id';
    con.query(sql, function (err, results) {
        if (!err) {
            data = results;
            res.json(data);
            //  result = JSON.stringify(data);
            //   res.render('table',{data:results});  
        }
    });
});
app.get('/cikis', function (req, res) {
    req.session.destroy();
    res.render('giris');
});
app.get("/kitapyukle", function (req, res) {
    baglan();
    var sql = 'SELECT * FROM kitaplar order by kitapadi';
    con.query(sql, function (err, results) {
        if (!err) {
            data = results;
            res.json(data);
            //  result = JSON.stringify(data);
            //   res.render('table',{data:results});  
        }
    });
});
app.post("/kaydet", function (req, res) {
    baglan();
    var data = req.body;

    console.log('1. BASAMAK');
    console.log(data.idtxt);
    // return false;
 
    if (data.idtxt > 0) {

        var sql = 'UPDATE kitaplar SET kitapkodu =? , kitapadi =? , yazar =?, sayfa =?, kitapturu =?, aciklama =?, yayinevi =?   WHERE kitaplarid =' + data.idtxt;
        var query = con.query(sql, [data.kodutxt, data.kitapaditxt, data.yazartxt,
            data.sayfatxt, data.turutxt, data.aciklamatxt, data.yayinevitxt
        ], function (err, result) {
            if (!err) {
                console.log("KAYIT GÜNCELLENDİ!!");
                //res.render('listele', {title: 'POST test'});
            } else {
                console.log('GÜNCELLEME YAPILAMADI !!!');
            }
        });
    } else {
        var sql = "INSERT INTO kitaplar (kitapkodu, kitapadi,yazar,sayfa,kitapturu,aciklama,yayinevi) VALUES ('" +
            data.kodutxt + "', '" + data.kitapaditxt + "','" + data.yazartxt + "','" + data.sayfatxt + "', '" + data.turutxt + "','" + data.aciklamatxt + "','" + data.yayinevitxt + "')";
        con.query(sql, function (err, result) {
            if (!err) {
                console.log("1 KAYIT EKLENDİ HADİ HAYIRLISI " + data.kitapaditxt);
            } else {
                console.log('KAYIT İŞLEMİ YAPILAMADI!!!');
            }
        });
    }

    con.query('SELECT * FROM kitaplar order by kitaplarid', function (err, results, fields) {
        if (!err) {
            console.log("HAYIRLI İLE GELDİ")
            res.json(results);
        } else {
            console.log('İŞLEM BAŞARISIZ!!!');
        }
    });
    console.log('2. BASAMAK');
});
app.post('/sil', function (req, res) {
    var data = req.body;
    baglan();
    var sql = 'DELETE FROM kitaplar WHERE kitaplarid =' + data.idtxt // mysql.escape(data.idtxt);
    con.query(sql, function (err, results) {
        if (!err) {
            console.log('SİLME İŞLEMİ BAŞARILI');

            con.query('SELECT * FROM kitaplar order by kitaplarid', function (err, results, fields) {
                if (!err) {
                    console.log("HAYIRLI İLE GELDİ")
                    res.json(results);
                } else {
                    console.log('İŞLEM BAŞARISIZ!!!');
                }
            });
        } else {
            console.log('SİLME İŞLEMİ YAPILAMADI!!!');
        }
    });
});
app.post("/guncelle", function (req, res) {
    baglan();
    var data = req.body;
    var sql = 'UPDATE kitaplar SET kitapkodu =? , kitapadi =? , yazar =?, sayfa =?, kitapturu =?, aciklama =?, yayinevi =?   WHERE kitaplarid =' + data.idtxt;
    var query = con.query(sql, [data.kodutxt, data.kitapaditxt, data.yazartxt,
        data.sayfatxt, data.turutxt, data.aciklamatxt, data.yayinevitxt
    ], function (err, result) {
        if (!err) {
            console.log("KAYIT GÜNCELLENDİ!!");
            //res.render('listele', {title: 'POST test'});
        } else {
            console.log('GÜNCELLEME YAPILAMADI !!!');
        }
    });

    con.query('SELECT * FROM kitaplar order by kitaplarid', function (err, results, fields) {
        if (!err) {
            console.log("HAYIRLI İLE GELDİ")
            res.json(results);
        } else {
            console.log('İŞLEM BAŞARISIZ!!!');
        }
    });

});
app.post('/getir', function (req, res) {
    var txt = JSON.stringify(req.body);
    console.log('--->' + txt);
    var str = JSON.parse(txt);
    console.log('--->' + str.kelime);
    baglan();
    // con.query('SELECT * FROM rehber WHERE ad LIKE "%'+mysql.escape(str)+'%"',function(err, rows, fields) { 
    var sql = 'SELECT * FROM kitaplar WHERE kitaplarid LIKE ' + mysql.escape(str.kelime);
    con.query(sql, function (error, results) {
        if (error) {
            console.log('TABLO dan gerekli kayıtlar alınamadı');
            callback(error, null);
        }

        results.forEach(row => {
            console.log(row.kitaplarid + " --> " + row.kitapadi + "----" + row.yazar + "----" + row.yayinevi);
        });
        if (results.length < 1) {
            console.log("ARADIĞINIZ KAYIT BULUNAMAMIŞTIR");
            let data = [{
                durum: 'yoktur'
            }];
            res.json(data);
        } else {
            data = results;
            res.json(data);
            // BU SATIR OLMASA DA ÇALIŞIYOR -->
            // --> res.render('listele',{page_title:"SAYFA BAŞLIĞI", data:results});           
        }
    });
});
app.post('/suz', function (req, res) {
    var data = req.body;
    console.log("BİSMİLLAH : " + data.kelime)
    baglan();
    var sql = 'SELECT * FROM kitaplar WHERE kitapadi LIKE "' + data.kelime + '%"';
    con.query(sql, function (error, results) {
        if (error) {
            console.log('BAĞLANTI BAŞARISIZ');
        }

        results.forEach(row => {
            console.log(row.kitaplarid + " --> " + row.kitapadi + "----" + row.yazar + "----" + row.yayinevi);
        });
        if (results.length < 1) {
            console.log("ARADIĞINIZ KAYIT BULUNAMAMIŞTIR");
        } else {
            data = results;
            res.json(data);
        }
    });
});
app.post('/filitre', function (req, res) {
    var data = req.body;
    console.log("ÇOOOOOOOOOOOOOOOOOOOOOOOOOOOK ŞÜKÜR : " + data.kelime)
    baglan();
    var sql = 'SELECT * FROM kitaplar WHERE kitapadi LIKE "' + data.kelime + '%"';
    con.query(sql, function (error, results) {
        if (error) {
            console.log('BAĞLANTI BAŞARISIZ');
        }

        results.forEach(row => {
            console.log(row.kitaplarid + " --> " + row.kitapadi + "----" + row.yazar + "----" + row.yayinevi);
        });
        if (results.length < 1) {
            console.log("ARADIĞINIZ KAYIT BULUNAMAMIŞTIR");
            let data = [{
                durum: 'yoktur'
            }];
            res.json(data);
        } else {
            data = results;
            res.json(data);
        }
    });
});
app.post('/getirogrenci', function (req, res) {
    var txt =req.body;
    console.log('+++>' +  txt.kelime);
    baglan();
    var sql = 'SELECT * FROM ogrenciler WHERE ogrencilerid LIKE ' + txt.kelime;
    con.query(sql, function (error, results) {
        if (error) {
            console.log('TABLO dan gerekli kayıtlar alınamadı');
            callback(error, null);
        }
            console.log(results[0].ogrencilerid + " --> " + results[0].ogrenciadi + "----" + results[0].sinifi);

        if (results.length < 1) {
            console.log("ARADIĞINIZ KAYIT BULUNAMAMIŞTIR");
            let data = [{
                durum: 'yoktur'
            }];
            res.json(data);
        } else {
            data = results;
            res.json(data);
            // BU SATIR OLMASA DA ÇALIŞIYOR -->
            // --> res.render('listele',{page_title:"SAYFA BAŞLIĞI", data:results});           
        }
    });
});
app.get("/ogrenciyukle", function (req, res) {
    baglan();
    var sql = 'SELECT * FROM ogrenciler order by ogrenciadi';
    con.query(sql, function (err, results) {
        if (!err) {
            data = results;
            res.json(data);
            //  result = JSON.stringify(data);
            //   res.render('table',{data:results});  
        }
    });
});
app.post('/suzogrenci', function (req, res) {
    var txt = JSON.stringify(req.body);
    console.log('--->' + txt);
    var str = JSON.parse(txt);
    console.log('--->' + str.kelime);
    baglan();
    var sql = 'SELECT * FROM ogrenciler WHERE ogrenciadi LIKE "' + str.kelime + '%"';
    //var sql = 'SELECT * FROM rehber WHERE ad LIKE ' +  mysql.escape(str.kelime);
    con.query(sql, function (error, results) {
        if (error) {
            console.log('BAĞLANTI BAŞARISIZ');
        }

        results.forEach(row => {
            console.log(row.ogrencilerid + " --> " + row.ogrenciadi + "----" + row.sinifi);
        });
        if (results.length < 1) {
            console.log("ARADIĞINIZ KAYIT BULUNAMAMIŞTIR");
        } else {
            data = results;
            res.json(data);
        }
    });
});
app.post("/kaydetogrenci", function (req, res) {
    baglan();
    var data = req.body;
    console.log('1. BASAMAK');
    console.log(data.idtxt);
    // return false;
 
    if (data.idtxt > 0) {

        var sql = 'UPDATE ogrenciler SET ogrencino =? , ogrenciadi =? , sinifi =?, aciklama =?, adres =?, telefon =?, email =?   WHERE ogrencilerid =' + data.idtxt;
        var query = con.query(sql, [data.nosutxt, data.ogrenciaditxt, data.sinifitxt,
            data.aciklamatxt, data.adrestxt, data.telefontxt, data.emailtxt
        ], function (err, result) {
            if (!err) {
                console.log("KAYIT GÜNCELLENDİ!!");
                //res.render('listele', {title: 'POST test'});
            } else {
                console.log('GÜNCELLEME YAPILAMADI !!!');
            }
        });

    } else {
    var sql = "INSERT INTO ogrenciler (ogrencino, ogrenciadi,sinifi,aciklama,adres,telefon,email) VALUES ('" +
        data.nosutxt + "', '" + data.ogrenciaditxt + "','" + data.sinifitxt + "','" + data.aciklamatxt + "', '" + data.adrestxt + "','" + data.telefontxt + "','" + data.emailtxt + "')";
    con.query(sql, function (err, result) {
        if (!err) {
            console.log("1 KAYIT EKLENDİ HADİ HAYIRLISI " + data.ogrenciaditxt);
        } else {
            console.log('KAYIT İŞLEMİ YAPILAMADI!!!');
        }
    });
    }

    con.query('SELECT * FROM ogrenciler order by ogrencilerid', function (err, results, fields) {
        if (!err) {
            console.log("HAYIRLI İLE GELDİ")
            res.json(results);
        } else {
            console.log('İŞLEM BAŞARISIZ!!!');
        }
    });
    console.log('2. BASAMAK');
});
app.post("/guncelleogrenci", function (req, res) {
    baglan();
    var data = req.body;
    var sql = 'UPDATE ogrenciler SET ogrencino =? , ogrenciadi =? , sinifi =?, aciklama =?, adres =?, telefon =?, email =?   WHERE ogrencilerid =' + data.idtxt;
    var query = con.query(sql, [data.nosutxt, data.ogrenciaditxt, data.sinifitxt,
        data.aciklamatxt, data.adrestxt, data.telefontxt, data.emailtxt
    ], function (err, result) {
        if (!err) {
            console.log("KAYIT GÜNCELLENDİ!!");
            //res.render('listele', {title: 'POST test'});
        } else {
            console.log('GÜNCELLEME YAPILAMADI !!!');
        }
    });

    con.query('SELECT * FROM ogrenciler order by ogrencilerid', function (err, results, fields) {
        if (!err) {
            console.log("HAYIRLI İLE GELDİ")
            res.json(results);
        } else {
            console.log('İŞLEM BAŞARISIZ!!!');
        }
    });

});
app.post('/silogrenci', function (req, res) {
    var data = req.body;
    console.log('--->' + data.idtxt);
    baglan();
    var sql = 'DELETE FROM ogrenciler WHERE ogrencilerid =' + mysql.escape(data.idtxt);
    con.query(sql, function (err, results) {
        if (!err) {
            console.log('SİLME İŞLEMİ BAŞARILI');

            con.query('SELECT * FROM ogrenciler order by ogrencilerid', function (err, results, fields) {
                if (!err) {
                    console.log("HAYIRLI İLE GELDİ")
                    res.json(results);
                } else {
                    console.log('İŞLEM BAŞARISIZ!!!');
                }
            });
        } else {
            console.log('SİLME İŞLEMİ YAPILAMADI!!!');
        }
    });
});
app.post("/kaydethareket", function (req, res) {
    baglan();
    var data = req.body;
    var sql = "INSERT INTO hareketler (aciklama, islemtarihi, kitaplarid, ogrenciadi) VALUES ('" +
        data.aciklamatxt + "','" + data.tarihtxt + "','" + data.kitapidtxt + "', '" + data.ogrenciaditxt + "')";
    con.query(sql, function (err, result) {
        if (!err) {
            console.log("1 KAYIT EKLENDİ HADİ HAYIRLISI " + data.ogrenciaditxt);
        } else {
            console.log('KAYIT İŞLEMİ YAPILAMADI!!!');
        }
    });
    con.query('SELECT * FROM hareketler order by hareketlerid', function (err, results, fields) {
        if (!err) {
            console.log("HAYIRLI İLE GELDİ")
            res.json(results);
        } else {
            console.log('İŞLEM BAŞARISIZ!!!');
        }
    });
});
app.post('/silhareket', function (req, res) {
    var data = req.body;
    baglan();
    var sql = 'DELETE FROM hareketler WHERE hareketlerid =' + data.kelime // mysql.escape(data.idtxt);
    con.query(sql, function (err, results) {
        if (!err) {
            console.log('SİLME İŞLEMİ BAŞARILI');

            con.query('SELECT * FROM hareketler order by hareketlerid', function (err, results, fields) {
                if (!err) {
                    console.log("HAYIRLI İLE GELDİ")
                    res.json(results);
                } else {
                    console.log('İŞLEM BAŞARISIZ!!!');
                }
            });
        } else {
            console.log('SİLME İŞLEMİ YAPILAMADI!!!');
        }
    });  
});
app.get("/hareketyukle", function (req, res) {
    baglan();
    var sql = "SELECT hareketlerid, hareketler.aciklama, islemtarihi, ogrenciadi, kitaplar.kitapadi FROM hareketler JOIN kitaplar ON kitaplar.kitaplarid = hareketler.kitaplarid order by hareketlerid desc";
    con.query(sql, function (err, results) {
        if (err) throw err;
        data = results;
        res.json(data);
        console.log(results);

        console.log("TARİH:" + data[0].islemtarihi + " Aciklama:" + data[0].aciklama)



    });
});
app.post("/onunhareketyukle", function (req, res) {
    baglan();
    //var data = req.body;
    var txt = JSON.stringify(req.body);
    var str = JSON.parse(txt);

    var sql = 'SELECT hareketlerid, hareketler.aciklama, islemtarihi, ogrenciadi, kitaplar.kitapadi FROM hareketler JOIN kitaplar ON kitaplar.kitaplarid = hareketler.kitaplarid  WHERE  ogrenciadi = ' +  mysql.escape(str.kelime) + ' order by hareketlerid desc';
    con.query(sql, function (err, results) {
        if (err) throw err;
        data = results;
        res.json(data); 
    });
});
app.post("/guncellehareket", function (req, res) {
    baglan();
    var data = req.body;

    console.log(data.idtxt + "---" + data.kitapidtxt);

    var sql = 'UPDATE hareketler SET aciklama =? , islemtarihi =? , kitaplarid =?, ogrenciadi =?  WHERE hareketlerid =' + data.idtxt;
    var query = con.query(sql, [data.aciklamatxt, data.tarihtxt, data.kitapidtxt, data.ogrenciaditxt], function (err, result) {
        if (!err) {
            console.log("KAYIT GÜNCELLENDİ!!");
        } else {
            console.log('GÜNCELLEME YAPILAMADI !!!');
        }
    });

    con.query('SELECT * FROM hareketler order by hareketlerid', function (err, results, fields) {
        if (!err) {
            console.log("HAYIRLI İLE GELDİ")
            res.json(results);
        } else {
            console.log('İŞLEM BAŞARISIZ!!!');
        }
    });

});
app.post('/getirhareket', function (req, res) {
    var data = req.body;
    console.log('--->' + data.kelime);
    baglan();
    baglan();
    //  var sql = 'SELECT * FROM hareketler WHERE hareketlerid LIKE ' + mysql.escape(data.kelime);
    var sql = "SELECT hareketlerid, hareketler.aciklama, islemtarihi, ogrenciadi, hareketler.kitaplarid, kitaplar.kitapadi FROM hareketler JOIN kitaplar ON kitaplar.kitaplarid = hareketler.kitaplarid WHERE hareketlerid LIKE " + mysql.escape(data.kelime);
    con.query(sql, function (error, results) {
        if (error) {
            console.log('TABLO dan gerekli kayıtlar alınamadı');
            callback(error, null);
        }
        if (results.length < 1) {
            console.log("ARADIĞINIZ KAYIT BULUNAMAMIŞTIR");
            let data = [{
                durum: 'yoktur'
            }];
            res.json(data);
        } else {
            data = results;
            res.json(data);
            // BU SATIR OLMASA DA ÇALIŞIYOR -->
            // --> res.render('listele',{page_title:"SAYFA BAŞLIĞI", data:results});           
        }
    });
});
app.get('/yeniKitap', function (req, res) {
    res.render('yeniKitap');
});
 

app.listen(port, () => {
    console.log("Örnek uygulama dinleniyor inşallah." + port);
  })
 
  
 //app.listen(port, '127.0.0.1', () => {
 //////app.listen(port, () => {  /////
 // baglan()
 // console.log('Örnek Bu uygulama çalışıyor  http://localhost:${port}')
 // })