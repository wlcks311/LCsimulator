const mysql = require('mysql');
const dbInfo = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '1234',
    database: 'lcsimul'
}; //information of database

module.exports = {
    init: function() { //db와 서버간의 연결 객체를 반환하는 init()함수
        return mysql.createConnection(dbInfo);
    },
    connect: function(conn) {//실제로 데이터 교환을 위해 연결을 시키는 connect() 함수
        conn.connect(function(err) {
            if(err) console.error('mysql connection error: ' + err);
            else console.log('mysql is connected successfully');
        });
    }

};
