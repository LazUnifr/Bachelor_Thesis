
const mqtt = require('mqtt');
//const client  = mqtt.connect('mqtt://test.mosquitto.org');
let client_id = 'data simulator';
let PORT = 9000;
//let HOST='127.0.0.1'; 
let HOST ='192.168.1.139';
//let HOST = '134.21.143.147';
//publishing variables --> not used for
let pub_topic = 'data/sub';
let message = 'Greetings from ' + client_id.toString();
let pub_options = {qos: 0, retain: false};
//subscribe variables
let sub_topic = 'data/sub';
let sub_options = {qos: 0};

const options = {
    port: PORT,
    host: HOST,
    reconnectPeriod: 2000,
    clientId: client_id,
};

const client = mqtt.connect(options);

client.on('message', function (topic, message) {
    console.log("Received message " + message.toString() + " on topic: " + topic.toString());
})

client.on('connect', async function () {
    console.log('Connection successful');
    client.subscribe(sub_topic, sub_options, function (err) {
        if (err) {
            console.log("An error occurred while subscribing")
        } else {
            console.log("Subscribed successfully to " + sub_topic.toString())
        }
    });

   /* 
   while (client.connected) {
        client.publish(pub_topic, message, pub_options, function (err) {
            if (err) {
                console.log("An error occurred during publish")
            } else {
                console.log("Published successfully to " + pub_topic.toString())
            }
        });

        // Delay of 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    */
})

// Handle errors
client.on("error", function (error) {
    console.log("Error occurred: " + error);
});

// Notify reconnection
client.on("reconnect", function () {
    console.log("Reconnection starting");
});

// Notify offline status
client.on("offline", function () {
    console.log("Currently offline. Please check internet!");
});

module.exports= client