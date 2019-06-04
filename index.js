'use strict'
let exec = require('child_process').exec;
let socket = require('socket.io-client')('http://192.168.3.106:3001');
let Omega2Gpio = require('omega2-gpio');
let lcd = require('./py/lcd');
let gpio = new Omega2Gpio();



function getSensorData(callback) {
  exec("dht-sensor 19 DHT11", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    
    let res = JSON.stringify(stdout);
    
    let pattern = new RegExp(/[0-9]{2}.0{2}/g);
    let outArray = res.match( pattern );
    
    let humidity = outArray[0];
    let temp = outArray[1];
    
    callback({
      temprature: temp,
      humidity: humidity
    })
  })
}

function changeRelayState(pin, state) {
  console.log('changing relay on pin ' + pin + ' state to ' + state)
  let relay = gpio.pin(pin);
  relay.set(state);
}

function publishData() {
  getSensorData((sensorData) => {
    console.log('Sensor data', sensorData);
    lcd(sensorData)
    socket.emit('sensorData', sensorData)
  })
}

socket.on('connect', function(){
  console.log('connected');
  socket.emit('hardwareConnect', 'WORKS!')
  setInterval(publishData, 4000);
});

socket.on('toggleRelay', (relayData) => {
  changeRelayState(relayData.pin, relayData.state)
})

socket.on('event', function(data){});
socket.on('disconnect', function(){});

