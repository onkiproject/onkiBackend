const express = require('express');
const axios = require('axios');
const app = express();
const sha = require('sha256');
const ejs = require('ejs');

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

const dotenv = require('dotenv').config(); // 환경변수로 관리할지 고민중
const port = 8080;

const mongoclient = require('mongodb').MongoClient;
const ObjId = require('mongodb').ObjectId;
let mydb;
const url = "mongodb+srv://onki24:kCnkn4sTNQ5Hdu4u@onki-01.abw1d.mongodb.net/";


//mongodb와 연동
mongoclient.connect(url)
    .then(client => {
        mydb = client.db('onki');
        app.listen(port, function(){
            console.log(`${port}`);
        });
    }).catch(err => {
        console.log(err);
    });


// 원격 템플릿 로더 함수
async function remoteTemplateLoader(templateName) {
    const githubRawUrl = `https://raw.githubusercontent.com/onkiproject/onkiFrontend/master/roots/${templateName}.ejs`; // 여기도 수정 필요
    try {
        const response = await axios.get(githubRawUrl);
        return response.data;
    } catch (error) {
        console.error(`템플릿 로딩 오류: ${error}`);
        return null;
    }
}

// Express 뷰 엔진 설정
app.engine('ejs', async (filePath, options, callback) => {
    try {
        const templateName = filePath.split('/').pop().split('.')[0];
        const template = await remoteTemplateLoader(templateName);
        if (template) {
            const rendered = ejs.render(template, options);
            return callback(null, rendered);
        } else {
        return callback(new Error('템플릿을 로드할 수 없습니다.'));
        }
    } catch (error) {
        return callback(error);
    }
});

// 라우트 예시...
app.get('/', (req, res) => {
    res.render('index', { title: '원격 템플릿 테스트' });
});