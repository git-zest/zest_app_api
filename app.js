const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const bodyparser = require('body-parser');
var app=express();
app.use(helmet());
app.disable('x-powered-by');
app.use(session({
  secret:'sdkevkakakmkmku',
  name:'sessionId'
}));

app.use(bodyparser.json());

app.get('/sessionvl',function(req,res){
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://zestapp:ammu@cluster0-etvhe.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("zest_app_mongodb").collection("db_mobiledetails");
  var docs={"username":"new mobile added"}
  collection.insertOne(docs, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    //db.close();
  });
  // perform actions on the collection object
  client.close();
});

});

app.listen(9010);
console.log('server started');
