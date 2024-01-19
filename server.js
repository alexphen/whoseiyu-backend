const 
    //   Anime         = require('./dbFiles/anime'),
      express       = require('express'),
      dbOperation   = require('./dbFiles/dbOperationOracle'),
      cors          = require('cors'),
      oracledb      = require('oracledb'),
    //   MAL           = require("myanimelist-api-wrapper"),
    //   sql           = require('mssql'),
    //   dbConfig      = require('./dbFiles/dbConfig'),
      { spawn }     = require('child_process');

const API_PORT = process.env.PORT || 3000;
const app = express(),
      staticServe = express.static('build');
let client;
let session;
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use("/", staticServe);
app.use("*", staticServe);
// app.use(express.static('build'))


// OracleDB Initialization
async function init() {
    try {
      await oracledb.createPool({
        user: 'ADMIN',
        password: 'loonSQLserver1',
        connectString: '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=g1e4482f6c79339_id7iztfouvg8omj1_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'
      });

        let connection;
        try {
            // get connection from the pool and use it
            connection = await oracledb.getConnection();
        } catch (err) {
            console.log("err1");
            throw (err);
        } finally {
            if (connection) {
                try {
                    await connection.close(); // Put the connection back in the pool
                } catch (err) {
                console.log("err2");
                    throw (err);
                }
            } else {
                console.log("no connection")
            }
        }
    } catch (err) {
        console.log(err.message);
    }
    
    
    app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
}

init();


app.post('/api/actor', async(req, res) => {
    if (req.body.ActorID) {
        try {
            console.log('Called actor', req.body);
            const result = await dbOperation.getActor(req.body.ActorID)
            // console.log(result.rows)
            res.send(result.rows);  
            
        } catch (error) {
            console.log(error)
        }
    }
})

app.post('/api/actorFull', async(req, res) => {
    try {
        console.log('Called actorFull', req.body.ActorID, req.body.flag);
        const result = await dbOperation.getActorFull(req.body.ActorID, req.body.myList, req.body.flag)
        // console.log(result.rows)
        res.send(result.rows);  
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/homeActor', async(req, res) => {
    try {
        console.log('Called home actors', req.body.flag);
        const result = await dbOperation.getHomeActors(req.body.flag, req.body.myList)
        console.log(result.rows)
        res.send(result.rows);  
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/roles', async(req, res) => {
    try {
        console.log('Called roles', req.body.ActorID);
        const result = await dbOperation.getRoles(req.body.ActorID, req.body.myList, req.body.flag)
        // console.log(result.rows)
        res.send(result.rows);  
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/search', async(req, res) => {
    try {
        console.log('Called search', req.body.Title);
        const result = await dbOperation.getSearchData(req.body.Title, req.body.myList, req.body.flag)
        // console.log(result.rows)
        res.send(result.rows);  
        
    } catch (error) {
        console.log(error)
        
    }
})

app.post('/api/searchActor', async(req, res) => {
    try {
        console.log('Called search actor', req.body.name);
        const result = await dbOperation.getSearchActorData(req.body.name, req.body.myList, req.body.flag)
        // console.log(result.rows)
        res.send(result.rows);  
        
    } catch (error) {
        console.log(error)
        
    }
})

app.post('/api/show', async(req, res) => {
    try {
        console.log('Called show', req.body);
        const result = await dbOperation.getShowActors(req.body.ShowID)
        // console.log("result", result, count)
        res.send(result.rows);
        
    } catch (error) {
        console.log(error)
        
    }
})

app.post('/api/mal', async(req, res) => {
    try {
        console.log('Called mal', req.body.Username);
        try {
            const result = await dbOperation.getMAL(req.body.Username)
            // console.log(result.data.length)
            res.send(result);
            console.log("sent")
        } catch (error) {
            console.log(error.message)
            // Private Account
            if (error.message.includes("403:")) {
		let dataToSend = {};
                // spawn new child process to call the python script 
                // and pass the variable values to the python script
                const python = spawn('python3', ['auth.py', req.body.Username]);
                // collect data from script
                python.stdout.on('data', function (data) {
                    console.log('Pipe data from python script ...');
                    data = data.toString();
		            // console.log(data)
                    dataToSend["url"] = data.substring(0,data.indexOf(" "))
                    // dataToSend["veri"] = data.substring(data.indexOf(" ") + 1, data.indexOf("\n"))
                    dataToSend["veri"] = data.includes("\r") 
                        ? data.substring(data.indexOf(" ") + 1, data.indexOf("\r"))
                        : data.substring(data.indexOf(" ") + 1, data.indexOf("\n"))
                    // console.log(dataToSend)
                    // res.send(dataToSend);
                });
                // in close event we are sure that stream from child process is closed
                python.on('close', (code) => {
                    console.log(`child process close all stdio with code ${code}`);
                    // send data to browser
                    res.send(dataToSend)
                });            
                //res.send(false)
            }
        }
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/malA', async(req, res) => {
    try {
        console.log('Called mal authd', req.body.Username);
        try {
            const result = await dbOperation.getMAL(req.body.Username, req.body.auth_token)
            console.log(result.data.length)
            res.send(result);
            // console.log("sent")
        } catch (error) {
            console.log(error.message)
        }
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/top', async(req, res) => {
    try {
        console.log('Called top');
        const result = await dbOperation.getTop100()
        // console.log("result", result)
        res.send(result);
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/auth', async(req, res) => {
    try {
        console.log('Called auth');
        try {
            let dataToSend = {};
                // spawn new child process to call the python script 
                // and pass the variable values to the python script
                const python = spawn('python3', ['auth2.py', req.body.code, req.body.veri]);
                // collect data from script 
                python.stdout.on('data', function (data) {
                    console.log('Pipe data from python script ...');
                    dataToSend = JSON.parse(data.toString().replaceAll("\'", "\""));
                    // res.send(dataToSend);
                });
                // in close event we are sure that stream from child process is closed
                python.on('close', (code) => {
                    console.log(`child process close all stdio with code ${code}`);
                    // console.log(dataToSend)
                    // send data to browser
                    res.send(dataToSend)
                });
        } catch (error) {
            console.log(error.message)
        }
        
    } catch (error) {
        console.log(error)
    }
})




// dbOperation.getMAL("RufusPeanut").then(res => {
//     console.log("res", res);
// })

// dbOperation.getActor(1).then(res => {
//     console.log("manual call")
//     console.log(res.rows);
// })


// app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
