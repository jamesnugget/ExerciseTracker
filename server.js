const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var bodyParser = require("body-parser");

var users = [];//Supposed to use a db here but I don't

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get("/api/users", function(req,res){
  retjso = [];
  for(x of users){
    poop = {"username": x["username"], "_id": "" + x["_id"]}
    retjso.push(poop);
  }
  res.json(retjso);
});

app.post("/api/users", function(req,res){
  name = req.body.username;
  tempid = generateID();
  retjso = {
    "username": name,
    "_id": "" + tempid
  };
  ins = {
    "username": name,
    "_id": "" + tempid,
    "log": []
  }
  users.push(ins);
  res.json(retjso);
});

app.post("/api/users/:id/exercises", function(req,res){
  id = "" + req.params.id;
  desc = req.body.description;
  dur = parseInt(req.body.duration);
  if (req.body.date === undefined){
    adate = new Date();
  }else{
    adate = new Date(req.body.date);
  }
  dat = adate.toDateString();
  log = {
    "description": desc,
    "duration": dur,
    "date": dat
  }
  namename = findName(id, log);
  retjso = {
    "username": namename,
    "description": desc,
    "duration": dur,
    "date": "" + dat,
    "_id": id
  };
  res.json(retjso);
});

app.get("/api/users/:id/logs", (req, res)=> {
  id = "" + req.params.id;
  fromif = req.query.from;
  toif = req.query.to;
  limittag = parseInt(req.query.limit);
  usr = findObj(id);
  if(fromif != undefined){
    fromtag = new Date(fromif);
    totag = new Date(toif);
    count = 0;
    newlog = [];
    for (x of usr["log"]){
      logdate = new Date(x["date"]);
      if(Date.parse(logdate) < Date.parse(totag) && Date.parse(logdate) > Date.parse(fromtag)){
        newlog.push(x);
        count++;
      }
    }
    retjso = {
      "username": usr["name"],
      "_id": usr["_id"],
      "count": count,
      "log": newlog
    }
    res.json(retjso);
  }else if(limittag > 0){
    count = 0;
    newlog = [];
    for (x of usr["log"]){
      if(count < limittag){
        newlog.push(x);
        count++;
      }
    }
    retjso = {
      "username": usr["name"],
      "_id": usr["_id"],
      "count": count,
      "log": newlog
    }
    res.json(retjso);
  }else{
    usr["count"] = usr["log"].length;

    res.json(usr);
  }
  
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

function generateID(){
  //Line from geeksforgeeks.org's random range
  return Math.floor(Math.random() * (4294967295 - 286331153) + 286331153);
}

function findName(id, loglog){
  for (x of users){
    if ((x["_id"] + "") === id){
      x["log"].push(loglog);
      return x["username"];
    }
  }
  return "";
}

//Honestly I should have used this one, not that garbage code above.
function findObj(id){
  for (x of users){
    if ((x["_id"] + "") === id){
      return x;
    }
  }
  return "";
}