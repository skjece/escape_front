var express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

var app   = express();

const EscapeRoutes = require("./routes/escape");
const logger = require("./logger");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {

  console.log("inside server");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept ,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH,PUT, DELETE, OPTIONS"
  );
  
  next();
});



app.use((request,response,next)=>{

  const requestStart = Date.now();

  const { rawHeaders, httpVersion, method, socket, url } = request;
  let resp_body="";
  let req_body=request.body;

  let oldSend=response.send;//original send function
  response.send= function(data){
    // console.log("printing res data"+data);
    resp_body=data;
    oldSend.apply(response,arguments);

  }

  request.on("error", error => {
    errorMessage = error.message;
  });

  response.on("finish", () => {
    const headers = response.getHeaders();

    logger.log('info',
      ({
        received_timestamp: requestStart,
        sent_timestamp: Date.now(),
        processingTime: Date.now() - requestStart,
        url
      })
    )


  });

  next();
  return;


})



app.use("/api/escape/",EscapeRoutes);
module.exports=app;


