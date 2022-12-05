var express = require('express');
var app = express();
var dbConfig = require(__dirname + '/config/dbInfo.js');
var conn = dbConfig.init();

dbConfig.connect(conn);

var bodyParser = require('body-parser');

app.post('/login', function(request, response) {
    var userID = request.body.id;
    var userPasswd = request.body.passwd;
    if (userID && userPasswd) {
        conn.query('SELECT * FROM User WHERE user_id = ? AND user_passwd = ?', [userID, userPasswd], function(error, results,fields) {
            if(error) throw error;
            if(results.length > 0) {// 로그인 성공
                response.render('login_sScreen.ejs', { username : userID });
            }
            else {//로그인 실패
                response.render('login_fScreen.ejs');
            }
        });
    }
})

app.post('/insertUser', function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    var reqID = request.body.id;
    var reqPasswd = request.body.passwd;
    if (reqID && reqPasswd) {
        conn.query('SELECT user_id FROM User WHERE user_id = ?', [reqID], function(error, results, fields) {
            if(error) throw error;
            if(results.length > 0) { //ID가 중복된 경우
                response.write("<script>alert(\"이미 존재하는 ID입니다\")</script>");
                response.write("<script>window.location=\"/server/register\"</script>");
            }
            else {
                conn.query('INSERT INTO User(user_id, user_passwd) VALUES(?, ?)', [reqID, reqPasswd], function(error, results, fields) {
                    response.write("<script charset=\"utf-8\">alert('회원가입 성공!')</script>");
                    response.write("<script>window.location=\"/\"</script>");
                });

            }
        })
    }
})

app.post('/findUser', function(request, response) {
    var targetWord = request.body.searchWord; //나중에 User table말고 history table에서 확인할 예정
    if (targetWord.length > 0) {
        conn.query('SELECT item_name, item_level FROM history WHERE user_id = ?', [targetWord], function(error, results, fields) {
            console.log(results);
            if(error) throw error;
            else if(results.length > 0) {//검색 결과가 있는 경우 여기가 문제................response를 두번 건드리면 안되더라
                return response.render('searchResult.ejs', { result : results, userName : targetWord });
            }
            else {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.write("<script>alert(\"기록이 존재하지 않습니다 :(\")</script>");
                response.write("<script>window.location=\"/server/searchPage\"</script>");
            }
        })
    }
    
})

app.get('/openChest', function(request, response) {
    var bonusRandNum = Math.floor(Math.random() * (101)); // 0~100 사이 난수 발생
    var randNum = Math.floor(Math.random() * (101));
    var userId = request.query.id//body -> query
    console.log(userId);

    if(bonusRandNum <= 0.04) {//신화급 스킨 추가 획득 하는 경우
        conn.query('SELECT name, item_level FROM skin WHERE item_level = \'5\' ORDER BY RAND() LIMIT 1', function(error, bonusResults, field) { 
            conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [bonusResults[0].name, bonusResults[0].item_level, userId]);
            if(error) throw error;
            else if(randNum >= 50) {//스킨 파편
                conn.query('SELECT name, item_level FROM Skin ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    //return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : bonusResults[0].item_level, name : results[0].name, level : results[0].item_level});
                    if(results[0].item_level == '1') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "신화", name : results[0].name, level : "일반"});
                    }

                    else if(results[0].item_level == '2') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "신화", name : results[0].name, level : "서사"});
                    }

                    else if(results[0].item_level == '3') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "신화", name : results[0].name, level : "전설"});
                    }

                    else if(results[0].item_level == '4') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "신화", name : results[0].name, level : "초월"});
                    }

                    else {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "신화", name : results[0].name, level : "신화"});
                    }
                })
            }

            else if(randNum >= 25) {//챔피언 파편
                conn.query('SELECT name, item_level FROM Champion ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "신화", name : results[0].name, level : "일반"});
                })
            }

            else if(randNum >= 15) {//감정표현
                conn.query('SELECT name, item_level FROM Emote ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "신화", name : results[0].name, level : "일반"});
                })
            }

            else if(randNum >= 3.5) {// 와드 파편
                conn.query('SELECT name, item_level FROM Ward ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "신화", name : results[0].name, level : "일반"});
                })
            }

            else {// 아이콘
                conn.query('SELECT name, item_level FROM Icon ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "신화", name : results[0].name, level : "일반"});
                })
            }

        })
        
        
    }

    else if (bonusRandNum <= 3.64) {//추가로 보석을 얻었을 경우
        conn.query('SELECT name, item_level FROM Jewel ORDER BY RAND() LIMIT 1', function(error, bonusResults, field) { 
            conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [bonusResults[0].name, bonusResults[0].item_level, userId]);
            if(error) throw error;
            else if(randNum >= 50) {//스킨 파편
                conn.query('SELECT name, item_level FROM Skin ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    //return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : bonusResults[0].item_level, name : results[0].name, level : results[0].item_level});
                    if(results[0].item_level == '1') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "일반"});
                    }

                    else if(results[0].item_level == '2') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "서사"});
                    }

                    else if(results[0].item_level == '3') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "전설"});
                    }

                    else if(results[0].item_level == '4') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "초월"});
                    }

                    else {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "신화"});
                    }
                })
            }

            else if(randNum >= 25) {//챔피언 파편
                conn.query('SELECT name, item_level FROM Champion ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "일반"});
                })
            }

            else if(randNum >= 15) {//감정표현
                conn.query('SELECT name, item_level FROM Emote ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "일반"});
                })
            }

            else if(randNum >= 3.5) {// 와드 파편
                conn.query('SELECT name, item_level FROM Ward ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "일반"});
                })
            }

            else {// 아이콘
                conn.query('SELECT name, item_level FROM Icon ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "일반"});
                })
            }

        })
    }

    else if (bonusRandNum <= 13.64) { //보너스 상자
        conn.query('SELECT name, item_level FROM BonusChest ORDER BY RAND() LIMIT 1', function(error, bonusResults, field) { 
            conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [bonusResults[0].name, bonusResults[0].item_level, userId]);
            if(error) throw error;
            else if(randNum >= 50) {//스킨 파편
                conn.query('SELECT name, item_level FROM Skin ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    //return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : bonusResults[0].item_level, name : results[0].name, level : results[0].item_level});
                    if(results[0].item_level == '1') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "일반"});
                    }

                    else if(results[0].item_level == '2') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "서사"});
                    }

                    else if(results[0].item_level == '3') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "전설"});
                    }

                    else if(results[0].item_level == '4') {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "초월"});
                    }

                    else {
                        return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "신화"});
                    }
                })
            }

            else if(randNum >= 25) {//챔피언 파편
                conn.query('SELECT name, item_level FROM Champion ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "일반"});
                })
            }

            else if(randNum >= 15) {//감정표현
                conn.query('SELECT name, item_level FROM Emote ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "일반"});
                })
            }

            else if(randNum >= 3.5) {// 와드 파편
                conn.query('SELECT name, item_level FROM Ward ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "일반"});
                })
            }

            else {// 아이콘
                conn.query('SELECT name, item_level FROM Icon ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResultWithBonus.ejs', { bonusName : bonusResults[0].name, bonusLevel : "일반", name : results[0].name, level : "일반"});
                })
            }

        })
    }

    else {//보너스 상품이 없을 경우
            if(randNum >= 50) {//스킨 파편
                conn.query('SELECT name, item_level FROM Skin ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    //return response.render('ChestResult.ejs', { name : results[0].name, level : results[0].item_level});
                    if(results[0].item_level == '1') {
                        return response.render('ChestResult.ejs', { name : results[0].name, level : "일반"});
                    }

                    else if(results[0].item_level == '2') {
                        return response.render('ChestResult.ejs', { name : results[0].name, level : "서사"});
                    }

                    else if(results[0].item_level == '3') {
                        return response.render('ChestResult.ejs', { name : results[0].name, level : "전설"});
                    }

                    else if(results[0].item_level == '4') {
                        return response.render('ChestResult.ejs', { name : results[0].name, level : "초월"});
                    }

                    else {
                        return response.render('ChestResult.ejs', { name : results[0].name, level : "신화"});
                    }
                })
            }

            else if(randNum >= 25) {//챔피언 파편
                conn.query('SELECT name, item_level FROM Champion ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResult.ejs', { name : results[0].name, level : "일반"});
                })
            }

            else if(randNum >= 15) {//감정표현
                conn.query('SELECT name, item_level FROM Emote ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResult.ejs', { name : results[0].name, level : "일반"});
                })
            }

            else if(randNum >= 3.5) {// 와드 파편
                conn.query('SELECT name, item_level FROM Ward ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResult.ejs', { name : results[0].name, level : "일반"});
                })
            }

            else {// 아이콘
                conn.query('SELECT name, item_level FROM Icon ORDER BY RAND() LIMIT 1', function(error, results, field) {
                    conn.query('INSERT INTO history(item_name, item_level, user_id) VALUES(?, ?, ?)', [results[0].name, results[0].item_level, userId]);
                    return response.render('ChestResult.ejs', { name : results[0].name, level : "일반"});
                })
            }
    }
    


})


app.get('/register', function(request, response) {
    response.render('register.ejs');
    //response.redirect('register.ejs');
})


app.get('/searchPage', function(request, response) {
    console.log("test");
    response.render('searchPage');
    //response.redirect('searchPage.ejs');
})


module.exports = app;