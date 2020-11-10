const path = require('path');

module.exports = app =>{
    const kycCheck = require('./controller.ts');

    let router = require("express").Router();

    router.get('/',(req,res) => {
        res.sendFile(path.join(__dirname,'form.html'))
    });
    router.post('/kycresult',kycCheck.handleKycCheck);

    app.use('/',router);
}