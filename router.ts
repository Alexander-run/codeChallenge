// This is a simple router with two routes
// Please run the server.ts script for checking
const path = require('path');

module.exports = app =>{
    const kycCheck = require('./controller.ts');

    let router = require("express").Router();
    // response a form asking users to fill in the information for KYC-check
    router.get('/',(req,res) => {
        res.sendFile(path.join(__dirname,'form.html'))
    });
    // when form submitted, a HTTP POST request will be sent 
    // And the server will call the main function in controller.ts to handle KYC check and response as required
    router.post('/kycresult',kycCheck.handleKycCheck);

    app.use('/',router);
}