const config = require("config");
const express = require("express");
const NetworkSpeed = require('network-speed');  // ES5
const testNetworkSpeed = new NetworkSpeed();
const app = express();

let listenPort = config.listenPort;
if(!listenPort) {
    listenPort = 5000;
}

// Body Parser Middleware
app.use(express.json({limit: '25mb'}));
//Form submission Middleware
app.use(express.urlencoded({extended: false, limit: '25mb'}));


app.get('/jdecnctool/api/v1.0/ping', function (req, res) {
  res.send('<h1>hello world... I am alive !!!</h1>')
});

app.get('/jdecnctool/api/v1.0/defaults', function (req, res) {
  res.send({
    defaultHtmlServer: config.defaultHtmlServer, 
    defaultAisServer: config.defaultAisServer, 
    defaultUser:config.defaultUser, 
    defaultServerManager:config.defaultServerManager
  });
});

app.get('/jdecnctool/api/v1.0/config', function (req, res) {
  res.send(config);
});


app.post('/jdecnctool/api/v1.0/uploadspeedtest', function (req, res) {
  res.send({"status":"success", "datasize": req.body.defaultData.length});
});

app.get('/jdecnctool/api/v1.0/downloadspeedtest', function (req, res) {
  let fileSizeInBytes = req.query.fileSizeInBytes || 102400;
  const defaultData = testNetworkSpeed.generateTestData(fileSizeInBytes / 1000);
  res.send({status: "success", 'data':defaultData});
});

app.listen(listenPort, () => console.log(`Server started on port ${listenPort}`));
