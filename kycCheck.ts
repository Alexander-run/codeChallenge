var http = require("http");

module.exports = {
  async handleKycCheck(req, res) {
    let data = req.body;
    try {
        // Firstly validate the input data
        // if (data){
        //     res.status(400).send({
        //         "message": "Cannot do transaction with yourself"
        //     });
        // }
        // Proceed KYC check by requesting third-party API
        // else{
            // Set sample request body
            data = { 
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
            let options = {
              hostname:"australia-southeast1-reporting-290bc.cloudfunctions.net",
              path:"/driverlicence",
              method:"POST",
              headers:{
                "Content-Type":"application/json",
                "Authorization": ' Bearer 03aa7ba718da920e0ea362c876505c6df32197940669c5b150711b03650a78cf'
              }
            };
            let request = http.request(options,async (kycRes)=>{
              kycRes.setEncoding('utf8');
              await kycRes.on('data', (resBody) => {
                let resJSON = JSON.parse(resBody);
                verificationResultCode = resJSON.verificationResultCode;  
                switch(verificationResultCode){
                  case "Y":
                    res.status(200).send({
                      "kycResult": true
                    });
                  case "N":
                    res.status(200).send({
                      "kycResult": false
                    });
                  case "S":
                    res.status(500).send({
                      "code":"S",
                      "message": "Server Error"
                    });
                  case "D":
                    res.status(500).send({
                      "code":"D",
                      "message": "Document Error"
                    });
              }            
              });  
            });
            // Write data to request body
            var body = JSON.stringify(data);
            request.write(body);
            request.end();
            
        // }
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
  }
}