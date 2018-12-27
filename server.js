const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const dbConfig = require('./app/config/db');

const app = express();
const port = 443;

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

MongoClient.connect(dbConfig.dbUrl, (err, database) => {
    if(err) return console.log(err);
    else console.log('database connection success');
    require('./app/routes') (app, database);

    app.listen(port, () => {
        console.log('server is listening on '+port);
    })
})
