const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const bodyparser = require('body-parser');
var requestp=require('request');
var schedule = require('node-schedule');
const MongoClient = require('mongodb').MongoClient;
mobileregistration=require('./functions/mobileregistration');
var app=express();
app.use(helmet());
app.disable('x-powered-by');
app.use(session({
  secret:'sdkevkakakmkmku',
  name:'sessionId'
}));
app.use(bodyparser.json());
var response;
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/batchcheckerevent1',function(req,res){
// Database Name
const dbName = 'zest_app_mongodb';
const url="mongodb+srv://zestapp:ammu@cluster0-etvhe.mongodb.net/test?retryWrites=true&w=majority";
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  //assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  var distint=db.collection("db_selectiondetails").distinct(
   "event1",
   {}, // query object
   (function(err, docs){
        if(err){
            return console.log(err);
        }
        if(docs){
            console.log(docs.length);
          //  console.log(docs.length);
            for(var i=0;i<=docs.length;i++){
              var urlvalue="http://localhost:9011/eventfulapi/"+docs[0]
              requestp(urlvalue,function(body){
                console.log(body);
              });
            }
        }
   }));
   client.close()
 });
});

app.get('/batchcheckerevent2',function(req,res){
// Database Name
const dbName = 'zest_app_mongodb';
const url="mongodb+srv://zestapp:ammu@cluster0-etvhe.mongodb.net/test?retryWrites=true&w=majority";
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  //assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  var distint=db.collection("db_selectiondetails").distinct(
   "event2",
   {}, // query object
   (function(err, docs){
        if(err){
            return console.log(err);
        }
        if(docs){

            console.log(docs.length);
            for(var i=0;i<=docs.length;i++){
              var urlvalue="http://localhost:9011/eventfulapi/"+docs[0]
              requestp(urlvalue,function(body){
                console.log(body);
              });
            }
        }
   }));
   client.close()
 });
});

var j = schedule.scheduleJob('*/2 * * * *', function(){
  var urlvalue="http://localhost:9012/batchcheckerevent2/"
  console.log('Today is recognized by Rebecca Black!');
  requestp(urlvalue,function(body){
    console.log('executed');
  });
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.listen(9012);
console.log('server started');
