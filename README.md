# MQTT to Serialport 程序描述

本程序配合锐骐LoRa模块开发版LND433与jy901传感器及其配套测试程序使用。

jy901传感器将数据传输至LND433并进行LoRaWAN协议传输至服务器，由本程序通过MQTT拉取时时数据并转发至一虚拟串口对中，jy901的上位机程序通过获取虚拟串口对数据进行状态呈现，达到演示效果。

## 1.运行依赖

#### 运行环境：

nodejs：8.10 LTS 以上

python：2.7 以及更高

VC++运行库：2015

#### node程序依赖npm包：

mqtt，serialport

## 2. 运行步骤

确保系统打开一虚拟串口对（VSPD）

进入根目录安装依赖：

~~~bash
npm install
~~~

配置：

打开config.js进行配置

~~~js
module.exports ={
    //lora服务器mqtt连接地址
    mqttServer:'mqtt://XXXXX:XXXXX@124.72.95.198',
    //lora设备在lora服务端中的应用ID
    appID:'1',
    //lora设备ID
    devEUI:'323831380124dd01',
    //串口名
    serialPortName:'COM9',
    //波特率
    baudRate:9600,
    //数据位
    dataBits:8,
    //奇偶校验
    parity:'none',
    //停止位
    stopBits:1
}
~~~

运行程序开始转发：

~~~bash
node mqtt_to_serial.js
~~~

## 3.上位机程序

在确保传感器与LND433运作后，打开上位机程序并使用虚拟串口对中的另一个串口开始接收数据，完成演示。