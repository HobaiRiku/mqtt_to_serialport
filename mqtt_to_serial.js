const fs = require('fs')
const Mqtt = require('mqtt')
const SerialPort = require("serialport")
let config={}
try {
    config = eval(fs.readFileSync("./config.js",'utf8'));
} catch (error) {
    console.log(error)
    configError('error:配置文件\'config.js\'读取错误或不存在')
}
const mqttServer = config.mqttServer&&typeof(config.mqttServer)=='string'?config.mqttServer:configError('error:配置\'mqttServer\'不存在或格式错误')
const appID = config.appID&&typeof(config.appID)=='string'?config.appID:configError('error:配置\'appID\'不存在或格式错误')
const devEUI = config.devEUI;
const serialPortName = config.serialPortName&&typeof(config.serialPortName)=='string'?config.serialPortName:configError('error:配置\'serialPortName\'不存在或格式错误')
const baudRate = config.baudRate&&typeof(config.baudRate)=='number'?config.baudRate:configError('error:配置\'baudRate\'不存在或格式错误')
const dataBits = config.dataBits&&typeof(config.dataBits)=='number'?config.dataBits:configError('error:配置\'dataBits\'不存在或格式错误')
const parity = config.parity&&typeof(config.parity)=='string'?config.parity:configError('error:配置\'parity\'不存在或格式错误')
const stopBits = config.stopBits&&typeof(config.stopBits)=='number'?config.stopBits:configError('error:配置\'stopBits\'不存在或格式错误')
const mqttClient = Mqtt.connect(mqttServer)
console.log(new Date()+":"+'MQTT客户端连接'+mqttServer.split('@')[1])
let topic = ""
if(devEUI){
    if(typeof(devEUI)!='string'||devEUI.length!=16) configError('error:配置\'devEUI\'格式错误')
    topic = 'application/'+appID+'/node/'+devEUI+'/rx'
}else{
    topic = 'application/'+appID+'/node/+/rx'
}

let serialPort = new SerialPort(
    serialPortName, {
        baudRate: baudRate, 
        dataBits: dataBits, 
        parity: parity, 
        stopBits: stopBits, 
        flowControl: false,
    },
    function (error) {
        if (error) {
            console.log(new Date() + ':' + "打开端口" + serialPortName + "错误：" + error);
            process.exit(1);
        } else {
            console.log(new Date() + ':' + "打开串口端口" + serialPortName + "成功,等待数据发送");
        }
    });
mqttClient.subscribe(topic);
console.log(new Date()+":"+"订阅topic:"+topic)
mqttClient.on('message', function (topic, message) {
    let jsonm = message.toString('ascii'); 
    let json_obj = eval("(" + jsonm + ")"); 
    let data = json_obj.data_hex.split(' ')
    let serial_data_arr =[]
    for(let one of data){
        serial_data_arr.push(parseInt(one,16));
    } 
    let data_send = new Buffer(serial_data_arr)
    serialPort.write(data_send, function (error) {
        if (error) console.log(new Date() + ':' + '数据发送出错');
        else {
            console.log(new Date() + ':' + '数据发送成功:',data_send);
        }
    });
  })
function configError (msg){
    console.log(new Date() + ':' + msg)
    process.exit(1);
}