var http = require("http");
// Set request header
const options = {
  hostname:"australia-southeast1-reporting-290bc.cloudfunctions.net",
  path:"/driverlicence",
  method:"POST",
  headers:{
    "Content-Type":"application/json",
    "Authorization": ' Bearer 03aa7ba718da920e0ea362c876505c6df32197940669c5b150711b03650a78cf'
  }
}
// Set request body
var rawBody={ 
  "birthDate" : "1985-02-08", 
  "givenName" : "James", 
  "middleName" : "Robert", 
  "familyName" : "Smith", 
  "licenceNumber" : "94977000", 
  "stateOfIssue" : "NSW", 
  "expiryDate" : "2020-01-01" 
}
var body = JSON.stringify(rawBody);

// Instantiate a http request 
// Define the function
const request = http.request(options,async (res)=>{
  let returnValue;
  res.setEncoding('utf8');
  await res.on('data', (resBody) => {
    const resJSON = JSON.parse(resBody);
    switch (resJSON.verificationResultCode){
      case "Y":
        returnValue = true;
        break;
      case "N":
        returnValue = false;
        break;
      case "S":
      case "D":
        returnValue = null;
        break;
    }    
  });
  await console.log(returnValue);
});

request.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
request.write(body);
request.end();