const oracledb = require("oracledb");
const config = require("./config");

const dbConfig = {
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    connectString: config.DB_HOST,
};

async function getConnection() {
    return await oracledb.getConnection(dbConfig);
}

module.exports = getConnection;
