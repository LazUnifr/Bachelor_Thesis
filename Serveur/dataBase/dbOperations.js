const { ObjectId } = require('mongodb');
const client= require('./db');
const mongoose = require('mongoose')

//test method
async function doSomethingInDB(){
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
// DB operations DATA collections
async function createdTempListing(newListing){
    await client.connect();
    const result = await client.db("Db_test").collection("temp").insertOne(newListing);
    console.log(`new listing inserted with id ${result.insertedId}`) 
    await client.close();
   // return JSON.stringify(newListing);
   return result.insertedId
}; 

async function createdColorListing(newListing){
    await client.connect();
    const result = await client.db("Db_test").collection("color").insertOne(newListing);
    console.log(`new listing inserted with id ${result.insertedId}`) 
    await client.close();
   // return JSON.stringify(newListing);
   return result.insertedId
}; 

async function createMultipleListings(collection,newListings){
    await client.connect();
    const result = await client.db("Db_test").collection(collection).insertMany(newListings);
    console.log(`${result.insertedCount} new listing(s) created with the following id(s):`);
    console.log(result.insertedIds);
    await client.close();      
};

async function findTempById(Id){
    await client.connect();
    const result = await client.db("Db_test").collection("temp").findOne({_id:new ObjectId(Id)},{projection:{_id:0,temp:1}});
    //console.log(result)
    await client.close();
    return result.temp
};

async function findColorById(Id){
    await client.connect();
    const result = await client.db("Db_test").collection("color").findOne({_id:new ObjectId(Id)},{projection:{_id:0,light_color:1}});
   // console.log(result.light_color);
     
    await client.close();
    return result.light_color;
};

async function getAllTemp(){
    await client.connect();
    const cursor =  client.db("Db_test").collection("temp").find({},{projection:{_id:0,temp:1,timestamp:1}});
    const results = await cursor.toArray();
   /* 
    if(results.length>0){
      results.forEach((r,i)=>{
        console.log();
        console.log(`${i+1}`,r);
      });
    }
    else{
      console.log("None");
    }
    */
    
    await client.close();
    return results
};

async function getAllColor(){
    await client.connect();
    const cursor =  client.db("Db_test").collection("color").find({},{projection:{_id:0,light_color:1,timestamp:1}});
    const results = await cursor.toArray();
    /*
    if(results.length>0){
      results.forEach((r,i)=>{
        console.log();
        console.log(`${i+1}`,r);
      });
    }
    else{
      console.log("None");
    }
    */
    await client.close();
    return results
};

async function updateDataById(client,id,updatedData){
    await client.connect();
    const result = await client.db("Db_test").collection("data").updateOne({_id:id},{$set:updatedData},{upsert: true});
    if (result.upsertCount>0){
        console.log(`One data was insered ${result.upsertedId}`);
    }
    else{
        console.log(`${result.modifiedCount} updated`);
    }
    await client.close();     
};

async function deleteById(id,collection){
    await client.connect();
    const result = await client.db("Db_test").collection(collection).deleteOne({_id:new ObjectId(id)});
    console.log(`${result.deletedCount} deleted`);
    await client.close();  
};

async function deleteAll(collection){
    await client.connect();
    const result = await client.db("Db_test").collection(collection).deleteMany({});
    console.log(`${result.deletedCount} object(s) deleted`);
    await client.close();
};
 async function getTempFromTo(start,end){
  await client.connect();
  const cursor = await client.db("Db_test").collection("temp").find({timestamp:{$gte:start,$lte:end}}
    ,{projection:{_id:0,temp:1,timestamp:1}});
  const results = await cursor.toArray();
  /*
  if(results.length>0){
      results.forEach((r,i)=>{
        console.log();
        console.log(`${i+1}`,r);
      });
  }
  else{
      console.log("None");
  }
  */
  await client.close();
  return results;
};

async function getColorFromTo(start,end){
  await client.connect();
  const cursor = await client.db("Db_test").collection("color").find({timestamp:{$gte:start,$lte:end}}
    ,{projection:{_id:0,light_color:1,timestamp:1}});
  const results = await cursor.toArray();
  /*
  if(results.length>0){
      results.forEach((r,i)=>{
        console.log();
        console.log(`${i+1}`,r);
      });
  }
  else{
      console.log("None");
  }
  */
  await client.close();
  return results;
};

async function latestTemp(){
  await client.connect();
  const result =  await client.db("Db_test").collection("temp").find({},{projection:{_id:0,temp:1}}).limit(1).sort({timestamp:-1})//findOne({},{projection:{_id:0,temp:1}},{sort:-1}) 
  const last = await result.toArray();
  await client.close();
  return JSON.stringify(last);
};
async function latestColor(){
  await client.connect();
  const result =  await client.db("Db_test").collection("color").find({},{projection:{_id:0,light_color:1}}).limit(1).sort({timestamp:-1})//findOne({},{projection:{_id:0,temp:1}},{sort:-1}) 
  const last = await result.toArray();
  await client.close();
  return JSON.stringify(last);
};
//DB operations VARIABLES collection
async function PutMaxTemp(temp){
    await client.connect();
    await client.db("Db_test").collection("variables").updateOne({'name':'tempMax'},{$set:{'name':'tempMax','temp':temp}},{upsert: true});   
    await client.close();
};
async function getMaxTemp(){
    await client.connect();
    const result = await client.db("Db_test").collection("variables").findOne({'name':'tempMax'},{projection:{'_id':0,'name':0}})  
    await client.close();
    return JSON.stringify(result.temp);
};



  module.exports = {deleteById,updateDataById,createdTempListing,createdColorListing,createMultipleListings,
    getAllTemp,getAllColor,deleteAll,findTempById,findColorById,getColorFromTo,
    PutMaxTemp,getMaxTemp,getTempFromTo,latestTemp,latestColor}


/*
    async function main(){
    try {
        console.log("hey")
        await test()

    } catch (error) {
        console.log(error);
    }
  };
  main().catch(console.error); */
  