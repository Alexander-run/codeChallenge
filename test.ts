var http = require('http');

let data = { 
    "birthDate" : "1985-02-08", 
    "givenName" : "James", 
    "middleName" : "Robert", 
    "familyName" : "Smith", 
    "licenceNumber" : "94977000", 
    "stateOfIssue" : "NSW", 
    "expiryDate" : "2020-01-01" 
  };
  let verificationResultCode;
  // Set request header
  const options = {
    hostname:"australia-southeast1-reporting-290bc.cloudfunctions.net",
    path:"/driverlicence",
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": ' Bearer 03aa7ba718da920e0ea362c876505c6df32197940669c5b150711b03650a78cf'
    }
  };
  const request = http.request(options,async (res)=>{
    res.setEncoding('utf8');
    res.on('data', (resBody) => {
      let resJSON = JSON.parse(resBody);
      verificationResultCode = resJSON.verificationResultCode;  
      console.log("Success");
      console.log(verificationResultCode);
    });  
  });
  // Write data to request body
  var body = JSON.stringify(data);
  request.write(body);
  request.end();
  switch(verificationResultCode){
      case "Y":
        console.log("Y");
        break;
      case "N":
        console.log("N");
        break;
      case "S":
        console.log("S");
        break;
      case "D":
        console.log("D");
        break;
  }