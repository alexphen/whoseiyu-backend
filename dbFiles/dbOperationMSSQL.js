const   {poolPromise} = require('./dbConfig'),
        MAL           = require('myanimelist-api-wrapper'),
        sql           = require('mssql'),
        env           = require('../dotenv.js');


const getAnime = async(title) => {
    try {        
        let pool = await poolPromise;
        let res = pool.request().query(`SELECT * FROM Anime WHERE Anime.Title='${title}'`);
        // let res = pool.request().query(`SELECT * FROM Anime`);
        console.log(res);
        return res;
    }
    catch(error) {
        console.log(error);
    }
}
const addAnime = async(Anime) => {
    try {  
        let pool = await poolPromise;
        let anime = pool.request().query(`INSERT INTO Anime VALUES
        (${Anime.ShowID}, '${Anime.Title}', '${Anime.ImageURL}')`);
        // console.log(anime);
        return anime;
    }
    catch(error) {
        console.log(error);
    }
}
const getActor = async(actID) => {
    try {        
        console.log(actID);
        let pool = await poolPromise;
        let res = await pool.request().query(`SELECT * FROM Actors WHERE Actors.ActorID='${actID}'`);
        return res;
    }
    catch(error) {
        console.log(error);
    }
}
const getActorFull = async(actID, flag) => {
    try {        
        let pool = await poolPromise;
        if (flag) {
            let res = await pool.request().query(`SELECT Actors.ActorName, Actors.ImageURL, Roles.*, Anime.Title, Actors.aFavs FROM Actors
                                                    INNER JOIN Roles ON Roles.ActorID=Actors.ActorID
                                                    INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                                    INNER JOIN MyList ON MyList.ListShowID=Anime.ShowID
                                                    WHERE Actors.ActorID='${actID}'`);
            return res;
        }
        else{
            let res = await pool.request().query(`SELECT Actors.ActorName, Actors.ImageURL, Roles.*, Anime.Title, Actors.aFavs FROM Actors
                                                INNER JOIN Roles ON Roles.ActorID=Actors.ActorID
                                                INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                                WHERE Actors.ActorID='${actID}'`);
            return res;
        }
        // console.log(res);
    }
    catch(error) {
        console.log(error);
    }
}
const addActor = async(Actor) => {
    try {        
        let pool = await poolPromise;
        let actor = pool.request().query(`INSERT INTO Actors VALUES
        (${Actor.ActorID}, '${Actor.ActorName}', ${Actor.Favorites}, '${Actor.ImageURL}')`);
        // console.log(actor);
        return actor;
    }
    catch(error) {
        console.log(error);
    }
}

//  ROLES
const getRoles = async(actID, flag) => {
    try {        
        let pool = await poolPromise;
        if (flag) {
            let res = pool.request().query(`SELECT Roles.*, Actors.ActorName, Anime.Title, Anime.Popularity FROM Roles
                                            INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
                                            INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                            INNER JOIN MyList ON Anime.ShowID=MyList.ListShowID
                                            WHERE Roles.ActorID=${actID}
                                            ORDER BY Roles.CharID`);
            // console.log(res);
            return res;
        }
        else {
            let res = pool.request().query(`SELECT Roles.*, Actors.ActorName, Anime.Title, Anime.Popularity FROM Roles
                                            INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
                                            INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                            WHERE Roles.ActorID=${actID}
                                            ORDER BY Roles.CharID`);
            // console.log(res);
            return res;
        }
    }
    catch(error) {
        console.log(error);
    }
}

const getHomeData = async(actID) => {
    try {        
        let pool = await poolPromise;
        let res = pool.request().query(`SELECT Roles.*, Actors.ActorName, Actors.ImageURL, Anime.Title FROM Roles
                                        INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
                                        INNER JOIN Anime ON Roles.ShowID=Anime.ShowID
                                        WHERE Roles.ActorID=${actID}`);
        // console.log(res);
        return res;
    }
    catch(error) {
        console.log(error);
    }
}

const getSearchData = async(title, flag) => {
    try {        
        let pool = await poolPromise;
        if (flag) {
            let res = pool.request().query(`SELECT * FROM Anime 
                                            INNER JOIN MyList ON Anime.ShowID=MyList.ListShowID
                                            WHERE Anime.Title LIKE '%${title}%'
                                            ORDER By Anime.Popularity`);
            return res;
        } else {
            let res = pool.request().query(`SELECT * FROM Anime WHERE Anime.Title LIKE '%${title}%'
                                            ORDER By Anime.Popularity`);
            return res;
        }

    }
    catch(error) {
        console.log(error);
    }
}

const getSearchActorData = async(name) => {
    try {        
        let pool = await poolPromise;
        let res = pool.request().query(`SELECT * FROM Actors WHERE Actors.ActorName LIKE '%${name}%'
                                        ORDER BY Actors.aFavs DESC`);
        return res;

        // if (flag) {
        //     let res = pool.request().query(`SELECT * FROM Actors 
        //                                     INNER JOIN MyList ON Anime.ShowID=MyList.ListShowID
        //                                     WHERE Anime.Title LIKE '%${title}%'`);
        //     return res;
        // } else {
        //     let res = pool.request().query(`SELECT * FROM Anime WHERE Anime.Title LIKE '%${title}%'`);
        //     return res;
        // }

    }
    catch(error) {
        console.log(error);
    }
}

const getShowActors = async(showID, flag) => {
    try {        
        let pool = await poolPromise;
        // let res = pool.request().query(`SELECT Roles.* FROM Roles
        //                                 WHERE Roles.ShowID=${showID}`);

        let res = pool.request().query(`SELECT Roles.CharName, Roles.Favorites, Roles.ActorID, Actors.ActorName, Actors.ImageURL FROM Roles
                                            INNER JOIN Actors ON Roles.ActorID=Actors.ActorID
                                            WHERE Roles.ShowID=${showID}
                                            AND Roles.Favorites IN (SELECT MAX(Roles.Favorites)
                                                                FROM Roles
                                                                WHERE ShowID=${showID}
                                                                GROUP BY ActorID)
                                            ORDER BY Roles.Favorites DESC`);

        return res;
        
        // let count = pool.request().query(`SELECT COUNT (DISTINCT Actors.ActorID) FROM Actors 
        //                                         INNER JOIN Roles ON Roles.ActorID=Actors.ActorID
        //                                         WHERE Roles.ShowID = 21`);
        // return [res, count];
    }
    catch(error) {
        console.log(error);
    }
}

const setList = async(ids) => {
    let pool = await poolPromise;
    try {
        pool.request().query(`TRUNCATE TABLE MyList`);
        for(let i in ids) {
            let res2 = pool.request().query(`INSERT INTO MyList(ListShowID)
                                            VALUES (${ids[i]})`)
        }                   
        return true;                                                  
    } catch (error) {
        console.log(error)
        return false;
    }
}

const getMAL = async(Username) => {
    const anime = MAL().anime;
    const list = MAL().user_animelist;
    var res;
        
    try {
        res = list({
            client_id: env.MAL_CLIENT_ID,
            user_name: Username,
            limit: 1000
        }).get_animelist()()
        // .then((data) => console.log(data))
        return res
    }
    catch(error) {
        console.log(error);
    }
}


module.exports = {
    addActor,
    addAnime,
    getActor,
    getActorFull,
    getAnime,
    getHomeData,
    getMAL,
    getSearchActorData,
    getSearchData,
    getShowActors,
    getRoles,
    setList
}