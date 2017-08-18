var express = require('express');

//importing tone analyzer
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

//importing NLU
var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

var app = express();
var Cloudant = require('cloudant');
var bodyparser=require('body-parser');

var cors = require('cors');
app.use(cors());

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

/* app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  next();
}); */

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
	//console.log(email);
	
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
app.post('/analyzetext', function(req, res){
		console.log("Welcome to Analyze texts");
		var email = sess.email;
		var title = req.body.title;
		var essay = req.body.essay;
		
		app.use(cors());
		// console.log("-----"+email);
		// console.log("-----"+essay);
		// console.log("-----"+title);
		var db = cloudant.db.use('meandb1');
		db.get(email, function(err, doc){
				if(err)
				{
					console.log(err);
				}
				else
				{
					console.log("inside object array");
					var arr = [];
					arr = doc.essays;
					if(doc.essays)
					{
						//console.log(arr);
						var obj = {
									"title": title,
									"essay": essay
									};
						arr.push(obj);
						//console.log(arr);
						
						db.insert({
						_id : doc.email,
						_rev: doc._rev,
						"name" : doc.name,
						"email": doc.email,
						"password": doc.password,
						"type": doc.type,
						"essays": arr
						},function(err,datax){
							if(err)
							{
							console.log("Array Not inserted");
							console.log(err);
							}
							else
							{
							console.log("Array Inserted success");
							}
							});
					}
					else
					{
					//console.log(doc.name+' '+ doc.email+' '+ doc._rev);
					
					db.insert({
						_id : doc.email,
						_rev: doc._rev,
						"name" : doc.name,
						"email": doc.email,
						"password": doc.password,
						"type": doc.type,
						"essays": [{
								"title": title,
								"essay": essay
								}]
						},function(err,datax){
						if(err)
						{
							console.log("Not inserted");
							console.log(err);
						}
						else
						{
							console.log("Inserted success");
						}
					   });
					}
				}		
		});
		
});
app.post('/getting_data',function(req,res){
   // console.log('inside register api',JSON.stringify(req.body));
	var name = req.body.name;
	//console.log(name);
	var email = req.body.email;
	//console.log(email);
	var password = req.body.password;
	//console.log(password);
	var type = req.body.desig;
	//console.log(name+' '+ email+' '+ password +' '+ type);
	
	app.use(cors());
	
	var db = cloudant.db.use('meandb1');
		
		db.insert({_id: email, "name": name , "email": email, "password": password, "type": type}, function(err,datax)
		 {
	      if(datax != undefined)
	      {
		   response="success";
		   console.log("Registration Success.");
           res.send(response);
	     }
         else
         {
          error="data not inserted";
          console.log(error);
	     }
	
   });
 });

app.post('/myessays', function(req, res){
	console.log("Welcome to My essays block...");
	var email = sess.email;
	var db = cloudant.db.use('meandb1');
	db.get(email, function(err, data)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			var arr = [];
			arr = data.essays;
			//console.log(arr);
			res.send(arr);
		}
	});
	
	
});

app.post('/gettingEssay', function(req, res){
	var title = req.body.title;
	var title2= title.replace(/^"(.*)"$/, '$1');
	// console.log("the getting essay title is "+title);
	// console.log("the getting essay title is "+title2);
	var email = sess.email;
	var db = cloudant.db.use('meandb1');
	
	db.get(email, function(err, doc)
		{
				if(err)
				{
					response = {
						"output":"error occured"
					}
					return res.json(response);
					//console.log(response);
				}
				else
				{
					var arr = [];
					arr = doc.essays;
					var i;
					
					for(i=0; i<arr.length; i++)
					  {
						  // console.log("the current title is: "+title);
						// console.log(arr[i].title);
						// console.log(arr[i].essay);
						
						if(title2 == arr[i].title)
						{
							//console.log("matched essay is :"+arr[i].essay);
							
							res.send(arr[i].essay);
						}
	
					  }
				}
		});
});

app.post('/checktitle', function(req, res){
	//console.log("Welcome to title checking block");
	app.use(cors());
	var title = req.body.title;
	var email = sess.email;
	//console.log("--------------------------"+title);
	var db = cloudant.db.use('meandb1');
		db.get(email, function(err, doc)
		{
				if(err)
				{
					response = {
						"output":"error occured"
								}
					//console.log(response);
					return res.json(response);
					
				}
				else
				{
					if(doc.essays)
					{
						var arr = [];
					  arr = doc.essays;
					  //console.log(doc);
					  //console.log(doc.essays);
					  var i;
					  for(i=0; i<arr.length; i++)
					  {
						
						if(title == arr[i].title)
						{
							 response ={
										"output": "already exist"
										}
							return res.json(response);
						}
						else
						{
							console.log("Its new title");
						}
					  }
					}
					else
					{
						response ={
										"output": "new title"
										}
										
							return res.json(response);
					}
					  
				}
		});		
});


app.post('/checkNegetive', function(req, res){
	console.log("checkNegetive block is activated");
	app.use(cors());
	var essay = req.body.text;
	//console.log(essay);
	
	//essay is taken as input object
	var params ={
		'text': essay,
		tones: 'emotion'
	};
	//console.log(params.text);
	var arr2 = [];

	//Tone analyzer function to divide the essay into sentences
	tone_analyzer.tone(params, function(err, response){
			if(err)
			{
				console.log('error:'+err);
			}
			else
			{
				console.log("111111;;the tone sentence is "+ JSON.stringify(response));
				
				getDetails(response, function(response1)
					{
						console.log("666666666666666",response1);
						
						for(o=0;o<response1.length;o++)
						{
							var labels = response1[o].lab;
							var myLab = "negative";
							console.log("77777777777777");
							console.log("the label value :"+response1[o].lab);
							console.log("Req: sent: "+response1[o].sent);
							if(labels == myLab)
							{
							var results = {
										'leb': response1[o].lab,
										'sentence': response1[o].sent
										}
							
							arr2.push(results);
							
							console.log("88888888888888888"+JSON.stringify(arr2));
						
								if(o==response1.length-1)
								{
									console.log('hello');
									res.send(arr2);
								}
							
							}

						}

					});	
					

			}
	});

	
});

//calling getDetails function to here and callback to the function
var getDetails = function(res, callback)
	{
		var arr = [];
		var g=[];
		for(var i=0; i<res.sentences_tone.length; i++)
		{
			// console.log('222222222222',res.sentences_tone[i].text);
			arr.push(res.sentences_tone[i].text);
		}
		console.log('222222',arr);
		
		for(k=0; k<arr.length; k++)
		{
			 natural_language_understanding.analyze({
								 //'text': res.sentences_tone[i].text,
								 'text': arr[k],
								 'features': {
									  'sentiment': {}
											 }
						 }, function(err, resp){
								 if(err)
								 {
									 callback({
											'array':err
											});	 
									//console.log('error:', err);
								}
								else
								{
									console.log("333333333333---"+JSON.stringify(resp));
									
									
									for(j=0;j<arr.length;j++)
									{
											var ob ={
												'lab': resp.sentiment.document.label,
												'sent': arr[j]
													};
										g.push(ob);
									}
										for(m=0; m<g.length; m++)
										{
										console.log("44444444444444444444"+JSON.stringify(g[m].sent));
										}
										console.log("5555 callbacke................");
										callback(g);
										
								}
			});
		}
		
	}


// app.post('/checkNegetive', function(req, res)
// {
	// console.log('Welcome to checkNegetive block...!');
	// app.use(cors());
	// var essay = req.body.text;
	// console.log(essay);
	// var arr1 = [];
	// var lebals = [];
	// var arr2 = [];
	
	// //essay is taken as input object
	// var params ={
		// 'text': essay,
		// tones: 'emotion'
				// };
	
	// //tone analyzer function to divide esssay sentence wise
	// tone_analyzer.tone(params, function(err, result){
				// if(err)
				// {
					// console.log('tone analyzer error :',err);
				// }
				// else
				// {
					// console.log('The result from tone :', result);
					// console.log('the length of sentences_tone array :',result.sentences_tone.length);
					// for(i=0; i<result.sentences_tone.length; i++)
					// {
						// arr1[i]=result.sentences_tone[i].text;
					// }
					// console.log('The sentences array1111 is :', arr1);
				// }
				// var j=0;
				// //functionality of NLU
				// while(j<arr1.length)
				// {
					// console.log('NLU sentences are :',arr1[j]);
					
					// natural_language_understanding.analyze({
										// 'text': arr1[j],
										// 'features': {
												// 'sentiment': {}
													// }
							// }, function(err2, result2){
											// if(err)
											// {
												// console.log(err2);
											// }
											// else
											// {
												// console.log('NLU result2 is :',result2);
												// console.log('Lebel is :',result2.sentiment.document.label)
												// var ob ={
													 // 'lab': result2.sentiment.document.label
														// };
												// lebals.push(ob);
											// }
											// console.log('1111111',lebals);
											// console.log('The sentences array2222 is :', arr1);
											
											// console.log('arr2 is :',arr2);
											
											// res.send()
									// });
									
					// j++;
				// }
				
				
	// });
	
	
// });

app.post('/savingEssay', function(req, res){
	console.log("The saving essay block....");
	app.use(cors());
	var title = req.body.title;
	var essay = req.body.essay;
	var email = sess.email;
	
	var db = cloudant.db.use('meandb1');
		db.get(email, function(err, doc){
				if(err)
				{
					console.log(err);
				}
				else
				{
					console.log("inside object array");
					var arr = [];
					arr = doc.essays;
					if(doc.essays)
					{
						//console.log(arr);
						var obj = {
									"title": title,
									"essay": essay
									};
						arr.push(obj);
						//console.log(arr);
						
						db.insert({
						_id : doc.email,
						_rev: doc._rev,
						"name" : doc.name,
						"email": doc.email,
						"password": doc.password,
						"type": doc.type,
						"essays": arr
						},function(err,datax){
							if(err)
							{
							console.log("Array Not inserted");
							console.log(err);
							}
							else
							{
							console.log("Array Inserted success");
							}
							});
					}
					else
					{
					//console.log(doc.name+' '+ doc.email+' '+ doc._rev);
					
					db.insert({
						_id : doc.email,
						_rev: doc._rev,
						"name" : doc.name,
						"email": doc.email,
						"password": doc.password,
						"type": doc.type,
						"essays": [{
								"title": title,
								"essay": essay
								}]
						},function(err,datax){
						if(err)
						{
							console.log("Not inserted");
							console.log(err);
						}
						else
						{
							console.log("Inserted success");
						}
					   });
					}
				}		
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

app.get('/essay',function(req,res) {
	
        sess=req.session;
 if(sess.email){

     	res.sendFile(__dirname + '/public/'+'essay.html');
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
  username: 'c8600554-1721-4f40-b49a-44841ee28fc5',
  password: 'OMJTf223oStM',
  version: 'v3',
  version_date: '2016-05-19',
 //tones:'language',
});


var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
var natural_language_understanding = new NaturalLanguageUnderstandingV1({
  'username': '54b7be48-ca04-469e-a2d6-c3ff97671152',
  'password': 'CkN5IyGrDW1T',
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

