

const fs = require('fs')
const SerialPort = require("serialport")
let config={}
try {
    config = eval(fs.readFileSync("./config.js",'utf8'));
} catch (error) {
    console.log(error)
    configError('error:配置文件\'config.js\'读取错误或不存在')
}

//const serialPortName = config.serialPortName&&typeof(config.serialPortName)=='string'?config.serialPortName:configError('error:配置\'serialPortName\'不存在或格式错误')
const baudRate = config.baudRate&&typeof(config.baudRate)=='number'?config.baudRate:configError('error:配置\'baudRate\'不存在或格式错误')
const dataBits = config.dataBits&&typeof(config.dataBits)=='number'?config.dataBits:configError('error:配置\'dataBits\'不存在或格式错误')
const parity = config.parity&&typeof(config.parity)=='string'?config.parity:configError('error:配置\'parity\'不存在或格式错误')
const stopBits = config.stopBits&&typeof(config.stopBits)=='number'?config.stopBits:configError('error:配置\'stopBits\'不存在或格式错误')
const serialPortName1 = '/dev/tty.usbserial-AH05FNHQ';
const serialPortName2 = '/dev/tty.usbserial-A906QX95';
var ByteLength = SerialPort.parsers.ByteLength
let serialPort1 = new SerialPort(
    serialPortName1, {
        baudRate: baudRate, 
        dataBits: dataBits, 
        parity: parity, 
        stopBits: stopBits, 
        flowControl: false,
    },
    function (error) {
        if (error) {
            console.log(new Date() + ':' + "打开端口" + serialPortName1 + "错误：" + error);
            process.exit(1);
        } else {
            console.log(new Date() + ':' + "打开串口端口" + serialPortName1 + "成功,等待数据发送");
        }
    });
    var parser = serialPort1.pipe(new ByteLength({length: 33}));
let serialPort2 = new SerialPort(
    serialPortName2, {
        baudRate: baudRate, 
        dataBits: dataBits, 
        parity: parity, 
        stopBits: stopBits, 
        flowControl: false,
    },
    function (error) {
        if (error) {
            console.log(new Date() + ':' + "打开端口" + serialPortName2 + "错误：" + error);
            process.exit(1);
        } else {
            console.log(new Date() + ':' + "打开串口端口" + serialPortName2 + "成功,等待数据发送");
        }
    });
    parser.on('data',function (data) {
       // console.log('Data:', data);
        let cmd = new Buffer([45, 45, 45, 170,40, 0, 10]);
        let data_send = Buffer.concat([cmd, data]);
     serialPort2.write(data_send, function (error) {
         if (error) console.log(new Date() + ':' + '数据发送出错');
         else {
            console.log(new Date() + ':' + '数据发送成功:',data_send);
        }
    });
      })

    
   
