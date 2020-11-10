var axios = require('axios');
var querystring = require('querystring');

function validateData(data){
    for (var key in data){
      if(data[key]===""){
        return false;
      }
    }
    return true;
}

module.exports = {
  handleKycCheck(req, res) {
    let data;
    // get data of request body
    let reqBody="";
    req.on('data', function(chunk) {
      reqBody += chunk;
    });
    req.on('end', function() {
        // parse request body
        data = querystring.parse(reqBody);
        try {
          // Firstly validate the input data
          if (!validateData(data)){
              res.status(400).send({
                  "message": "empty input item detected"
              });
          }
          // Proceed KYC check by requesting third-party API
          else{
              // Sample request body
              // data = { 
              //   "birthDate" : "1985-02-08", 
              //   "givenName" : "James", 
              //   "middleName" : "Robert", 
              //   "familyName" : "Smith", 
              //   "licenceNumber" : "94977000", 
              //   "stateOfIssue" : "NSW", 
              //   "expiryDate" : "2020-01-01" 
              // };
              let verificationResultCode;
              // Set request header
              const config = {
                  headers:{
                    "Content-Type":"application/json",
                    "Authorization": ' Bearer 03aa7ba718da920e0ea362c876505c6df32197940669c5b150711b03650a78cf'
                  }
              }
              axios.post(
                  'https://australia-southeast1-reporting-290bc.cloudfunctions.net/driverlicence',
                  data,
                  config
              )
              .then((kycRes)=>{
                  verificationResultCode = kycRes.data.verificationResultCode;
                  switch(verificationResultCode){
                    case "Y":
                      res.status(200).send({
                        "kycResult": true
                      });
                      break;
                    case "N":
                      res.status(200).send({
                        "kycResult": false
                      });
                      break;
                    case "S":
                      res.status(500).send({
                        "code":"S",
                        "message": "Server Error"
                      });
                      break;
                    case "D":
                      res.status(500).send({
                        "code":"D",
                        "message": "Document Error"
                      });
                      break;
                  }
              })  
              .catch((e)=>{
                console.log(e);
                res.status(400).send("Invalid information. An 400 Error returned from KYC API");
              })     
          }
      } catch (e) {
          console.log(e);
          res.status(400).send(e);
      }
    });
  }
}