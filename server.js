// 필요한 모듈 불러오기
const express = require('express');
const axios = require('axios');
const app = express();
const sha = require('js-sha256').sha256;
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

// const dotenv = require('dotenv').config(); // 환경변수
const port = 3000;
const mongoclient = require('mongodb').MongoClient;
const ObjId = require('mongodb').ObjectId;
let mydb;
const url = "mongodb+srv://onki24:onki2004@onki-01.abw1d.mongodb.net/?retryWrites=true&w=majority&appName=onki-01"; 


//mongodb와 연동, 서버 띄우기 
mongoclient.connect(url)
    .then(client => {
        mydb = client.db('onki');
        app.listen(port, function(){
            console.log(`서버가 포트 ${port}에서 실행 중입니다!`);
        });
    }).catch(err => {
        console.log("MongoDB 연결 오류", err.message);
    });


// 원격 템플릿 로더 함수 1
// async function remoteTemplateLoader(templateName) {
//     const githubRawUrl = `https://raw.githubusercontent.com/onkiproject/onkiFrontend/master/roots/${templateName}.ejs`;
//     try {
//         const response = await axios.get(githubRawUrl);
//         return response.data;
//     } catch (error) {
//         console.error(`템플릿 로딩 오류: ${error}`);
//         return null;
//     }
// }


//원격 템플릿 로더 함수 2
async function remoteTemplateLoader(templateName) {
    const githubRawUrl = `https://raw.githubusercontent.com/onkiproject/onkiFrontend/master/roots/${templateName}.ejs`;
    console.log(`템플릿 URL: ${githubRawUrl}`);
    try {
        const response = await axios.get(githubRawUrl, { timeout: 5000 });
        if (response.status === 200) {
            console.log('템플릿 로딩 성공');
            return response.data;
        } else {
            console.error(`템플릿 로딩 실패. 상태 코드: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`템플릿 로딩 오류: ${error.message}`);
        return null;
    }
}

// Express 뷰 엔진 설정
app.engine('ejs', async (filePath, options, callback) => {
    try {
        const templateName = filePath.split('/').pop().split('.')[0];
        console.log(`Loading template: ${templateName}`);

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

// 라우트 
app.get('/newdiary', (req, res) => {
    res.render('newdiary1', { title: '새 일기 작성' });
});