const app = require('./app');
const dbConnection = require('./config/db');
const port = process.env.PORT || 3000



app.listen(port , async () => {
    await dbConnection();
    console.log('server running ...', port);
});