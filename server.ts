const express = require('express');
const app = express();

require("./router.ts")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is up on localhost: ' + PORT);
});
