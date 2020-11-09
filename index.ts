const kycCheck = require('./kycCheck.ts');
const express = require('express');
const app = express();

app.get('/',(req,res) => {
    res.send("Hello");
});
app.get('/kycresult',kycCheck.handleKycCheck);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is up on localhost: ' + PORT);
});