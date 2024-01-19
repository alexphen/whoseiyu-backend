//MSSQL

// const sql = require("mssql")

// const config = {
//     // MSSQL
//     user: 'VoiceActors',
//     password: 'loonVA',
//     server: 'AlexPC',
//     database: 'VADatabase',
//     options: {
//         trustServerCertificate: true,
//         trustedConnection: false,
//         enableArithAbort: true,
//         instanceName: 'SQLEXPRESS'
//     },
//     port: 1433
// }

// const poolPromise = new sql.ConnectionPool(config)
//     .connect()
//     .then(pool => {
//         console.log('Connected to MSSQL')
//         return pool
//     })
//     .catch(err => console.log('Database Connection Failed. Bad Config: ', err))

// module.exports = {
//     config,
//     poolPromise
// };



// Oracle DB
const oracledb = require("oracledb");

const config = {
    
     user: 'ADMIN',
     password: 'loonSQLserver1',
     server: 'VADB',
     connectString: '(description= (retry_count=200)(retry_delay=100)(address=(protocol=tcps)(port=1521)(host=adb.us-ashburn-1                         .oraclecloud.com))(connect_data=(service_name=g1e4482f6c79339_id7iztfouvg8omj1_high.adb.oraclecloud.com))                         (security=(ssl_server_dn_match=yes)))'
}

async function run() {
    await oracledb.createPool(config)
    //.getConnection()
    .then(pool => {
        console.log('Connected to OracleDB')
        return pool
    })
    .catch(err => console.log('Database Connection Failed. Bad Config: ', err))
}
// run();

module.exports = {
    config
};