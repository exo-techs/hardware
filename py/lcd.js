'use strict'
const spawn = require("child_process").spawn;
let oldData = {
    temprature: 0,
    humidity: 0
};
// pythonProcess.stdout.on('data', (data) => {});

function lcd (sensorData) {
    if(oldData.temprature !== sensorData.temprature ||
        oldData.humidity !== sensorData.humidity) {
        let line1 = "Temprature: " + sensorData.temprature;
        let line2 = "Humidity:   " + sensorData.humidity;
        spawn('python',["py/lcd.py", "-a 0x27", "-p", `--line1=${line1}`, `--line2=${line2}`]);
        oldData = sensorData;
    }
}

module.exports = lcd;