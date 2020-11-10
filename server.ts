// Please start the server and use any browser to check the API function

const express = require('express');
const app = express();

require("./router.ts")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is up on localhost: ' + PORT);
});
