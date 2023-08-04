//variables
const { getMaxTemp } = require('../dataBase/dbOperations');
const client = require('./mqtt')
var colorState=''
var lastTemp=Infinity;
let temp_topic="data/sub/temp"
//const {getMaxTemp} = require('../dataBase/dbOperations');

/** Mqtt publisher methods **/
async function mqttPublish(message,topic){
    let pub_options = {qos: 1, retain: false};
    
    client.publish(topic, message, pub_options, function (err) {
        if (err) {
            console.log("An error occurred during publish")
        } else {
            console.log("Published successfully to " + topic.toString())
        }
    });
};

async function publishColor(color){
    let pub_topic ='data/sub';
    if (color != colorState){
        mqttPublish(color,pub_topic);
        colorState=color;
    } 
};
/** check if it must publish a warning */
async function publishWarning(temp){
    MaxTemp = await getMaxTemp()
    if(temp>=MaxTemp){
        mqttPublish("warning",temp_topic)
    }
}

async function publishLastTemp(temp){
    if(temp != lastTemp){
        mqttPublish(temp,temp_topic);
        lastTemp=temp;
    }
}

module.exports = {mqttPublish,publishColor,publishWarning,publishLastTemp}