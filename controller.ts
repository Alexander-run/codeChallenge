// This is the main function for requesting the third-party API of KYC checking
// Please run the server.ts script for checking

var axios = require('axios');
var querystring = require('querystring');

// Function used to check data format
// Date of birth (required): Format YYYY-MM-DD
// First Name (required): Max 100 characters
// Middle Name: Max 100 characters
// Last Name (required): Max 100 characters
// Licence Number (required)
// State (required): Must be one of NSW, QLD, SA, TAS, VIC, WA, ACT, NT
// Expiry Date: Format: YYYY-MM-DD
function validateData(data){
  let birthDateReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  let birthDateRegExp = new RegExp(birthDateReg);
  let givenNameReg = /^[a-zA-Z]{1,100}$/;
  let givenNameRegExp = new RegExp(givenNameReg);
  let middleNameReg = /^[a-zA-Z]{1,100}$/;
  let middleNameRegExp = new RegExp(middleNameReg);
  let familyNameReg = /^[a-zA-Z]{1,100}$/;
  let familyNameRegExp = new RegExp(familyNameReg);
  let licenceNumberReg = /^\d{8}$/;
  let licenceNumberRegExp = new RegExp(licenceNumberReg);
  let stateList = ["NSW", "QLD", "SA", "TAS", "VIC", "WA", "ACT", "NT"]
  let expiryDateReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  let expiryDateRegExp = new RegExp(expiryDateReg);
  if(!birthDateRegExp.test(data.birthDate)){
    return "Input BirthDate format incorrect(required YYYY-MM-DD)"
  }else if(!givenNameRegExp.test(data.givenName)){
    return "Input First Name is max 100 characters"
  }else if(!middleNameRegExp.test(data.middleName)){
    return "Input Middle Name is max 100 characters"
  }else if(!familyNameRegExp.test(data.familyName)){
    return "Input Family Name is max 100 characters"
  }else if(!licenceNumberRegExp.test(data.licenceNumber)){
    return "Input licence number must be 8 numbers"
  }else if(stateList.indexOf(data.stateOfIssue)<0 ){
    return "Input state must be one of NSW, QLD, SA, TAS, VIC, WA, ACT, NT"
  }else if(!expiryDateRegExp.test(data.expiryDate)){
    return "Input ExpiryDate format incorrect(required YYYY-MM-DD)"
  }else{
    return "validated";
  }
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
          if (!(validateData(data)==="validated")){
              res.status(400).send({
                  "message": validateData(data)
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