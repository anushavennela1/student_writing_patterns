var mongoose =require('mongoose');
console.log('inside mongoose')
var regdata = mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true
  },
  password:
  {
	  type:String,
	  required:true
  },
date : {
            
    type:String,
	 
            }
});

var registered =module.exports=mongoose.model('stus' ,regdata);    //student is db collection//

module.exports.addRegisterddata = function(data,callback)
{
    console.log('inside mongoose1');
    //console.log(data);
     registered.create(data,function(err,response){
         if(err){
         console.log(err);
         }
         else{
             //console.log(response);
         callback(response);
         }
     });
};
module.exports.logindata = function(data,callback)
{
    //console.log('212345');
    console.log(data);
     registered.find({"email":data},callback);
};





