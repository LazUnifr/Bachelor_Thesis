
const {MongoClient} = require('mongodb'); 
//var url = "mongodb://localhost:27017/";
const uri = "mongodb+srv://masterball85:4dNss2f7u3yJAhP@cluster934.tvqket4.mongodb.net/test"
var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client 