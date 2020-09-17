const config = require("config");
const express = require("express");
const app = express()

let listenPort = config.listenPort;
if(!listenPort) {
    listenPort = 5000;
}

// Body Parser Middleware
app.use(express.json());
//Form submission Middleware
app.use(express.urlencoded({extended: false}));

app.get('/jdecnctool/api/v1.0/ping', function (req, res) {
  res.send('<h1>hello world... I am alive !!!</h1>')
})

app.listen(listenPort, () => console.log(`Server started on port ${listenPort}`));
