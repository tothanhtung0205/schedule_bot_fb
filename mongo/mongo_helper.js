var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myobj = { "user_name":"posotest2", "sender_id": "1111" };
  db.collection("username_id").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 record inserted");
    db.close();
  });
});



MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var query = { "sender_id": "1111" };
  db.collection("username_id").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});