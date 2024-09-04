const express = require('express');
const app = express();
const sha = require('sha256');

let session = require('express-session');
app.use(session({
    secret : 'dlsfjekjfleij235m',
    resave : false,
    saveUninitialized : true
}))

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs')
app.use("/public", express.static("public"));

const dotenv = require('dotenv').config();
const port = 8080;

const mongoclient = require('mongodb').MongoClient;
const ObjId = require('mongodb').ObjectId;
let mydb;
const url = "mongodb+srv://onki24:kCnkn4sTNQ5Hdu4u@onki-01.abw1d.mongodb.net/";

mongoclient.connect(url)
    .then(client => {
        mydb = client.db('myboard');
        app.listen(port, function(){
            console.log(`${port}`);
        });
    }).catch(err => {
        console.log(err);
    });