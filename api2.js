var express = require('express');
var app = express();
var Cloudant = require('cloudant');
var bodyparser=require('body-parser')
var cors = require('cors');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

var uid = 'ssahu123';
var pass = 'sunil123';
var cloudant = Cloudant({account:uid, password:pass});

var session=require('express-session');
app.engine('html',require('ejs').renderFile);
app.use(session({secret: 'varsh',saveUninitialized: true,resave: true}));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
var sess;

app.get('/',function(req,res){
    sess=req.session;
    if(sess.email){
      res.sendFile(__dirname + '/public/' + 'main.html');
    }
   else{
    res.sendFile(__dirname + '/public/pages-login-website-light.html');
   }    
});

app.get('/reg',function(req,res){
	res.sendFile(__dirname +'/public/'+'register.html');
});

app.post('/ver1',function(req,res){
	//console.log('This is ver1');
	var email = req.body.email;
	console.log(email);
	
	var db = cloudant.db.use('meandb1');
	db.get(email, function(err, data)
	   {
   
	    if(err){
		res.json('You are not Registered');
		console.log('You are not Registered');
			}
			else{
				if(data.length != 0 ){
				 //console.log(data.length);
					if(data.password == req.body.pass){
					sess=req.session;
					sess.email=req.body.email;
					//res.json({"name":data.name});
					res.redirect('/main');
					  }
               else{
                
                 res.send("check your password");
               }
             //res.send('success');
		    } 
		   else{
			   console.log('check your mail id once');
			   res.send("check your mail id once");
		      }
	  }
	
  });

});

app.post('/getting_data',function(req,res){
   // console.log('inside register api',JSON.stringify(req.body));
	var name = req.body.name;
	console.log(name);
	var email = req.body.email;
	console.log(email);
	var password = req.body.password;
	console.log(password)
	console.log(name+' '+ email+' '+ password);
	app.use(cors());
	
    //regobj.logindata(req.body.email, function(err,data)
	var db = cloudant.db.use('meandb1');
		
		db.insert({_id : email, "name" : name , "email": email, "password": password},function(err,datax)
		 {
	      if(datax != undefined)
	      {
		   response="success";
		   console.log(response);
           res.send(response);
	     }
         else
         {
          error="data not inserted";
          console.log(error);
	     }
         //});
        //}
       //}
	
   });
 });

app.get('/main',function(req,res) {
        sess=req.session;
 if(sess.email){
     	res.sendFile(__dirname + '/public/'+'main.html');
             }
        else{
          res.sendFile(__dirname+'/public/'+'pages-login-website-light.html');
        }
});

app.get('/watson',function(req,res) {
        sess=req.session;
 if(sess.email){
     	res.sendFile(__dirname + '/public/'+'watsonservices.html');
             }
        else{
          res.sendFile(__dirname+'/public/'+'pages-login-website-light.html');
        }
});
app.get('/nlu',function(req,res) {
        sess=req.session;
 if(sess.email){
     	res.sendFile(__dirname + '/public/'+'nlu.html');
             }
        else{
          res.sendFile(__dirname+'/public/'+'pages-login-website-light.html');
        }
});
app.get('/tone',function(req,res) {
        sess=req.session;
 if(sess.email){
     	res.sendFile(__dirname + '/public/'+'tonelang.html');
             }
        else{
          res.sendFile(__dirname+'/public/'+'pages-login-website-light.html');
        }
});
app.get('/text',function(req,res) {
        sess=req.session;
 if(sess.email){
     	res.sendFile(__dirname + '/public/'+'text.html');
             }
        else{
          res.sendFile(__dirname+'/public/'+'pages-login-website-light.html');
        }
});
app.get('/logout',function(req,res){
 req.session.destroy(function(err){
    if(err){
        console.log(err);
    }
    else{
        res.redirect('/');
    }
});
});

app.get('/emotion',function(req,res){
res.sendFile(__dirname+'/public/'+'emotion.html');
});

app.get('/cat',function(req,res){
res.sendFile(__dirname+'/public/'+'categories.html');
});


app.get('/concept',function(req,res){
res.sendFile(__dirname+'/public/'+'concepts.html');
});

app.get('/sentiment',function(req,res){
res.sendFile(__dirname+'/public/'+'sentiment.html');
});


app.get('/tone',function(req,res){
res.sendFile(__dirname+'/public/'+'tone.html');
});

var watson = require('watson-developer-cloud');
var tone_analyzer = watson.tone_analyzer({
  username: 'ffb06bff-17ae-428e-b456-fb1be2e4cc3d',
  password: 'TgYJzwCCnnH6',
  version: 'v3',
  version_date: '2016-05-19',
 //tones:'language',
});


var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '101b4fb7-b27c-4a77-8286-5d9b0fea8208',
  'password': 'wSqNH3JSDdK3',
  'version_date': '2017-02-27'
});

app.post('/sample1',function(req,res){
  response=req.body.name;
console.log(response);
//res.send(response);
var parameter1 = {
  'text': response,
  'features': {
    'categories': {
      
    }
  }
}


natural_language_understanding.analyze(parameter1, function(err, response) {
  if (err)
    console.log('error:', err);
  else
      console.log(JSON.stringify(response, null, 2));
     res.send(JSON.stringify(response, null, 2));
        //  res.send(JSON.stringify(response2, null, 2));
});
});


// app.use(function(req, res, next){
  // res.header("Access-Control-Allow-Origin","*");
  // res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  // next();
// });


app.post('/sample2',function(req,res){
  response=req.body.name;
console.log(response);
var parameter2 = {
  'text': response,
  'features': {
    'concepts':{
      'limit':2,
    }
  }
}


natural_language_understanding.analyze(parameter2, function(err, response) {
  if (err)
    console.log('error:', err);
  else
  //res.writeHead(200,{"Content-Type": "text/plain"});
    //response1=response.emotion.document.emotion;
  //  response=response.sentiment.document.label;

    console.log(JSON.stringify(response, null, 2));
     res.send(JSON.stringify(response, null, 2));
        //  res.send(JSON.stringify(response2, null, 2));
});
});

app.post('/sample3',function(req,res){
  response=req.body.name;
console.log(response);
var parameter2 = {
  'text': response,
  'features': {
    'sentiment':{
      'document':response,
    }
  }
}
natural_language_understanding.analyze(parameter2, function(err, response) {
  if (err)
    console.log('error:', err);
  else
  //res.writeHead(200,{"Content-Type": "text/plain"});
    //response1=response.emotion.document.emotion;
    response=response.sentiment.document;

    console.log(JSON.stringify(response, null, 2));
     res.send(JSON.stringify(response, null, 2));
        //  res.send(JSON.stringify(response2, null, 2));
});
});


app.post('/sample4',function(req,res){
  response=req.body.name;
console.log(response);
var parameter2 = {
  'text': response,
  'features': {
    'emotion':{
      'document':response,
    }
  }
}
natural_language_understanding.analyze(parameter2, function(err, response) {
  if (err)
    console.log('error:', err);
  else
  //res.writeHead(200,{"Content-Type": "text/plain"});
    response=response.emotion.document.emotion;
    //response=response.sentiment.document.label;

    console.log(JSON.stringify(response, null, 2));
     res.send(JSON.stringify(response, null, 2));
        //  res.send(JSON.stringify(response2, null, 2));
});
});


app.post('/sample5',function (req, res) {
  response = req.body.name;
  console.log(response);
    tone_analyzer.tone(
    {text:response,tones:'language','sentences':false},
    //{tones:language},
    function(err,tone) {
      if (err)
        console.log(err);
      else
      tone=tone.document_tone.tone_categories;

        console.log(JSON.stringify(tone, null, 2));
        res.send(JSON.stringify(tone, null, 2));
  });
});


app.listen(8081);
console.log("server running At 8081");

