const mongose = require("mongoose");
const dbConnection = async () => {
    try {
        await mongose.connect(process.env.MONGO_URI, {
            dbName: process.env.DBNAME,
        });
        console.log('Database connection successfully.')
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = dbConnection;
