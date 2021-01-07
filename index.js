// Dependencies
const app = require('express')();
require('./startup/routes')(app);

//PORT and ENVIRONMENT var
const port = 5000
const env = process.env.NODE_ENV || 'development'

// Start the server
app.listen(port, () => console.log(`${env} listening on port ${port}...`));
