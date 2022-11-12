var express = require('express');
var app = express();
var dbConfig = require(__dirname + '/config/dbInfo.js');
var conn = dbConfig.init();

dbConfig.connect(conn);

var bodyParser = require('body-parser');


app.get('/arr', function(req, res) {
    var sql = 'SELECT * FROM User';
    conn.query(sql, function(err, rows, fields) {
        if(err) console.log('query is not executed. select failed.\n' + err);
        else res.render('index.ejs', { arr : rows});
    });
});

app.post('/login', function(request, response) {
    var userID = request.body.id;
    var userPasswd = request.body.passwd;
    if (userID && userPasswd) {
        conn.query('SELECT * FROM User WHERE user_id = ? AND user_passwd = ?', [userID, userPasswd], function(error, results,fields) {
            if(error) throw error;
            if(results.length > 0) {// 로그인 성공시 login_sScreen페이지에 userID값 넘기기
                response.render('login_sScreen.ejs', { username : userID });
                response.redirect('login_sScreen.ejs');
            }
            else {//로그인 실패시 화면
                response.render('login_fScreen.ejs');
                response.redirect('login_fScreen.ejs');

            }
        });
    }
})

app.post('/insertUser', function(request, response) {
    var reqID = request.body.id;
    var reqPasswd = request.body.passwd;
    if (reqID && reqPasswd) {
        conn.query('SELECT user_id FROM User WHERE user_id = ?', [reqID], function(error, results, fields) {
            if(error) throw error;
            if(results.length > 0) { //중복된 id가 존재하는 경우
                response.write("<script>alert('이미 존재하는 ID입니다')</script>");
            }
            else {
                conn.query('INSERT INTO User(user_id, user_passwd) VALUES(?, ?)', [reqID, reqPasswd], function(error, results, fields) {
                    response.write("<script>alert('회원가입 성공!')</script>");
                });

            }
        })
    }
})

app.get('/register', function(request, response) {
    response.render('register.ejs');
    response.redirect('register.ejs');
})



module.exports = app;