var express = require('express');
var app = express();

app.get('/',function(res,rep){
    rep.send('Hello World');
});

app.listen(3000,console.log("Server is listening on localhost:3000"));