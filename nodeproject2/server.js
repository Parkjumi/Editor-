var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var fs = require('fs');
var conn = require('connect');
var mysql = require('mysql');
var bodyparser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var multer = require('multer');

var server = app.listen(3000,function(){
	console.log("서버 연결 성공!");
});

var conn = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: 'qlsdl4320',
  database: 'gramdb'
});

conn.connect(function(err){
if(!err) {
    console.log("Database 연결 성공!");
} else {
    console.log("Database 연결 실패!");
}
}); //mysql접속

app.use(cookieParser()); //cookie-parser설정

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
    extended: true
}));

app.set('view engine','ejs');
app.set('views');

app.use(express.static(path.join(__dirname)));

app.use(session({
  secret : 'my key',
  resave: true,
  saveUninitialized: true,
	cookie: {
    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
  }
}));

app.get('/', function (req, res) {
	var sql = 'select * from program';

	conn.query(sql,function(err,rows){
		res.render('main',{user:req.session.user,rows:rows});
	});
}); //메인.ejs 불러오기

app.get('/main', function (req, res) {
	var sql = 'select * from program';

	conn.query(sql,function(err,rows){
		res.render('main',{user:req.session.user,rows:rows});
	});
}); //메인.ejs 불러오기

app.get('/proinsert', function (req, res) {
      res.render('proinsert',{user:req.session.user});
}); //프로그램등록.ejs 불러오기

app.get('/promanage', function (req, res) {
      res.render('promanage',{user:req.session.user});
}); //프로그램관리.ejs 불러오기

app.get('/prolist', function (req, res) {
      res.render('prolist',{user:req.session.user});
}); //프로그램목록.ejs 불러오기

app.get('/mypage', function (req, res) {
      res.render('mypage',{user:req.session.user});
}); //마이페이지.ejs 불러오기

app.post("/studentjoin" , function(req,res){

    var num = req.body.s_num;
    var psw = req.body.s_password;
    var name = req.body.s_name;
    var email = req.body.s_email;
    var phone = req.body.s_phone;
    var pro = req.body.s_professor;
    var major = req.body.s_major;
    var datas = [num,psw,name,email,phone,pro,major]

    var sql = "insert into student(s_num,s_password,s_name,s_email,s_phone,s_professor,s_major) values(?,?,?,?,?,?,?)";

    conn.query(sql,datas,function(err,rows){
      if(err){
        console.log('학생 회원가입 실패!');
        res.send('<script>alert("회원가입실패!");location.href="join";</script>');
      }else{
        console.log('학생 회원가입 완료!');
        res.send('<script>alert("회원가입완료!");location.href="login";</script>');
      }
    })
}); //학생회원가입

app.post("/managerjoin" , function(req,res){

    var num = req.body.m_num;
    var psw = req.body.m_password;
    var name = req.body.m_name;
    var email = req.body.m_email;
    var datas = [num,psw,name,email];

    var sql = "insert into manager(m_num,m_password,m_name,m_email) values(?,?,?,?)";

    conn.query(sql,datas,function(err,rows){
      if(err){
        console.log('관리자 회원가입 실패!');
        res.send('<script>alert("회원가입실패!");location.href="join";</script>');
      }else{
        console.log('관리자 회원가입 완료!');
        res.send('<script>alert("회원가입완료!");location.href="login";</script>');
      }
    })
}); //관리자회원가입

app.post('/login',function(req,res){

     var id = req.body.id ;
     var psw = req.body.psw ;

     var sql = "select * from student where s_num=? and s_password=?"; //조건에 맞는 아이디와 패스워드 찾아옴

conn.query(sql,[id,psw],function(err,rows){
    if(rows.length > 0){
        req.session.user = {
          id : rows[0].s_num,
					name : rows[0].s_name,
					code : 'st',
          authorized : true
        }; //학생 세션 저장
				req.session.save(function(){
					console.log(req.session.user.name+'로그인 성공!');
					var sql = 'select * from program';

					conn.query(sql,function(err,rows){
						res.render('main',{user:req.session.user,rows:rows});
					});
				});
      }else{
			var sql = "select m_num,m_password,m_name from manager where m_num=? and m_password=?"; //조건에 맞는 아이디와 패스워드 찾아옴
			conn.query(sql,[id,psw],function(err,rows){
			    if(rows.length > 0){
			        req.session.user = {
			          id : rows[0].m_num,
								name : rows[0].m_name,
								code : 'mg',
			          authorized : true
			        }; //관리자 세션 저장
							req.session.save(function(){
								console.log(req.session.user.name+'로그인 성공!');
								var sql = 'select * from program';

								conn.query(sql,function(err,rows){
									res.render('main',{user:req.session.user,rows:rows});
								});
							});
			    }else{
			      console.log('로그인 실패!');
						res.send('<script>alert("로그인 실패! 다시 로그인해주세요.");location.href="login";</script>');
			    }
			  })
    }
	});
}); //로그인

app.get("/login",function(req,res){
	res.render('login');
}); //login.ejs연결

app.get('/logout',function(req,res){
	console.log(req.session.user.name+'로그아웃!');
  req.session.destroy(function(){
			  res.send('<script>alert("로그아웃 완료!");location.href="/";</script>');
    });
}); //로그아웃

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './images/');
  },
  filename: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    var filename = path.basename(file.originalname, ext);

    callback(null, filename + ext);
  }
});

var upload = multer({storage: storage});

app.post('/upload',upload.any(),function(req,res){
		var file = req.files[0];

		var m_num = req.session.user.id;
		var p_name = req.body.p_name;
		var p_poster = 'images/'+file.originalname; //파일 사진
		var p_contents = req.body.p_contents;
		var p_start = req.body.p_start;
		var p_end = req.body.p_end;
		var p_category = req.body.p_category;
		var datas = [m_num,p_name,p_poster,p_contents,p_start,p_end,p_category];

		var sql = "insert into program(m_num,p_name,p_poster,p_contents,p_start,p_end,p_category) values(?,?,?,?,?,?,?)";

		conn.query(sql,datas,function(err,rows){
			if(err){
				console.log('프로그램 등록 실패!');
				res.send('<script>alert("프로그램 등록 실패!");location.href="proinsert";</script>');
			}else{
				console.log('프로그램 등록 완료!');
				res.send('<script>alert("프로그램 등록 완료!");location.href="main";</script>');
			}
		})
}); //프로그램 등록
