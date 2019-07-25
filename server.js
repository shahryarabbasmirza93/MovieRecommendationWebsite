const express = require('express');
const {
    Pool,
    Client
} = require('pg')

// const client = new Client({
//     user: 'postgres',
//     host: '35.189.61.4',
//     database: 'postgres',
//     password: 'root',
//     port: 5432
// })

const client = new Client({        //database connection on heruku

host:'ec2-107-22-238-186.compute-1.amazonaws.com',
user:'rqnhaahlnlvcet',
database:'d7bru5kmbpoq65',
password:'5dae6b0e27e09998074b8376ab75e121c129672d5ecbb71fc4f42397072f331b',
port:'5432',
ssl:true


})

// const client = new Client({
//
// host:'35.201.30.139',
// user:'postgres',
// database:'postgres',
// password:'root',
// port:'5432'
// })

client.connect();

const app = express();
app.use(express.static('assets'));

app.use(function (req, res, next) {             //header to allow cors policy
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



//client.query('SELECT NOW()', (err, res) => {
//    console.log(err, res)
//    client.end()
//})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/assets/html/home.html');
});

app.get('/getUser', (req, res) => {
    //res.send(req.query.user);

    var sqlQuery = "select * from usertable where userid like '" + req.query.user + "'";
    client.query(sqlQuery, (err, result) => {

        if (err)
            console.log(err)
        else
            console.log(result)

        if (result.rowCount == 0) //if user is not in db. then add email to db.
        {

            sqlQuery = "INSERT INTO usertable (userid,name) VALUES ('" + req.query.user + "','" + req.query.name + "')";
            client.query(sqlQuery, (err, result) => {
                if (err)
                    console.log(err)
                else
                    console.log(result)
            })

        } else {

            res.send(result);

        }

    })
});

app.get('/bookmark', function (req, res) {             //concat bookmarks in database

    sqlQuery = "UPDATE usertable SET fav = array_cat(fav, '{" + req.query.movieID + "}') where userid like '" + req.query.user + "';";
    client.query(sqlQuery, (err, result) => {
        if (err)
            console.log(err)
        else
            console.log(result)

        res.send("Movie Bookmarked");
    })
});

app.get('/removeBookmark', function (req, res) {       //remove bookmarks
    sqlQuery = "UPDATE usertable SET fav = array_remove(fav, '" + req.query.movieID + "') where userid like '" + req.query.user + "';";
    console.log(sqlQuery);
    client.query(sqlQuery, (err, result) => {
        if (err)
            console.log(err)
        else
            console.log(result)
        res.send("Movie Removed");
    })
});

app.listen(8080);
