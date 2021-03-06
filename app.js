const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const bodyparser = require('body-parser');
mobileregistration=require('./functions/mobileregistration');
eventupdater=require('./functions/eventupdater');
const MongoClient = require('mongodb').MongoClient;
//var natural=require('natural');
var app=express();
app.use(helmet());
app.disable('x-powered-by');
app.use(session({
  secret:'sdkevkakakmkmku',
  name:'sessionId'
}));
app.use(bodyparser.json());
var response;
//var wordnet=new natural.WordNet();
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/sessionvl/:emailid',function(req,res){
  console.log(req)
  var str_emailid=req.params.emailid;
  var mobileregs=mobileregistration.mobileregister(str_emailid,function(model){
      if(model==='success'){
        req.session.user=str_emailid;
      }else if(model==='Already added'){
        req.session.user=str_emailid;
      }
      res.send(model);
  });
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/selectionscreencheck/:emailid',function(req,res){
  var str_emailid=req.params.emailid;
  var mobileregs=eventupdater.selectioncheck(str_emailid,function(model){
      res.send(model);
  });
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/selectionscreenadd/:emailid/:eventsname',function(req,res){

  var str_emailid=req.params.emailid;
  var str_events=req.params.eventsname;
  if(str_events.split("-")){
  var str_eventnumber=str_events.split("-");
  }else{
  str_eventnumber[0]=str_events
  str_eventnumber[1]=""
  }
  var mobileregs=eventupdater.selectionadd(str_emailid,str_eventnumber[0],str_eventnumber[1],function(model){
      res.send(model);
  });
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/watchinfo/:mobilemodel/:mobilename/:wishlist',function(req,res){
  var str_wishlist=req.params.wishlist;
  var str_mobilename=req.params.mobilename;
  var str_mobilemodel=req.params.mobilemodel;
  MongoClient.connect(url, function(err, client) {
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    db.collection("db_selectiondetails").insertOne(str_wishlist, function(err, result) {
        client.close();
    });
});
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/ntlanguage/:word',function(req,res){
  var str_words=req.params.word;
  wordnet.lookup(str_words,function(results){
    results.forEach(function(result){
      console.log(result.synonyms.length);
      console.log(result.lemma);
      console.log(result.pos);
      console.log(result.gloss);
      //res.send(result.synonyms);
      result.exp.forEach(function(example){
        console.log(example);
      });
    });
  });
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/map',function(req,res,next){
  res.setHeader('Cache-control','no-cache');
  res.sendFile(__dirname+'/html/index.html')
});
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/eventretriveformap', function(req,res,next){
  const urlevents = 'mongodb+srv://zestapp:ammu@cluster0-jb1oc.mongodb.net/';
  MongoClient.connect(urlevents,function (err,client) {
            var dbo = client.db("zest_app_events");
            dbo.collection("db_zest_app_events").find({},{title:{_text:0}}).toArray(function(err, result) {
                  if (err) throw err;
                  var responsetomap;
                    for(var resulteach in result){
                      str_title=result[resulteach].title._text;
                      str_latitude=result[resulteach].latitude._text;
                      str_latitude=result[resulteach].latitude._text;
                      if(resulteach==0){
                        responsetomap={title:str_title,latitude:str_latitude,longitude:str_latitude}
                      }else{
                        responsetomap=responsetomap+{title:str_title,latitude:str_latitude,longitude:str_latitude}
                      }
                      if(resulteach==10){
                        break;
                      }
                    }
                    //responsetomap=[responsetomap
                    client.close();
                    console.log(responsetomap[1].toString());
                    res.send(responsetomap.toString());
            });
  });
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
app.get('/eventbasedonlocation/:latitude/:longitude', function(req,res,next){
  var str_latitude=req.params.latitude;
  var str_longitude=req.params.longitude;
  var NodeGeocoder = require('node-geocoder');
  var options = {
        provider: 'google',
        httpAdapter: 'https', // Default
        apiKey: 'AIzaSyDOi_pjM1gj0jNzJxQWET8oH-S0U6J2PP4', // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
      };
var geocoder = NodeGeocoder(options);
// Using callback
geocoder.reverse({lat:str_latitude, lon:str_longitude}, function(err, res1) {
  //console.log(res);
  console.log(res1);
  const urlevents = 'mongodb+srv://zestapp:ammu@cluster0-jb1oc.mongodb.net/';
  MongoClient.connect(urlevents,function (err,client) {
            var dbo = client.db("zest_app_events");
            var query={}
            dbo.collection("db_zest_app_events").find(query).toArray(function(err, result) {
              var responsetomap;
              for(var rs in result){
                str_title=result[rs].title._text;
                str_latitude=result[rs].latitude._text;
                //str_longitude=result[rs].str_longitude._text;
                str_starttime=result[rs].start_time._text;
                str_venue=result[rs].venue_name._text;
                str_venueaddress=result[rs].venue_address._text;
                if(rs==0){
                  responsetomap={title:str_title,latitude:str_latitude,longitude:str_longitude,starttime:str_starttime,venue:str_venue,venueaddress:str_venueaddress}
                }else{
                  responsetomap=responsetomap+{title:str_title,latitude:str_latitude,longitude:str_longitude,starttime:str_starttime,venue:str_venue,venueaddress:str_venueaddress}
                }
                if(rs==5){
                  client.close();
                  console.log([responsetomap]);
                  res.send(responsetomap)
                }
              }
            });
  });
});
});


app.listen(3000);
console.log('server started');
