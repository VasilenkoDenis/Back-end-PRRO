//const MongoClient = require('mongodb').MongoClient;dbConnectionString
 var fs = require('fs');
 var http = require('http');
 require('dotenv').config();
//-- var https = require('https');
//Standard port for MongoDB: 27017
// Local  -10.215.0.121:27017
// Remote -213.160.150.219:10400
// DataCentre -185.250.23.89:10400 (Domain name: rro.ics-market.com.ua)
//const dbConnectionString = 'mongodb://snmp_user:Service_RW@213.160.150.219:10400/snmp_main_db';
//const KSEFServerConnectionString = 'mongodb://mainUSER:KSEFpswd_2021@213.160.150.219:10400/ksef_main_db';

const KSEFServerConnectionString = 'mongodb://mainUSER:KSEFpswd_2021@rro.ics-market.com.ua:10401/ksef_main_db';
const FirmwareDBConnectionString = 'mongodb://userDB:fWarePSWD_2025@rro.ics-market.com.ua:10400/firmware_db';
const helmet = require('helmet'); // Helmet допомагає захистити ваші Express-додатки, встановлюючи різні HTTP-заголовки. Це не чарівна куля, але може допомогти!
const compression = require('compression'); // ПЗ стиснення Node.js. ПЗ намагатиметься стиснути тіла відповідей для всіх запитів, що проходять через нього, на основі заданих параметрів.
//var multer  = require('multer');
const mime = require('mime');  // Модуль mime надає комплексний API для визначення MIME-типу файлу на основі його розширення. Його можна використовувати для встановлення заголовка Content-Type у відповідях HTTP, що гарантує правильну інтерпретацію даних клієнтами.
const path = require('path'); // Модуль path надає утиліти для роботи з файловими та директорійними шляхами. Він дозволяє об'єднувати, розділяти та нормалізувати шляхи, а також отримувати інформацію про файли та директорії.
const mongoose = require('mongoose'); // Mongoose - це об'єктно-документна модель (ODM) для MongoDB та Node.js. Вона забезпечує схему для ваших даних, валідацію, побудову запитів та інші функції, що полегшують роботу з MongoDB у Node.js.

//const User = require('./models/user');
//const AccountData = require('./models/usersdata');
//const Token = require('./models/token');
const cookieParser = require('cookie-parser'); // Модуль cookie-parser - це middleware для Express, який розбирає cookie, що надходять у запиті, і робить їх доступними через req.cookies. Це дозволяє легко отримувати та встановлювати cookie у вашому додатку.
const jwt = require('jsonwebtoken'); // Модуль jsonwebtoken дозволяє створювати та перевіряти JSON Web Tokens (JWT) у Node.js. JWT - це компактний, URL-безпечний спосіб представлення заявок між двома сторонами. Він часто використовується для аутентифікації та авторизації користувачів у веб-додатках.
const express = require('express');  // Express - це веб-фреймворк для Node.js, який спрощує створення веб-додатків та API. Він надає простий та гнучкий спосіб обробки HTTP-запитів, маршрутизації, middleware та інших функцій веб-розробки.
const session = require('express-session'); // express-session - це middleware для Express, який дозволяє зберігати дані сесії на сервері. Він створює унікальний ідентифікатор сесії для кожного користувача та зберігає дані сесії на сервері, що дозволяє відстежувати стан користувача між запитами.
const flash = require('express-flash'); // express-flash - це middleware для Express, який дозволяє відображати тимчасові повідомлення (flash messages) користувачам. Flash-повідомлення зберігаються у сесії та видаляються після того, як вони були відображені, що дозволяє показувати повідомлення про успіх або помилку після перенаправлення.
const swaggerConfig = require('./modules/swaggerConfig'); // Модуль swaggerConfig.js надає конфігурацію для інтеграції Swagger UI у ваш додаток Express. Він використовує бібліотеки swagger-jsdoc та swagger-ui-express для генерації документації API на основі JSDoc-коментарів у вашому коді та відображення її у вигляді інтерактивного інтерфейсу користувача.
var Tokens = require('csrf'); // Модуль csrf надає захист від атак CSRF (Cross-Site Request Forgery) у веб-додатках. Він генерує унікальні токени для кожного користувача та перевіряє їх при обробці запитів, щоб переконатися, що запит походить від авторизованого користувача.
var tokens = new Tokens();
const csrf = require('@dr.pogodin/csurf'); // Модуль csurf надає захист від атак CSRF (Cross-Site Request Forgery) у веб-додатках Express. Він генерує унікальні токени для кожного користувача та перевіряє їх при обробці запитів, щоб переконатися, що запит походить від авторизованого користувача.
const cors = require('cors'); // Модуль cors надає middleware для Express, який дозволяє налаштовувати політику CORS (Cross-Origin Resource Sharing) у вашому додатку. CORS визначає, які домени можуть отримувати доступ до ресурсів вашого сервера, що дозволяє контролювати безпеку та доступність вашого API.
var passport = require('passport'); // Passport - це middleware для Node.js, який забезпечує аутентифікацію користувачів у веб-додатках. Він підтримує різні стратегії аутентифікації, такі як локальна аутентифікація, OAuth, OpenID та інші, що дозволяє легко інтегрувати аутентифікацію у ваш додаток.
var utils = require('./modules/utils'); // Модуль utils.js надає допоміжні функції для генерації токенів та випадкових чисел. Він містить функцію generateToken, яка генерує випадковий рядок заданої довжини, використовуючи символи латинського алфавіту та цифри. Функція getRandomInt використовується для отримання випадкового цілого числа у заданому діапазоні.
var mailer = require('./modules/mailer');
var secret = tokens.secretSync();
const tokensecret = process.env.TOKEN_SECRET;
const f_tokensecret =process.env.F_TOKEN_SECRET;
const tokensalt = process.env.TOKENSALT;
var LocalStrategy = require('passport-local').Strategy; // Passport-local - це стратегія аутентифікації для Passport, яка використовує локальну базу даних користувачів для перевірки облікових даних. Вона дозволяє користувачам входити у ваш додаток за допомогою імені користувача та пароля, зберігаючи їх у базі даних на сервері.
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy; // Passport-google-oauth2 - це стратегія аутентифікації для Passport, яка дозволяє користувачам входити у ваш додаток за допомогою облікового запису Google. Вона використовує протокол OAuth 2.0 для отримання доступу до інформації про користувача з Google та забезпечує безпечну аутентифікацію без необхідності зберігати паролі користувачів у вашому додатку.
var moment = require('moment'); // Модуль moment.js надає зручний спосіб роботи з датами та часом у JavaScript. Він дозволяє легко створювати, форматувати, порівнювати та маніпулювати датами та часом, а також підтримує різні часові пояси та локалізації.
var gf = require('./modules/google-auth'); // Модуль google-auth.js надає функції для аутентифікації користувачів за допомогою облікового запису Google. Він використовує протокол OAuth 2.0 для отримання доступу до інформації про користувача з Google та забезпечує безпечну аутентифікацію без необхідності зберігати паролі користувачів у вашому додатку.
const schedule = require('node-schedule'); // Модуль node-schedule дозволяє планувати виконання функцій у Node.js на основі розкладу. Він підтримує різні формати розкладу, такі як cron-вирази та об'єкти дати, що дозволяє легко налаштовувати періодичне виконання завдань у вашому додатку.
const passfather = require('passfather');  // Модуль passfather надає функції для генерації випадкових паролів у Node.js. Він дозволяє налаштовувати параметри генерації паролів, такі як довжина, наявність цифр, великих та малих літер, а також спеціальних символів, що дозволяє створювати безпечні паролі для користувачів вашого додатку.

// Кількість днів до 1-го повідомлення про закінчення терміну дії облікового запису.
const preWarningDays1 = 14; 
// Кількість днів до 2-го повідомлення про закінчення терміну дії облікового запису.
const preWarningDays2 = 3;
// Хвилина перевірки терміну дії облікових записів 
const scheduleMinute = 30;
// Година перевірки терміну дії облікових записів
const scheduleHour = 8;
//Certificate
//const privateKey = fs.readFileSync('/etc/letsencrypt/live/rro.ics-market.com.ua/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/rro.ics-market.com.ua/cert.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/rro.ics-market.com.ua/chain.pem', 'utf8');

//--const privateKey = fs.readFileSync('/home/market/ssl/localcerts/private.key', 'utf8');
//--const certificate = fs.readFileSync('/home/market/ssl/localcerts/server.crt', 'utf8');

//--const credentials = {
//--  	 key: privateKey,
//--     cert: certificate,
//--    // 	 ca: ca

//--    // Для самопідписуваних сертифікатів
//--    requestCert:  false,       
//--    rejectUnauthorized: false
//--};

//const routes = require('./routes');

//Хешування паролів користувачів
var crypto = require('crypto');
// Модуль для аналізу виразів
var assert = require('assert');

//var bodyParser = require('body-parser');

var app = express(); 
app.use(express.json());


app.set('views', __dirname + '/views');

// Створюємо парсер для даних application/x-www-form-urlencoded
const urlencodedParser = express.urlencoded({limit: '50mb', extended: true});

// Ініціалізуємо Swagger UI через окремий модуль.
swaggerConfig.initSwagger(app);

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, __dirname + '/uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname) //Appending file
//     }
// })

// var upload = multer({storage: storage});

// /**
//  * Create the google auth object which gives us access to talk to google's apis.
//  */
// function createConnection() {
//     return new google.auth.OAuth2(
//       googleConfig.clientId,
//       googleConfig.clientSecret,
//       googleConfig.redirect
//     );
//  }

// /**
//  * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
//  */
// function getConnectionUrl(auth) {
//     return auth.generateAuthUrl({
//       access_type: 'offline',
//       prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
//       scope: defaultScope
//     });
//  }
 
// /**
//  * Helper function to get the library with access to the google plus api.
//  */
// function getGooglePeopleApi(auth) {
//         return google.people({
//             version: 'v1',
//             auth: auth,
//         });
//  }

//   /**
//    * Create the google url to be sent to the client.
//    */
//   function urlGoogle() {
//     const auth = createConnection(); // this is from previous step
//     const url = getConnectionUrl(auth);
//     return url;
//   }

/**
    * generates random string of characters i.e salt
    * @function
    * @param {number} length - Length of the random string.
 */

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};


/**
    * hash password with sha256.
    * @function
    * @param {string} password - List of required fields.
    * @param {string} salt - Data to be validated.
 */

var sha256 = function(password, salt){
    var hash = crypto.createHmac('sha256', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
}

/**
    * hash password with sha512.
    * @function
    * @param {string} password - List of required fields.
    * @param {string} salt - Data to be validated.
 */

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
}

var getIPAddress = function () {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
      var iface = interfaces[devName];
  
      for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
          return alias.address;
      }
    }
    return '0.0.0.0';
}

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 ives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
}

var servicePassword=function(){
        
    return passfather({
        numbers:   true,
        uppercase: true,
        lowercase: true,
        symbols:   false,
        length:    8,
    })
}

var connectionPassword=function(){
        
    return passfather({
        numbers:   true,
        uppercase: false,
        lowercase: false,
        symbols:   false,
        length:    4,
    })
}

/**
    * Функція реєстрації нового користувача у базі даних.
    * @function
    * @param {object} request - Об'єкт запиту, що містить дані користувача для реєстрації.
    * @param {object} response - Об'єкт відповіді, що буде використаний для надсилання результатів.
 */

var registerNewUser = function (request, response){

    var query = User.findOne({email: request.body.email});
    assert.ok(!(query instanceof Promise));
    
    query.then(function(doc) {
   
        //console.log(doc);
        if(doc==null){
        // if (typeof doc === 'undefined'){
            //console.log('undefined');
            // Generate HASH 
            var salt = genRandomString(16);
            var passwordData = sha512(request.body.password, salt);
      
            // a document instance
            var curUser = new User({username: request.body.username,
                                  email: request.body.email,
                                  hash: passwordData});

            //                                            
            curUser.save().then (()=> {
          
                console.log(curUser.username + " saved to user collection.");       

                var EMAIL_SECRET = Buffer.from(sha256(tokensecret, tokensalt).passwordHash).toString('base64');
                console.log(EMAIL_SECRET);

                User.findOne({email: request.body.email})
                    .then(doc => {
                        if (!doc || !doc._id) {
                            console.log('Користувача не знайдено після збереження!');
                            return response.status(400).json({
                                success: false,
                                message: 'Користувача не знайдено після збереження!',
                            });
                        }

                        const index = doc._id;
                        console.log('index1 - ' + index);

                        const emailToken = jwt.sign({user: `${index}`}, EMAIL_SECRET);
                        console.log(emailToken);

                        const url = `${process.env.URL_PREFIX}/confirm/${emailToken}`;

                        const mailOptions = {
                            from: process.env.EMAIL_SENDER,
                            to: request.body.email,
                            subject: 'Підтвердження реєстрації на сайті: https://retailbox-prro.ics-market.com.ua',
                            html: '<p align = "center"><b> Вітаємо Вас, шановний(-а) ' + request.body.username + '!</b></p><br>' +
                                'Ви отримали цей лист, оскільки Ваш e-mail був зареєстрований в електронному кабінеті на сайті "https://retailbox-prro.ics-market.com.ua". <br>' +
                                'Якщо Ви не здійснювали реєстрацію, тоді проігноруйте або видаліть цей лист.<br>' +
                                'Щоб завершити реєстрацію натисніть кнопку "Підтвердити реєстрацію" нижче та підтвердіть свій e-mail. <br>' +
                                'Якщо протягом 24 годин Ви не підтвердите свій e-mail, Ваш обліковий запис буде видалено з системи. <br>' +
                                'Ваш пароль доступу до електронного кабінету: <b>' + request.body.password + '</b>.<br><br>' +
                                
                                `<div style="text-align:center"><a href="${url}" style="display:inline-block;padding:10px 12px;background:#1a73e8;color:#ffffff;text-decoration:none;border-radius:4px;">Підтвердити реєстрацію</a></div><br><br>` +
                                
                                'Це повідомлення було надіслано Вам автоматично, відповідати на нього не потрібно.<br>' +
                                'З повагою, адміністрація ПРРО "RetailBox", ТОВ "ІКС-Маркет".<br>' +
                                '<div style="text-align:left"><img src="cid:logo@ics" alt="Logo" style="max-width:64px;margin-bottom:10px;"></div>',
                            attachments: [{ filename: 'logo.jpg', path: path.join(__dirname, 'icons', 'logo.jpg'), cid: 'logo@ics' }]
                        };

                        return mailer.sendMail(mailOptions)
                            .then(() => response.status(200).json({
                                success: true,
                                message: 'Вам надіслано листа, перейдіть за посиланням у ньому для завершення реєстрації!'
                            }))
                            .catch(err => {
                                console.log(err);
                                return response.status(400).json({
                                    success: false,
                                    message: 'Помилка надсилання листа на e-mail користувача: ' + err.message,
                                });
                            });
                    })
                    .catch(err => {
                        console.error(err);
                        return response.status(500).json({
                            success: false,
                            message: 'Помилка сервера: ' + err.message
                        });
                    });
              
            })
            .catch (err => {
                console.error(err);
                return response.status(500).json({
                    success: false,
                    message: 'Помилка сервера: ' + err.message
                });
           });
        }
        else{
          console.log('defined')
          request.body.email = null;
          // Повідомляємо що користувач вже існує в системі 
          return response.status(400).json({
            success: false,
            message: 'Ця електронна адреса вже зареєстрована!',
          });
        }
    });
}

/**
    * Функція відновлення пароля користувача за e-mail.
    * @function
    * @param {object} request - Об'єкт запиту, що містить дані користувача для відновлення пароля.
    * @param {object} response - Об'єкт відповіді, що буде використаний для надсилання результатів.    *  
 */

var forgotPassword = function (request, response){
       
    User.findOne({email: request.body.email})
    
        .then((doc) => {        
            if (!doc || !doc._id) {
                console.log('Користувач з таким e-mail не зареєстрований у системі!');
                return response.status(400).json({
                    success: false,
                    message: 'Користувач з таким e-mail не зареєстрований у системі!',
                });
            }

            // Якщо користувача знайдено – генеруємо токен для скидання пароля
            var FORGOT_SECRET = Buffer.from(sha256(f_tokensecret, tokensalt).passwordHash).toString('base64');
            console.log(FORGOT_SECRET);
        
            var index =  doc._id;

            // sync making forgotToken
            var forgotToken = jwt.sign({user:`${index}`}, FORGOT_SECRET);
                          
            console.log(forgotToken)

            // Зберігаємо токен у базі даних для користувача
            User.updateOne({email: request.body.email},{$set:{token:forgotToken}},{upsert:true})
                .then((result) => {
            
                    if (!result || result.nModified === 0) {
                        console.log('Користувач з таким e-mail не зареєстрований у системі!');
                        return response.status(400).json({
                            success: false,
                            message: 'Користувач з таким e-mail не зареєстрований у системі!',
                        });
                    }

                    // const url = `http://${getIPAddress()}:3000/change_password/${forgotToken}`;
                    const url = `${process.env.URL_PREFIX}/change_password/${forgotToken}`; 
                    var mailOptions = {
                        from:  process.env.EMAIL_SENDER,
                        to: request.body.email,
                        subject:'Відновлення доступу на сайт: https://retailbox-prro.ics-market.com.ua',
                        html:   `<p align="center"><b> Доброго дня, шановний(-а) ${doc.username} '! </b></p><br><br>`+

                            'Вам надіслано цей лист, оскільки Ви зареєстровані на сайті <b>https://retailbox-prro.ics-market.com.ua</b>.<br>' +
                            '<b> Якщо Ви не заходили на сайт та не намагалися відновити свій пароль, проігноруйте цей лист або видаліть його.</b><br><br>'+
                
                            `<div style="text-align:center"><a href="${url}" style="display:inline-block;padding:10px 12px;background:#1a73e8;color:#ffffff;text-decoration:none;border-radius:4px;">Відновити пароль</a></div><br><br>`+

                            'Це повідомлення було надіслано Вам автоматично, відповідати на нього не потрібно.<br>'+
                            'З повагою, адміністрація ПРРО "RetailBox", ТОВ "ІКС-Маркет".<br>'+
                            '<div style="text-align:left"><img src="cid:logo@ics" alt="Logo" style="max-width:64px;margin-bottom:10px;"></div>',
                        attachments: [{ filename: 'logo.jpg', path: path.join(__dirname, 'icons', 'logo.jpg'), cid: 'logo@ics' }]
                    };
               
               
                    return mailer.sendMail(mailOptions)
                        .then(() => response.status(200).json({
                            success: true,
                            message: 'Вам надіслано листа, перейдіть за посиланням у ньому для відновлення пароля!!'
                        }))
                        .catch(err => {
                            console.log(err);
                            return response.status(400).json({
                                success: false,
                                message: 'Помилка надсилання листа на e-mail користувача: ' + err.message,
                            });
                        });
               
                })
                .catch((err) => {
                    console.error(err);
                    return response.status(500).json({
                        success: false,
                        message: 'Помилка сервера: ' + err.message
                    });
                });

        })
        .catch(err => {
            console.error(err);
            return response.status(500).json({
                success: false,
                message: 'Помилка сервера: ' + err.message
            });
        });

}
 
/**
    * Функція підтвердження нового користувача за jwt-токеном підтвердження, що надісланий на e-mail користувача.
    * @function
    * @param {string} id - Ідентифікатор користувача у базі даних.
    * @param {object} req - Об'єкт запиту, що містить дані користувача для підтвердження.
    * @param {object} res - Об'єкт відповіді, що буде використаний для надсилання результатів.
 */

var confirmNewUser = function (id, req, res){

    //const FmUser = require('./models/fmuser');
    var localDate = ((new Date).toString() +' UTC').toLocaleString();
    // Пошук у базі та зміна статусу користувача за кодом:
    // Змінюємо статус підтвердження реєстрації користувача.
    // Заносимо дату реєстрації користувача.
    // Записуємо зміни до бази даних. Після цього користувач може увійти на сайт.

    var query = FmUser.findByIdAndUpdate(id,{confirmed: true, regdate: localDate},{useFindAndModify:false});

    query.then(function(doc) {
        if (!doc){
            console.log('doc - undefined');
            return res.status(400).json({
                success: false,
                message: 'Користувача не знайдено!',
            });
        }
        else{

            const url = `${process.env.URL_PREFIX}`;
 
            var mailOptions = {
                from: process.env.EMAIL_SENDER,
                to: doc.email,
                subject:'Успішне завершення реєстрації на сайті: https://retailbox-prro.ics-market.com.ua',
                html:   '<p align = "center"><b> Вітаємо Вас, шановний(-а) '+ doc.username + '!</b></p><br><br>'+

                        'Раді Вам повідомити, що Ви успішно підтвердили свою реєстрацію в електронному кабінеті на сайті \"https://retailbox-prro.ics-market.com.ua\". <br><br>' +
                                     
                        `<div style="text-align:center"><a href="${url}" style="display:inline-block;padding:10px 12px;background:#1a73e8;color:#ffffff;text-decoration:none;border-radius:4px;">Вхід у сервіс</a></div><br><br>`+
                                                                         
                        'Це повідомлення було надіслано Вам автоматично, відповідати на нього не потрібно.<br>'+
                        'З повагою, адміністрація ПРРО "RetailBox", ТОВ "ІКС-Маркет".<br>'+
                        '<div style="text-align:left"><img src="cid:logo@ics" alt="Logo" style="max-width:100px;margin-bottom:10px;"></div>',                      
                attachments: [{ filename: 'logo.jpg', path: path.join(__dirname, 'icons', 'logo.jpg'), cid: 'logo@ics' }]
            };

            mailer.sendMail(mailOptions).catch(function(err){
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: 'Помилка надсилання листа на e-mail користувача: '+ err.message,
                    });
                }
            });

            console.log('Користувач підтверджений: ' + doc.username + ' (' + doc.email + ')');
            return res.json({success: true, message: 'Користувач успішно підтверджений.'});
        }

    }).catch(function(err) {
        console.log("Помилка: " + err);  
        return res.status(400).json({   
            success: false,
            message: err,
        });
    });  
}

var updateFirmwaresData = function (mongoose_model,req, res){
    
    return new Promise((resolve, reject) => {
        if(!req.body){
            // return res.sendStatus(400);
            // return reject(new Error().)(400);
            // return res.status(400).send('Bad Request');
            // return res.status(400).json({error: 'Bad Request'});
            const err = new Error('Bad Request');
            err.status = 400;
            return reject(err);   
        } 
        
        var objects = JSON.parse(req.body.updateFirmwaresData);    
        if (Object.keys(objects).length > 0){ 

            let ops = objects.map(function(item) {

                var filter = {};
                if (item.id === undefined || item.id === null)
                    filter = {model: item.model, version: item.version, revision: item.revision};
                else
                    filter = {_id: item.id};
                    
                var update={};

                for(var key in item){
            
                    switch(key){

                        case 'model':    
                            update = Object.assign(update, {model:item[key]})
                            continue;

                        case 'version':    
                            update = Object.assign(update, {version:item[key]})
                            continue;

                        case 'revision':
                            update = Object.assign(update, {revision:item[key]})
                            continue;    
                            
                        case 'date':
                            update = Object.assign(update, {uploadedDate: new Date()})
                            continue;

                        case 'person':
                            update = Object.assign(update, {person:item[key]})
                            continue;

                        case 'description':
                            update = Object.assign(update, {description:item[key]})
                            continue;

                        case 'md5':
                            update = Object.assign(update, {md5:item[key]})
                            continue;

                        case 'eeprom':    
                            update = Object.assign(update, {firmware: item[key]})
                            continue;                           
                    }
                }

                return mongoose_model.findOneAndUpdate(filter, update, {useFindAndModify:false, new:true, upsert:true}).exec();
                
            });
            Promise.all(ops)
                .then(() => resolve())
                .catch(err => {
                    const error = new Error(err.message);
                    error.status = 500;
                    return reject(err);   
                });   
        } 
        else 
            resolve();                                 
    });  
}

var removeFirmwares = function (mongoose_model,req, res){
             
    return new Promise((resolve, reject) => {
        if(!req.body){
            // return res.sendStatus(400);
            // return reject(new Error().)(400);
            // return res.status(400).send('Bad Request');
            // return res.status(400).json({error: 'Bad Request'});
            const err = new Error('Bad Request');
            err.status = 400;
            return reject(err); 
        } 
        
        var objects =JSON.parse(req.body.removeFirmwares);
        if (Object.keys(objects).length > 0){

            let ops = objects.map(function(item) {
                
                var filter = {};
                if (item.id === undefined || item.id === null)
                    filter = {model: item.model, version: item.version, revision: item.revision};
                else
                    filter = {_id: item.id};
                return mongoose_model.deleteOne(filter).exec();
            });

            Promise.all(ops)
                .then(() => resolve())
                .catch(err => {
                    const error = new Error(err.message);
                    error.status = 500;
                    return reject(err);   
                });   
        } 
        else 
            resolve();            
    });
}

var updateDevicesFirmware = function (mongoose_model,req, res){
    
    return new Promise((resolve, reject) => {
        if(!req.body){
            // return res.sendStatus(400);
            // return reject(new Error().)(400);
            // return res.status(400).send('Bad Request');
            // return res.status(400).json({error: 'Bad Request'});
            const err = new Error('Bad Request');
            err.status = 400;
            return reject(err);   
        } 
        
        var objects = JSON.parse(req.body.updateDevicesFirmware);    
        if (Object.keys(objects).length > 0){ 

            let ops = objects.map(function(item) {

                //console.log(item);

                const filter = {model: item.model, serial: item.sn};
                    
                var update={};

                for(var key in item){
            
                    switch(key){

                        case 'model':    
                            update = Object.assign(update, {model:item[key]})
                            continue;
                        case 'sn':    
                            update = Object.assign(update, {serial:item[key]})
                            update = Object.assign(update, {id_dev:'4'+item[key]})
                            continue;
                        case 'targetVersion':    
                            update = Object.assign(update, {targetVersion:item[key]})
                            continue;
                        case 'targetRevision':
                            update = Object.assign(update, {targetRevision:item[key]})
                            continue;
                        case 'updateDate':
                            update = Object.assign(update, {updateDate: item[key]});
                            continue;
                        case 'expireDate':
                            if (item[key]==null){
                                update = Object.assign(update, {expireDate: null});
                            }
                            else{
                                var date = moment.utc(item[key], 'DD-MM-YYYY').toISOString().split('T')[0];
                                update = Object.assign(update, {expireDate: date});
                            }
                            continue;

                        case 'isAllowing':
                            update = Object.assign(update, {isAllowing:item[key]})
                            continue;

                        case 'description':
                            update = Object.assign(update, {description:item[key]})
                            continue;

                        case 'client':
                            update = Object.assign(update, {client:item[key]})
                            continue;

                    }
                }
                
                return mongoose_model.findOneAndUpdate(filter, update, {useFindAndModify:false, new:true, upsert:true}).exec();
                
            });
            Promise.all(ops)
                .then(() => resolve())
                .catch(err => {
                    const error = new Error(err.message);
                    error.status = 500;
                    return reject(err);   
                });   
        } 
        else 
            resolve();                                 
    });  
}

var removeDevices = function (mongoose_model,req, res){
             
    return new Promise((resolve, reject) => {
        if(!req.body){
            // return res.sendStatus(400);
            // return reject(new Error().)(400);
            // return res.status(400).send('Bad Request');
            // return res.status(400).json({error: 'Bad Request'});
            const err = new Error('Bad Request');
            err.status = 400;
            return reject(err); 
        } 
        
        var objects =JSON.parse(req.body.removeDevices);
        if (Object.keys(objects).length > 0){

            let ops = objects.map(function(item) {
                const filter = {model: item.model, serial: item.sn};
                return mongoose_model.deleteOne(filter).exec();
            });

            Promise.all(ops)
                .then(() => resolve())
                .catch(err => {
                    const error = new Error(err.message);
                    error.status = 500;
                    return reject(err);   
                });   
        } 
        else 
            resolve();            
    });
}

var verifyToken = async function(req){

    var FORGOT_SECRET = Buffer.from(sha256(f_tokensecret, tokensalt).passwordHash).toString('base64');
            
    const decoded = jwt.verify(req.params.token, FORGOT_SECRET);
    console.log(decoded.user);
    var id = decoded.user;
    //const FmUser = require('./models/fmuser');
    
    const doc = await FmUser.findById(id);
    if (!doc || !doc._id) {
        console.log('Користувача не знайдено!');
        return {
            success: false,
            message: 'Користувача не знайдено!'
        };
    }

    console.log('from db: '+ doc.token);
    console.log('from mail: '+ req.params.token);
    const tokenEqual = doc.token === req.params.token;

    if (!tokenEqual) {
        return {
            success: false,
            message: 'Помилка: невірний токен користувача!',
            error: 'Помилка: невірний токен користувача!'
        };
    }

    const updatedDoc = await FmUser.findByIdAndUpdate(id, {$unset: {token: ''}}, {useFindAndModify:false});

    if (!updatedDoc) {
        console.log('doc - undefined');
        return {
            success: false,
            message: 'Користувача не знайдено!',
            error: 'Помилка: користувача не знайдено!'
        };
    }

    return {
        success: true,
        message: 'Токен користувача підтверджено!',
        jwt: req.params.token,
        userId: id
    };
}

/**
    * Функція зміни пароля користувача у базі даних.
    * @function 
    * @param {object} request - Об'єкт запиту, що містить дані користувача для зміни пароля.
    * @param {object} response - Об'єкт відповіді, що буде використаний для надсилання результатів.
    * @returns {void} - Не повертає значення, результат надсилається через об'єкт response.
 */

var changePassword = function(request, response){

    var id = request.params.userId;

    // Generate HASH 
    var salt = genRandomString(16);
    var passwordData = sha512(request.body.newPassword, salt);
    //const FmUser = require('./models/fmuser');
    FmUser.findByIdAndUpdate(id,{hash: passwordData},{useFindAndModify:false})
        .then(doc=>{
            if (!doc) {
                return response.status(400).json({
                    success: false,
                    message: 'Користувача не знайдено!'
                });
            }

            const url = `${process.env.URL_PREFIX}`;
            
            var mailOptions = {
                from: process.env.MAIL_SENDER,
                to: doc.email,
                subject:'Успішна зміна пароля доступу на сайті: https://retailbox-prro.ics-market.com.ua',
                html:   '<p align="center"><b> Вітаємо Вас, шановний(-а) '+ doc.username + '!</b></p><br><br>'+

                        'Повідомляємо Вам, що Ви успішно змінили свій пароль на сайті https://retailbox-prro.ics-market.com.ua. <br>' +
                        'Ваш новий пароль: <b>'+ request.body.newPassword + '</b><br><br>' +
                                      
                        `<div style="text-align:center"><a href="${url}" style="display:inline-block;padding:10px 12px;background:#1a73e8;color:#ffffff;text-decoration:none;border-radius:4px;">Вхід у сервіс</a></div><br><br>`+
         
                        'Це повідомлення було надіслано Вам автоматично, відповідати на нього не потрібно.<br>' +
                        'З повагою, адміністрація ПРРО "RetailBox", ТОВ "ІКС-Маркет".<br>'+
                        '<div style="text-align:left"><img src="cid:logo@ics" alt="Logo" style="max-width:100px;margin-bottom:10px;"></div>',
                attachments: [{ filename: 'logo.jpg', path: path.join(__dirname, 'icons', 'logo.jpg'), cid: 'logo@ics' }]
            };

            return mailer.sendMail(mailOptions)
                .then(()=> response.status(200).json({
                    success: true,
                    message: 'Вітаємо! Ваш новий пароль успішно збережено.'
                }))
                .catch(err => {
                    console.log(err);
                    return response.status(400).json({
                        success: false,
                        message: 'Помилка надсилання листа на e-mail користувача: ' + err.message,
                    });
                });               

        })
        .catch( err=>{
            console.error(err);
            return response.status(500).json({
                success: false,
                message: 'Помилка сервера: ' + err.message
            });

        })
}

/**
    * Функція перевірки пароля користувача.
    * @function
    * @param {string} password - Пароль користувача для перевірки.
    * @param {object} hash - Об'єкт, що містить хеш пароля та сіль користувача.
    * @return {boolean} - Повертає true, якщо пароль збігається з хешем, інакше false.
 */

var verifyPassword = function(password, hash){
    var passwordData = sha512(password, hash.salt);

    if (hash.passwordHash === passwordData.passwordHash)
        return true;
    else
        return false;    
}

// var verifyUser = function(request, response){

//     var query = User.findOne({email: request.body.email});
//     assert.ok(!(query instanceof Promise));
        
//     query.then(function(doc) {

//         if(doc==null){
//             // if (typeof doc === 'undefined'){
//                 console.log('email - undefined');
//                 // request.flash('error', 'User not found!');
//                 request.flash('error', 'Користувача не знайдено!');
//                 return response.redirect('/');

//         }


//         // Перевірка користувача на завершення реєстрації
//         if (!doc.confirmed){
//             // request.flash('error', 'User did not confirm registration. Please check your email box!');
//             request.flash('error', 'Користувач не підтвердив реєстрацію. Будь ласка, перевірте Вашу електронну пошту!');
//             return response.redirect('/');
//         }

//         var passwordData = sha512(request.body.password, doc.hash.salt);
        
//         if (doc.hash.passwordHash === passwordData.passwordHash){
//             return response.redirect('/search');
//         }
//         else{
//             // request.flash('error', 'Incorrect user password!');
//             request.flash('error', 'Невірний пароль користувача!');
//             return response.redirect('/');
//         }

//     });  
// }

app.use(helmet()); // Вмикаэмо захист відомих веб-уразливостей, встановлюючи відповідні заголовки HTTP. Це не чарівна паличка, але може допомогти!
app.use(compression()); // Вмикаємо стиснення HTTP-відповідей, що проходять через middleware. Це може значно зменшити розмір відповіді та покращити час завантаження веб-сторінки.

app.set('view engine', 'ejs');
app.use('/images',express.static(path.join(__dirname + '/views/public/images'))); 

//app.use(cookieParser());
// app.use(session({
//        secret: 'super-secret-key',
//        key: 'super-secret-cookie',
//        path: '/',
//        httpOnly: false, // if you want you can use true here
//        secure: true, // if you are using HTTPS I suggest true here
//        resave: false,
//        saveUninitialized: false,
//        cookie: {}
//      }));

app.use(cookieParser());
app.use(session({
    secret: 'super-secret-key',
    name: 'retailbox.sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
  }));
app.use(flash());
//app.use(csrf({cookie:true}));

// Настройка csurf с хранением токена в cookie
const csrfProtection = csrf({
  cookie: {
    httpOnly: true, // токен нельзя прочитать из JS
    secure: false,  // true для HTTPS
    sameSite: 'strict', // защита от CSRF
    maxAge: 18000  // 30 минут в секундах
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'] // игнорируемые методы, для которых CSRF-токен не проверяется
});

app.use((req, res, next) => {
  // Пропускаем GET-запросы на /confirm и /change_password без проверки CSRF  
  if (req.method === 'GET' && (req.path.startsWith('/confirm') || req.path.startsWith('/change_password'))) {
    return next();
  }
  csrfProtection(req, res, next);
});

// Разрешаем CORS для фронтенда
app.use(cors({
  origin: 'http://localhost:5173', // адрес React-приложения
  credentials: true
}));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  
// passport.use(new RememberMeStrategy(
//     function(token, done) {
//         //var _token = new Token();
//         console.log(token);
//         if (mainconnection.readyState == 1) {   
//             Token.findOneAndRemove({value:token},{useFindAndModify: false})
//             .populate('user')
//             .exec(function (err, doc){         
//                 if (err) return done(err); 
//                 if (!doc) return done(null, false);
//                 console.log('Remember me strategy');
//                 console.log(doc);
//                 return done(null, doc.user);  
//             });            
//         }
//         else{
//             console.log('error connection to mongo server!');
//             console.log(err); 
//             return done(null, false);
//         }
//      },
//     function(user, done) {
//         var value = utils.generateToken(64); 
//         var token = new Token({
//             user: user.id,
//             value: value
//         });
        
//         token.save(function(err) {
//             if (err) return done(err);
//             return done(null, value);
//         });
//     }
//   ));
   

 passport.use(new LocalStrategy({
     usernameField: 'email',
     passwordField: 'password'
   },
    function(username, password, done) {
        console.log(username +" "+ password);
        console.log('db connection state - ' + mainconnection.readyState);
        if (mainconnection.readyState == 1) {
            AccountData.findOne({email: username}, function (err, user) {
                console.log(user);
                if (err) { return done(err); }
                // Перевірка наявності користувача
                // if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
                if (!user) { return done(null, false, { message: 'Невірне ім\'я користувача.' }); }
                // Перевірка користувача на завершення реєстрації
                //if (!user.confirmed){ return done(null,false, { message: 'User did not confirm registration. Please check your email box!'});}
                if (!user.confirmed){ return done(null,false, { message: 'Обліковий запис ще не підтверджено. Будь ласка, зверніться до адміністратора: registration@ics-market.com.ua!'});}
                // Перевірка блокування користувача
                if (user.disabled){ return done(null,false, { message: 'Доступ заборонено!'}); }
                // Якщо користувач не адміністратор
                if (!user.isAdmin){
                    // Перевіряємо дату обмеження доступу
                    var today = new Date().toISOString().split('T')[0];
                    var expireDate = user.expireDate.toISOString().split('T')[0];
                    if (moment(today).isAfter(expireDate)){
                        return done(null,false, { message: 'Термін дії доступу облікового запису до сервісів сайту минув!'}); 
                    }
                }    
                // Перевірка пароля
                // if (!verifyPassword(password,user.hash)) { return done(null, false, { message: 'Incorrect password.' }); }
                if (!verifyPassword(password,user.hash)) { return done(null, false, { message: 'Невірний пароль.' }); }
                console.log('before done');
                return done(null, user);
            });            

        }
        else{
            console.log('error connection to mongo server!');
            // return done(null, false, { message: 'Server connection error!' });
            return done(null, false, { message: 'Помилка підключення до сервера!' });
        }
     }
  ));

 passport.use(new GoogleStrategy({
    clientID:     gf.GOOGLE_CLIENT_ID,
    clientSecret: gf.GOOGLE_CLIENT_SECRET,
    callbackURL:  gf.GOOGLE_CALBACK_URL,
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // if (profile._json.domain !== 'example.com') {
    //     done(new Error("Wrong domain!"));
    // } else {
    console.log(profile);

    // }

    // User.findOrCreate({email: profile._json.email }, function (err, user) {
    //   return done(err, user);
    // });
    const GoogleProfile = require('./schemas/google_profile');
    GoogleProfile.updateOne({email: profile._json.email},{$set:{subject: profile._json.sub,
                                                                name: profile._json.name,
                                                                given_name: profile._json.given_name,
                                                                family_name: profile._json.family_name,
                                                                picture: profile._json.picture,
                                                                email_verified: profile._json.email_verified,
                                                                locale: profile._json.locale}},{upsert:true},(err,doc) =>{
            
        if(err){
            console.log(err);
            return done(err);  
        }
       
    });

    done(null, profile);

  }
));

app.use(passport.initialize());
app.use(passport.session());
//app.use(passport.authenticate('remember-me',{failureRedirect:'/sign-in'}));
    
// // error handler
// app.use((err, req, res, next)=> {
//     if (err.code == 'EBADCSRFTOKEN') return next(err)
//     // handle CSRF token errors here
//     res.status(403)
//     res.send('form tampered with')
//   })
//   app.use (( req , res , next ) => {
//     res.cookie ( 'csrf-token' , req.csrfToken ())
//     next ()
//  });

//   app.use((err, req, res, next) => { 
//       console.log('1- '+res.coockie)
//       console.log('enter to middleware 1'+err); 
//       //res.locals.csrftoken = req.csrfToken();
//    return next();
//     //   res.locals._csrf = req.csrfToken(); 
//     //   return next();     
//  }); 
// створюємо сховище сесій з використанням Redis
// app.use(session({
//     store: new RedisStore({
//        url: config.redisStore.url 
//     }),
//     secret: config.redisStore.secret,
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.use ((req, res, next) => { 
//     req.db = mongoClient.db('snmp_main_db'); 
//     next (); 
// });

const { check, validationResult, body } = require('express-validator'); // Підключаємо модуль express-validator для валідації даних, що надходять у запитах.
const { ISO_8601 } = require('moment');
const { request } = require('gaxios');
const { stringify } = require('querystring');
const { ListCollectionsCursor } = require('mongodb');

app.get('/', function(req,res){
//res.render('main',{page:'Home', menuId:'home'}); 
if (req.isAuthenticated())
    return res.redirect('/search');            
else
    return res.redirect('/sign-in');
});
    


// Эндпоинт для получения CSRF-токена
/**
 * @openapi
 * /csrf-token:
 *  get:
 *    summary: Получение CSRF-токена
 *    description: Возвращает CSRF-токен для защиты от CSRF-атак.
 *    tags:
 *      - Security
 *    responses:
 *      200:
 *        description: Успешно возвращен CSRF-токен.
 *    content:
 *      application/json:
 *      schema:
 *        type: object
 *        properties:
 *          csrfToken:
 *            type: string 
 */

app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken()});
});


/**
 * @openapi
 * /sign-in:
 *   get:
 *     summary: Отображение страницы входа
 *     description: Возвращает страницу авторизации пользователя.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Страница входа успешно отдана.
 */
app.get('/sign-in',function(req,res){
    return res.render('sign-in',{page:'Home', menuId:'home'});
});

// -------- Альтернативний вхід через Google вимкнений 19/02/21 --------
// app.get('/authenticate', passport.authenticate('google', { scope: gf.defaultScope }
// ));
// --------------------------------------------------------------------

app.get('/validateWithGoogle',  passport.authenticate( 'google', { 
    successRedirect: '/search',
    failureRedirect: '/sign-in'
}));

// app.get('/authenticate', function(req, res, next) {
//     gf.getGoogleAuthenticationUrl().then(function (response) {
//        return res.redirect(response.url);
//     });
// });

// app.get('/validateWithGoogle',async function(req, res, next) {
//     (user));let s = await gf.getGoogleAccountFromCode(req.query.code);
//     let user = new User ({        
//         username: s.names[0].givenName,
//         email: s.emailAddresses[0].value,
//        // photos: s.photos[0].url,        
//     });
//     //res.json(obj);
//     req.user = user;//write(JSON.stringify
//     return res.render('search',{page:'Home', menuId:'home', user:req.user});

//     // return res.redirect('/search');
// });

app.get('/privacy', function(req,res){

    return res.render('privacy',{page:'Home', menuId:'home'});

});
    
app.get('/search', function(req,res){
    
    console.log(req.session)
    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else 
    /*if(req.session.passport.user)*/
    {
        let userData = req.session.passport.user;
        let data;
        if (userData.provider==='google'){
            data = {provider:       userData.provider,
                    username:       userData.displayName,            
                    email:          userData.email,
                    picture:        userData.picture,
                    verified:       userData.verified,
                    email_verified: userData.email_verified,
                    language:       userData.language}

        } else {
            data = {username:       userData.username,            
                    email:          userData.email,
                    confirmed:      userData.confirmed,
                    remember_me:    userData.remember_me,
                    regdate:        userData.regdate,
                    expireDate:     userData.expireDate,
                    isAdmin:        userData.isAdmin}
        }
        return res.render('search',{page:'Home', menuId:'home', user_profile:data, serial:req.session.serial});            
   }
//    else
//          return res.render('search',{page:'Home', menuId:'home', user:req.user});
});

app.post('/search', urlencodedParser,function (req, res) {

    console.log(req.body.serial);
    req.session.serial = req.body.serial;
    if (mainconnection.readyState === 1){
        // FiscData.findOne({EcrXSerialNum: req.body.serial}, function (err, doc) {
        //     if (err) { 
        //         console.log(err);  
        //         // return res.render('error',{message: 'Unable connect to database!', error:err});
        //         return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
        //     };

        //     if (!doc) { 
        //         // req.flash('error','Fiscal printer SN:'+req.body.serial+' not found.');     
        //         req.flash('error','Фіскальний реєстратор SN:'+req.body.serial+' не знайдений.');             
        //     }            
        //     req.session.fdata=doc;
        // });                       

        switch (req.body.choosedIndex){
            case '#1':
                return res.redirect('/ksefdbview?serial='+req.session.serial);
            case '#2':
                return res.redirect('/ksef_archive?serial='+req.session.serial);
            case '#3':
                return res.redirect('/modemdata?serial='+req.session.serial);                          
            case '#4':
                return res.redirect('/editdata?serial='+req.session.serial); 
            
            default:
                return res.redirect('/search');
        }

        // let userData = req.session.passport.user;
        // let data;
        // if (userData.provider==='google'){
        //     data = {provider:       userData.provider,
        //             username:       userData.displayName,            
        //             email:          userData.email,
        //             picture:        userData.picture,
        //             verified:       userData.verified,
        //             email_verified: userData.email_verified,
        //             language:       userData.language}

        // } else {
        //     data = {username:       userData.username,            
        //             email:          userData.email,
        //             confirmed:      userData.confirmed,
        //             remember_me:    userData.remember_me,
        //             regdate:        userData.regdate,
        //             expireDate:     userData.expireDate,
        //             isAdmin:        userData.isAdmin}
        // }

        // return res.render('ksefdbview',{page:'Home', menuId:'home', user_profile:data, serial:req.query.serial, moment:moment});


    //     ModemData.findOne({EcrECRManufNum: req.body.serial}, function (err, doc) {
    //         if (err) { 
    //             console.log(err);  
    //             // return res.render('error',{message: 'Unable connect to database!', error:err});
    //             return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
    //         };

    //         if (!doc) { 
    //             delete req.session.flash;
    //             // req.flash('error','Fiscal printer SN:'+req.body.serial+' not found.');   
    //             req.flash('error','Фіскальний реєстратор SN:'+req.body.serial+' не знайдений.');                 
    //             return res.redirect('/search');
    //             //return res.render('search',{page:'Home', menuId:'home', user:req.user});                
    //         }
    //         req.session.mdata=doc;
    //         console.log('Before redirecting to modemdata');
    //         return res.redirect('/modemdata');
    //         //return res.render('modemdata',{page:'Home', menuId:'home', user:req.user, mdata:req.session.mdata, moment:moment});
    //     }); 
    }
    else{
        console.log('error connection to mongo server!');
        // return res.render('error',{message: 'Server connection error!'});
        return res.render('error',{message: 'Помилка підключення до сервера!'});
    }
});


// app.get('/fiscdata', function(req,res){
//     if(!req.user){
//         // req.flash('error', 'Session timed out. Authentication required.');
//         req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
//         return res.redirect('/');
//     }
//     else {    
//         // Перевірка на наявність даних
//         if (!req.session.fdata){
//             // req.flash('error', 'No data. Please, enter ECR serial number.');
//             req.flash('error', 'Немає даних. Введіть серійний номер РРО.');
//             return res.redirect('/search');
//         }

//         let userData = req.session.passport.user;
//         let data;
//         if (userData.provider==='google'){
//             data = {provider:       userData.provider,
//                     username:       userData.displayName,            
//                     email:          userData.email,
//                     picture:        userData.picture,
//                     verified:       userData.verified,
//                     email_verified: userData.email_verified,
//                     language:       userData.language}

//         } else {
//             data = {username:       userData.username,            
//                     email:          userData.email,
//                     confirmed:      userData.confirmed,
//                     remember_me:    userData.remember_me,
//                     regdate:        userData.regdate,
//                     expireDate:     userData.expireDate,
//                     isAdmin:        userData.isAdmin}
//         }
                  
//         return res.render('fiscdata',{page:'Home', menuId:'home', user_profile:data, fdata:req.session.fdata, moment:moment});
//     }
// });

app.get('/ksef_upload', urlencodedParser, function(req,res){
        
    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else {    

        let userData = req.session.passport.user;
        
        let data;
        if (userData.provider==='google'){
            data = {provider:       userData.provider,
                    username:       userData.displayName,            
                    email:          userData.email,
                    picture:        userData.picture,
                    verified:       userData.verified,
                    email_verified: userData.email_verified,
                    language:       userData.language}

        } else {
            data = {username:       userData.username,            
                    email:          userData.email,
                    category:       userData.category, 
                    confirmed:      userData.confirmed,
                    remember_me:    userData.remember_me,
                    regdate:        userData.regdate,
                    expireDate:     userData.expireDate,
                    isAdmin:        userData.isAdmin}
        }
        return res.render('ksef_uploader',{page:'Home', menuId:'home', serial:req.session.serial, user_profile:data});
    }
});

app.get('/ksefdbview', function(req,res){

    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else{     
        // Перевірка на наявність даних
        if (!req.session.serial){
            // req.flash('error', 'No data. Please, enter ECR serial number.');
            req.flash('error', 'Немає даних. Введіть серійний номер РРО.');
            return res.redirect('/search');
        }

        let userData = req.session.passport.user;
        let data;
        if (userData.provider==='google'){
            data = {provider:       userData.provider,
                    username:       userData.displayName,            
                    email:          userData.email,
                    picture:        userData.picture,
                    verified:       userData.verified,
                    email_verified: userData.email_verified,
                    language:       userData.language}

        } else {
            data = {username:       userData.username,            
                    email:          userData.email,
                    confirmed:      userData.confirmed,
                    remember_me:    userData.remember_me,
                    regdate:        userData.regdate,
                    expireDate:     userData.expireDate,
                    isAdmin:        userData.isAdmin}
        }

        return res.render('ksefdbview',{page:'Home', menuId:'home', user_profile:data, serial:req.session.serial, moment:moment});
    }
});

app.post('/ksefDBrequest', urlencodedParser, function(req,res){

    var ksefdbconnection = mongoose.createConnection(KSEFServerConnectionString,{
        tls: false,
        //key:  fs.readFileSync('/etc/ssl/ksef.pem'),
        // cert: fs.readFileSync('/etc/ssl/ksef.crt'),
        // ca:   fs.readFileSync('/etc/ssl/ksef-ca.crt'),
        // useUnifiedTopology: true,
        // useNewUrlParser: true,
        // // ssl: false,
        // ssl: true,
        // sslValidate: true,
        // sslKey:  '/etc/ssl/ksef.pem',
        // sslCert: '/etc/ssl/ksef.crt',
        // sslCA:   '/etc/ssl/ksef-ca.crt',
    });

    var result;

    ksefdbconnection.once('open',function () {
        console.log('Mongoose connection open to KSEF DB');      
    });

    ksefdbconnection.on('open', () => {
        console.log('KSEF DB Connected!');

        var collectionName = 'dev_4' + req.body.serial.slice(2);

        ksefdbconnection.db.listCollections({name:collectionName}).next((err, collInfo)=>{

            if (err){
                result={error:{message: 'Помилка: ' + err}};  
                ksefdbconnection.close();
                console.log(err);                       
                return res.json(result);           
            }

            if (collInfo){
               
                //const FiscDocument = ksefdbconnection.model('FiscDoc', require('./models/fiscdoc'),'CTEFDataCollection');
                const FiscDocument = ksefdbconnection.model('FiscDoc', require('./schemas/fiscdoc'),collectionName);

                var request = undefined;
                switch (req.body.findMode){
        
                    case 0: 
                        switch (req.body.dataType){
        
                            case 0:
                                // request = {'HEADER.SerialNumber': req.body.serial, $and:[{'DATA.ZReportObject.ReportDT': {$gte:req.body.firstDateTime}},
                                //                                                          {'DATA.ZReportObject.ReportDT': {$lte:req.body.lastDateTime}},
                                //                                                          {'HEADER.IsDayReport':true}]};
        
                                request = {$and:[{'DATA.ZReportObject.ReportDT': {$gte:req.body.firstDateTime}},
                                                                                        {'DATA.ZReportObject.ReportDT': {$lte:req.body.lastDateTime}},
                                                                                        {'HEADER.IsDayReport':true}]};
                                                                                                 
                                break;
        
                            case 1:
                                // request = {'HEADER.SerialNumber': req.body.serial, $and:[{'DATA.BeginObject.ReceiptDT': {$gte:req.body.firstDateTime}},
                                //                                                          {'DATA.BeginObject.ReceiptDT': {$lte:req.body.lastDateTime}},
                                //                                                          {'HEADER.IsDayReport':false}]};
        
                                request = {$and:[{'DATA.BeginObject.ReceiptDT': {$gte:req.body.firstDateTime}},
                                                                                        {'DATA.BeginObject.ReceiptDT': {$lte:req.body.lastDateTime}},
                                                                                        {'HEADER.IsDayReport':false}]};
                 
                                break;
                                
                            default:
        
                                // request = {'HEADER.SerialNumber': req.body.serial, $or:[{$and:[{'DATA.ZReportObject.ReportDT': {$gte:req.body.firstDateTime}},
                                //                                                                {'DATA.ZReportObject.ReportDT': {$lte:req.body.lastDateTime}}]},
                                //                                                         {$and:[{'DATA.BeginObject.ReceiptDT': {$gte:req.body.firstDateTime}},
                                //                                                                {'DATA.BeginObject.ReceiptDT': {$lte:req.body.lastDateTime}}]}]};  
        
                                request = {$or:[{$and:[{'DATA.ZReportObject.ReportDT': {$gte:req.body.firstDateTime}},
                                                                                        {'DATA.ZReportObject.ReportDT': {$lte:req.body.lastDateTime}}]},
                                                                                        {$and:[{'DATA.BeginObject.ReceiptDT': {$gte:req.body.firstDateTime}},
                                                                                        {'DATA.BeginObject.ReceiptDT': {$lte:req.body.lastDateTime}}]}]};  
        
                        }
        
                        break;
        
                    case 1: 
                    
                        switch (req.body.dataType){
        
                            case 0:
                                // request = {'HEADER.SerialNumber': req.body.serial, $and:[{'HEADER.PacketID': {$gte:req.body.firstPacketID}},
                                //                                                          {'HEADER.PacketID': {$lte:req.body.lastPacketID}},
                                //                                                          {'HEADER.IsDayReport':true}]};
                                request = {$and:[{'_id':{$gte: mongoose.Types.Long(parseInt(req.body.firstPacketID))}},
                                                                    {'_id': {$lte: mongoose.Types.Long(parseInt(req.body.lastPacketID))}},
                                                                    {'HEADER.IsDayReport':true}]};                    
                                break;
        
                            case 1:
                                // request = {'HEADER.SerialNumber': req.body.serial, $and:[{'HEADER.PacketID': {$gte:req.body.firstPacketID}},
                                //                                                          {'HEADER.PacketID': {$lte:req.body.lastPacketID}},
                                //                                                          {'HEADER.IsDayReport':false}]};
                                request = {$and:[{'_id': {$gte: mongoose.Types.Long(parseInt(req.body.firstPacketID))}},
                                                                    {'_id': {$lte: mongoose.Types.Long(parseInt(req.body.lastPacketID))}},
                                                                    {'HEADER.IsDayReport':false}]};
                                break;
                        
                            default:
                                // request = {'HEADER.SerialNumber': req.body.serial, $and:[{'HEADER.PacketID': {$gte:req.body.firstPacketID}},
                                //                                                          {'HEADER.PacketID': {$lte:req.body.lastPacketID}}]};  
                                request = {$and:[{'_id': {$gte: mongoose.Types.Long(parseInt(req.body.firstPacketID))}},
                                                                    {'_id': {$lte: mongoose.Types.Long(parseInt(req.body.lastPacketID))}}]};  
        
                        }
            
                        break;
        
                }
        
                //FiscDocument.find({'HEADER.ID_DEV': 480040012, 'HEADER.IsDayReport': true}, function (err, doc) {
                //FiscDocument.find({'HEADER.ID_DEV': 480040012, 'HEADER.PacketID': 77}, funct(ion (err, doc) {                
                //let firstDate = req.body.firstDateTime;
                //let lastDate = req.body.lastDateTime;
                FiscDocument.find(request, function (err, doc) {                                
                    if (err) { 
                        console.log(err);  
                        result={error:{message: 'Помилка: ' + err}};                
                        // return res.render('error',{message: 'Unable connect to database!', error:err});
                        // return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
                    }
                    else
                    if (!doc | doc.length==0) { 
                        delete req.session.flash;
                        // req.flash('error','Fiscal printer SN:'+req.body.serial+' not found.');   
                        //req.flash('error','Дані у БД  не знайдені.');   
                        result={error:{message: 'Дані не знайдені.'}};
                    }
                    else{
        
                        console.log('doc count:'+doc.length);
                        // req.session.mdata=doc;
                        result = doc;
                    };
        
                    ksefdbconnection.close();
                    
                    console.log(result);
                    return res.json(result);
                }).lean();        
            } 
            else{
                // Колекції не існує.
    
                // req.flash('error','Fiscal printer SN:'+req.body.serial+' not found.');   
                //req.flash('error','Дані у БД  не знайдені.'); 
                result={error:{message: 'У системі відсутні дані по цьому РРО.'}};  
                //result={error:{message: 'БД порожня.'}};
                ksefdbconnection.close();                    
                return res.json(result);
            }
        })            
    });
                   
    ksefdbconnection.on('error', function (err) {
        console.log('error connection to KSEF DB!');
        console.log(err); 
        return res.json({error:{message: err}});
    });    
});

app.get('/ksef_archive', function(req,res){

    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else{     
        // Перевірка на наявність даних
        if (!req.session.serial){
            // req.flash('error', 'No data. Please, enter ECR serial number.');
            req.flash('error', 'Немає даних. Введіть серійний номер РРО.');
            return res.redirect('/search');
        }

        let userData = req.session.passport.user;
        let data;
        if (userData.provider==='google'){
            data = {provider:       userData.provider,
                    username:       userData.displayName,            
                    email:          userData.email,
                    picture:        userData.picture,
                    verified:       userData.verified,
                    email_verified: userData.email_verified,
                    language:       userData.language}

        } else {
            data = {username:       userData.username,            
                    email:          userData.email,
                    confirmed:      userData.confirmed,
                    remember_me:    userData.remember_me,
                    regdate:        userData.regdate,
                    expireDate:     userData.expireDate,
                    isAdmin:        userData.isAdmin}
        }

        return res.render('ksef_archive',{page:'Home', menuId:'home', user_profile:data, serial:req.session.serial, moment:moment});
    }
});

app.post('/ksefArchiveRequest', urlencodedParser, function(req,res){

    var ksefdbconnection = mongoose.createConnection(KSEFServerConnectionString,{
        tls: false,
        // key:  fs.readFileSync('/etc/ssl/ksef.pem'),
        // cert: fs.readFileSync('/etc/ssl/ksef.crt'),
        // ca:   fs.readFileSync('/etc/ssl/ksef-ca.crt'),
        // useUnifiedTopology: true,
        // useNewUrlParser: true,
        // // ssl: false,
        // ssl: true,
        // sslValidate: true,
        // sslKey:  '/etc/ssl/ksef.pem',
        // sslCert: '/etc/ssl/ksef.crt',
        // sslCA:   '/etc/ssl/ksef-ca.crt',
    });

    var result;

    ksefdbconnection.once('open',function () {
        console.log('Mongoose connection open to KSEF DB');      
    });

    ksefdbconnection.on('open', () => {
        console.log('KSEF DB Connected!');

        var collectionName = 'arch_4' + req.body.serial.slice(2);
        ksefdbconnection.db.listCollections({name:collectionName}).next((err, collInfo)=>{

            if (err){
                result={error:{message: 'Помилка: ' + err}};  
                ksefdbconnection.close();
                console.log(err);                       
                return res.json(result);           
            }

            if (collInfo){
                // const FiscDocument = ksefdbconnection.model('FiscDoc', require('./models/fiscdoc'),'CTEFArchiveDataCollection');
                const FiscDocument = ksefdbconnection.model('FiscDoc', require('./schemas/fiscdoc'),collectionName);
                
                var request = undefined;
                switch (req.body.findMode){
        
                    case 0: 
                        switch (req.body.dataType){
        
                            case 0:
                                // request = {'HEADER.SerialNumber': req.body.serial, $and:[{'DATA.ZReportObject.ReportDT': {$gte:req.body.firstDateTime}},
                                //                                                          {'DATA.ZReportObject.ReportDT': {$lte:req.body.lastDateTime}},
                                //                                                          {'HEADER.IsDayReport':true}]};
        
                                request = {$and:[{'DATA.ZReportObject.ReportDT': {$gte:req.body.firstDateTime}},
                                                                                        {'DATA.ZReportObject.ReportDT': {$lte:req.body.lastDateTime}},
                                                                                        {'HEADER.IsDayReport':true}]};
        
                                break;
        
                            case 1:
                                // request = {'HEADER.SerialNumber': req.body.serial, $and:[{'DATA.BeginObject.ReceiptDT': {$gte:req.body.firstDateTime}},
                                //                                                          {'DATA.BeginObject.ReceiptDT': {$lte:req.body.lastDateTime}},
                                //                                                          {'HEADER.IsDayReport':false}]};
        
                                request = {$and:[{'DATA.BeginObject.ReceiptDT': {$gte:req.body.firstDateTime}},
                                                                                        {'DATA.BeginObject.ReceiptDT': {$lte:req.body.lastDateTime}},
                                                                                        {'HEADER.IsDayReport':false}]};
        
                                break;
                                
                            default:
                                // request = {'HEADER.SerialNumber': req.body.serial, $or:[{$and:[{'DATA.ZReportObject.ReportDT': {$gte:req.body.firstDateTime}},
                                //                                                                {'DATA.ZReportObject.ReportDT': {$lte:req.body.lastDateTime}}]},
                                //                                                         {$and:[{'DATA.BeginObject.ReceiptDT': {$gte:req.body.firstDateTime}},
                                //                                                                {'DATA.BeginObject.ReceiptDT': {$lte:req.body.lastDateTime}}]}]};  
        
                                request = {$or:[{$and:[{'DATA.ZReportObject.ReportDT': {$gte:req.body.firstDateTime}},
                                                                                        {'DATA.ZReportObject.ReportDT': {$lte:req.body.lastDateTime}}]},
                                                                                        {$and:[{'DATA.BeginObject.ReceiptDT': {$gte:req.body.firstDateTime}},
                                                                                        {'DATA.BeginObject.ReceiptDT': {$lte:req.body.lastDateTime}}]}]};  
        
                            }
        
                        break;
        
                    case 1: 
                    
                        switch (req.body.dataType){
        
                            case 0:
                                // request = {'HEADER.SerialNumber': req.body.serial, $and:[{'HEADER.PacketID': {$gte:req.body.firstPacketID}},
                                //                                                          {'HEADER.PacketID': {$lte:req.body.lastPacketID}},
                                //                                                          {'HEADER.IsDayReport':true}]};
        
                                request = {$and:[{'HEADER.PacketID':{$gte: mongoose.Types.Long(parseInt(req.body.firstPacketID))}},
                                                                    {'HEADER.PacketID': {$lte: mongoose.Types.Long(parseInt(req.body.lastPacketID))}},
                                                                    {'HEADER.IsDayReport':true}]};                    
                                break;
        
                            case 1:
                                // request = {'HEADER.SerialNumber': req.body.serial, $and:[{'HEADER.PacketID': {$gte:req.body.firstPacketID}},
                                //                                                          {'HEADER.PacketID': {$lte:req.body.lastPacketID}},
                                //                                                          {'HEADER.IsDayReport':false}]};
                                request = {$and:[{'HEADER.PacketID': {$gte: mongoose.Types.Long(parseInt(req.body.firstPacketID))}},
                                                                    {'HEADER.PacketID': {$lte: mongoose.Types.Long(parseInt(req.body.lastPacketID))}},
                                                                    {'HEADER.IsDayReport':false}]};
                                break;
                        
                            default:
                                // request = {'HEADER.SerialNumber': req.body.serial, $and:[{'HEADER.PacketID': {$gte:req.body.firstPacketID}},
                                //                                                          {'HEADER.PacketID': {$lte:req.body.lastPacketID}}]};  
                                request = {$and:[{'HEADER.PacketID': {$gte: mongoose.Types.Long(parseInt(req.body.firstPacketID))}},
                                                                    {'HEADER.PacketID': {$lte: mongoose.Types.Long(parseInt(req.body.lastPacketID))}}]};  
        
                        }
            
                        break;
        
                }
        
                //FiscDocument.find({'HEADER.ID_DEV': 480040012, 'HEADER.IsDayReport': true}, function (err, doc) {
                //FiscDocument.find({'HEADER.ID_DEV': 480040012, 'HEADER.PacketID': 77}, funct(ion (err, doc) {                
                //let firstDate = req.body.firstDateTime;
                //let lastDate = req.body.lastDateTime;
                FiscDocument.find(request, function (err, doc) {                                
                    if (err) { 
                        console.log(err);  
                        result={error:{message: 'Помилка: ' + err}};                
                        // return res.render('error',{message: 'Unable connect to database!', error:err});
                        // return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
                    }
                    else
                    if (!doc | doc.length==0) { 
                        delete req.session.flash;
                        // req.flash('error','Fiscal printer SN:'+req.body.serial+' not found.');   
                        //req.flash('error','Дані у БД  не знайдені.');   
                        result={error:{message: 'Дані не знайдені.'}};
                    }
                    else{
        
                        console.log('doc count:'+doc.length);
                        // req.session.mdata=doc;
                        result = doc;
                    };
        
                    ksefdbconnection.close();
                    
                    console.log(result);
                    return res.json(result);
                }).lean(); 
            }
            else{
                // Колекції не існує.
    
                // req.flash('error','Fiscal printer SN:'+req.body.serial+' not found.');   
                //req.flash('error','Дані у БД  не знайдені.'); 
                result={error:{message: 'У системі відсутні дані по цьому РРО.'}};  
                //result={error:{message: 'БД порожня.'}};
                ksefdbconnection.close();                    
                return res.json(result);
            }
        });         
    });
                   
    ksefdbconnection.on('error', function (err) {
        console.log('error connection to KSEF DB!');
        console.log(err); 
        return res.json({error:{message: err}});
    });    
});

app.get('/admin_panel', function(req,res){
    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else {    
        // Перевірка на наявність прав адміністратора

        let userData = req.session.passport.user;
        let data;
        if (userData.provider==='google'){
            data = {provider:       userData.provider,
                    username:       userData.displayName,            
                    email:          userData.email,
                    picture:        userData.picture,
                    verified:       userData.verified,
                    email_verified: userData.email_verified,
                    language:       userData.language}

        } else {
            data = {username:       userData.username,            
                    email:          userData.email,
                    confirmed:      userData.confirmed,
                    remember_me:    userData.remember_me,
                    regdate:        userData.regdate,
                    expireDate:     userData.expireDate,
                    isAdmin:        userData.isAdmin}
        }

        if (userData.isAdmin) {
            
            if (mainconnection.readyState === 1){
                AccountData.find({}).sort({isAdmin:-1, regdate:1}).exec(function (err, doc) {
                    if (err) { 
                        console.log(err);  
                        // return res.render('error',{message: 'Unable connect to database!', error:err});
                        return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
                    };
        
                    if (!doc) { 
                        // req.flash('error','Fiscal printer SN:'+req.body.serial+' not found.');     
                        req.flash('error','Не знайдено жодного облікового запису.');             
                    } 
                    
                    return res.render('admin_panel',{page:'Home', menuId:'home', user_profile:data, udata:doc, moment:moment, serial:req.session.serial});
                });                  
            
            }
            else{
                console.log('error connection to mongo server!');
                // return res.render('error',{message: 'Server connection error!'});
                return res.render('error',{message: 'Помилка підключення до сервера!'});
            }
        }
        else
        {
            req.flash('error', 'У Вас немає прав адміністратора. Доступ до сторінки адміністрування сайту закрито.');
            return res.redirect('/');
        }
    }
});


app.get('/eeprom_data', function(req,res){
    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else {    
        // Перевірка на наявність прав адміністратора
        let userData = req.session.passport.user;
        let data;
        if (userData.provider==='google'){
            data = {provider:       userData.provider,
                    username:       userData.displayName,            
                    email:          userData.email,
                    picture:        userData.picture,
                    verified:       userData.verified,
                    email_verified: userData.email_verified,
                    language:       userData.language}

        } else {
            data = {username:       userData.username,            
                    email:          userData.email,
                    confirmed:      userData.confirmed,
                    remember_me:    userData.remember_me,
                    regdate:        userData.regdate,
                    expireDate:     userData.expireDate,
                    isAdmin:        userData.isAdmin}
        }

        if (userData.isAdmin) {
            
            var firmwaredbconnection = mongoose.createConnection(FirmwareDBConnectionString,{
                tls: false,
                // key:  fs.readFileSync('/etc/ssl/mongodb.pem'),
                // cert: fs.readFileSync('/etc/ssl/mongodb.crt'),
                // ca:   fs.readFileSync('/etc/ssl/mongodb-ca.crt'),
                // useUnifiedTopology: true,
                // useNewUrlParser: true,
                // // ssl: false,
                // ssl: true,
                // sslValidate: true,
                // sslKey:  '/etc/ssl/mongodb.pem',
                // sslCert: '/etc/ssl/mongodb.crt',
                // sslCA:   '/etc/ssl/mongodb-ca.crt',
            });

            firmwaredbconnection.once('open', () => {
                console.log('Mongoose connection open to firmware DB');      
            });

            firmwaredbconnection.on('open', () => {
                console.log('Firmware DB Connected!');
               
                const FirmwareData = firmwaredbconnection.model('FirmwareData', require('./schemas/firmware_db/firmware_data'),'FirmwareDataCollection');
                
                FirmwareData.find({}).select('-firmware').sort({model:1, version:1, revision:1}).exec(function (err, firmware_docs) {
                    if (err) { 
                        console.log(err);  
                                            
                        firmwaredbconnection.close(() => {
                            console.log('Firmware DB connection closed.');
                        });
                        // return res.render('error',{message: 'Unable connect to database!', error:err});    
                        return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
                    };
        
                    if (!firmware_docs) { 
                        // req.flash('error','Fiscal printer SN:'+req.body.serial+' not found.');     
                        req.flash('error','Не знайдено жодної прошивки РРО.');             
                    } 
                    
                    firmwaredbconnection.close(() => {
                        console.log('Firmware DB connection closed.');
                    });

                    return res.render('eeprom_data',{page:'Home', menuId:'home', user_profile:data, firmware_data:firmware_docs, moment:moment, serial:req.session.serial});
                });                  
            
            });
        }
        else
        {
            req.flash('error', 'У Вас немає прав адміністратора. Доступ до розділу сайта \'База прошивок\' заборонений.');
            return res.redirect('/');
        }
    }
});

app.get('/rro_flasher', function(req,res){
    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else {    
        // Перевірка на наявність прав адміністратора
        let userData = req.session.passport.user;
        let data;
        if (userData.provider==='google'){
            data = {provider:       userData.provider,
                    username:       userData.displayName,            
                    email:          userData.email,
                    picture:        userData.picture,
                    verified:       userData.verified,
                    email_verified: userData.email_verified,
                    language:       userData.language}

        } else {
            data = {username:       userData.username,            
                    email:          userData.email,
                    confirmed:      userData.confirmed,
                    remember_me:    userData.remember_me,
                    regdate:        userData.regdate,
                    expireDate:     userData.expireDate,
                    isAdmin:        userData.isAdmin}
        }

        if (userData.isAdmin) {
            
            var firmwaredbconnection = mongoose.createConnection(FirmwareDBConnectionString,{
                tls: false,
                // key:  fs.readFileSync('/etc/ssl/mongodb.pem'),
                // cert: fs.readFileSync('/etc/ssl/mongodb.crt'),
                // ca:   fs.readFileSync('/etc/ssl/mongodb-ca.crt'),
                // useUnifiedTopology: true,
                // useNewUrlParser: true,
                // // ssl: false,
                // ssl: true,
                // sslValidate: true,
                // sslKey:  '/etc/ssl/mongodb.pem',
                // sslCert: '/etc/ssl/mongodb.crt',
                // sslCA:   '/etc/ssl/mongodb-ca.crt',
            });

            firmwaredbconnection.once('open', () => {
                console.log('Mongoose connection open to firmware DB');      
            });

            firmwaredbconnection.on('open', () => {
                console.log('Firmware DB Connected!');
               
                const RROFirmwareReader = firmwaredbconnection.model('RROFirmwareReader', require('./schemas/firmware_db/rro_firmware_reader'),'RROFirmwareUpdateCollection');
                
                RROFirmwareReader.find({}).sort({model:1, client:1, serial:1}).exec(function (err, rro_docs) {
                    if (err) { 
                        console.log(err);
                        
                        firmwaredbconnection.close(() => {
                            console.log('Firmware DB connection closed.');
                        });
                        // return res.render('error',{message: 'Unable connect to database!', error:err});
                        return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
                    };
        
                    if (!rro_docs) { 
                        // req.flash('error','Fiscal printer SN:'+req.body.serial+' not found.');     
                        req.flash('error','Не знайдено жодного РРО в списку для перепрошивки.');             
                    }        
                                        
                    const FirmwareData = firmwaredbconnection.model('FirmwareData', require('./schemas/firmware_db/firmware_data'),'FirmwareDataCollection');
                
                    FirmwareData.find({}).select('-firmware').sort({model:1, version:1, revision:1}).exec(function (err, firmware_docs) {
                        if (err) { 
                            console.log(err);  
                                            
                            firmwaredbconnection.close(() => {
                                console.log('Firmware DB connection closed.');
                            });
                            // return res.render('error',{message: 'Unable connect to database!', error:err});    
                            return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
                        };
        
                        if (!firmware_docs) { 
                            // req.flash('error','Fiscal printer SN:'+req.body.serial+' not found.');     
                            req.flash('error','Не знайдено жодної прошивки РРО.');             
                        } 

                        firmwaredbconnection.close(() => {
                            console.log('Firmware DB connection closed.');
                        });

                        return res.render('rro_flasher',{page:'Home', menuId:'home', user_profile:data, rro_data: rro_docs, firmware_data: firmware_docs, moment:moment, serial:req.session.serial});
                    });
                });                  
            
            });
        }
        else
        {
            req.flash('error', 'У Вас немає прав адміністратора. Доступ до розділу сайта \'База прошивок\' заборонений.');
            return res.redirect('/');
        }
    }
});

  
/**
 * @openapi
 * /register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Создает новую учетную запись пользователя.
 *   tags:
 *     - Authentication
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: Имя пользователя
 *             email:
 *               type: string
 *               description: Электронная почта пользователя
 *             password:
 *               type: string
 *               description: Пароль пользователя
 *             confirm_password:
 *               type: string
 *               description: Подтверждение пароля пользователя
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован.
 */
app.post('/register', urlencodedParser,                          
                            check('username')
                                .not().isEmpty()
                                // .isLength({min: 6}).withMessage('Name must have more than 6 characters.'),
                                .isLength({min: 6}).withMessage('Ім\'я має містити понад 6 символів.'),
                            check('email')
                                .isEmail()
                                // .withMessage('That email doesn‘t look right.')
                                .withMessage('Невірний e-mail.')
                                .trim()
                                .normalizeEmail({ gmail_remove_dots : false, 
                                                  gmail_remove_subaddress: false,
                                                  outlookdotcom_remove_subaddress: false,
                                                  icloud_remove_subaddress: false,
                                                  yahoo_remove_subaddress: false }),  
                            // check('password','Please enter a password at least 8 character and contain at least one uppercase, one lower case and one special character.')                                 
                            check('password','Пароль має містити не менше 8-ми символів латиницею, містити одну велику і маленьку літери, цифру та спецсимвол з набору @$_,.—!%*#?& .')
                                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$_,.—!%*#?&\-])[a-zA-Z\d@$_,.—!%*#?&\-]{8,}$/, "i"),
                            // check('confirm_password', 'Passwords do not match.').custom((value, {req}) => (value === req.body.password))  
                            check('confirm_password', 'Паролі не співпадають.').custom((value, {req}) => (value === req.body.password)), 
                            function (request, response) {

//    console.log(request.csrfToken());
    if(!request.body) 
        return response.sendStatus(400);
    
    console.log(request.body);
    // if (!tokens.verify(secret, request.body._csrf)){

    //     // return response.status(403).send('form tampered with.');
    //     return response.status(403).send('Форма була підроблена.');
    // }

    const errors = validationResult(request)
    if (!errors.isEmpty()){         
        const formattedErrors = [];
        errors.array().forEach(({ msg }) => {
            formattedErrors.push({text: msg });
        });   

        console.log(formattedErrors);
        return response.status(400).json({
            success: false,
            message: 'Помилка валідації.',
            errors: formattedErrors
        });
    }
    // return response.render('registration', {
    //       page:'Home', 
    //       menuId:'home',  
    //       data: request.body,
    //       errors: errors.mapped(),
    //       csrfToken:tokens.create(secret)})
    // }

    if (mainconnection.readyState == 1){
       registerNewUser(request,response);
    }
    else{
        console.log('error connection to mongo server!');
        // return response.render('error',{message: 'Server connection error!'});
        return response.sendStatus(500).json({
            success: false,
            message: 'Помилка підключення до сервера!'
        });
    }
   

    // User.username = request.body.username;
    // User.email = request.body.email;
    // var salt = genRandomString(16);
    // var passwordData = sha512(request.body.password, salt);
    // User.hash = passwordData;
});

/**
 * @openapi
 * /confirm/{token}:
 *   get:
 *     summary: Подтверждение электронной почты пользователя
 *     description: Подтверждает адрес электронной почты пользователя с помощью токена.
 *   tags:
 *     - Authentication
 *   parameters:
 *     - name: token
 *       in: path
 *       description: Токен подтверждения электронной почты
 *       required: true
 *       schema:
 *         type: string
 *    
 *   responses:
 *     200:
 *       description: Адрес электронной почты успешно подтвержден.   
 */

app.get('/confirm/:token', urlencodedParser, function (request, response) {
    try{
        //console.log(req.params.token);
        var EMAIL_SECRET = Buffer.from(sha256(tokensecret, tokensalt).passwordHash).toString('base64');
                
        const decoded = jwt.verify(request.params.token, EMAIL_SECRET);
        // console.log(decoded.user);
        var id = decoded.user;
        //console.log('_id = '+id);    
       
        if (mainconnection.readyState == 1){
            confirmNewUser(id, request, response);
        }  
        else{
            console.log('error connection to mongo server!');
            // return res.render('error',{message: 'Server connection error!'});
            return response.sendStatus(500).json({
                success: false,
                message: 'Помилка підключення до сервера!'
            });
        }
     
    } catch (err){
        // return res.render('error',{message: 'E-mail confirmation error!'});
        return response.sendStatus(500).json({
            success: false,
            message: 'Помилка підтвердження e-mail!'
        });
    }    
});
   

app.post('/sign-in', urlencodedParser, passport.authenticate('local', {failureRedirect: '/sign-in', failureFlash: true}),
    function(req, res, next) {        
        console.log('enter to function!');
        // issue a remember me cookie if the option was checked
        if (!req.body.remember_me) { 
            console.log('no check Remember me!');
            return next();
        }
        // res.session = null;
        // res.cookie('super-secret-cookie','',{maxAge:1})
        console.log('db connection state - ' + mainconnection.readyState);
        if (mainconnection.readyState === 1){
 
            var value = utils.generateToken(64);
            var token = new Token({
                user: req.user.id,
                value: value
            });
    
            token.save(function(err) {
                if (err) return next(err);
                console.log('Before save cookie!');
                if(!res.headersSent)
                    res.cookie('remember_me', value, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days

                return next();
            });    
        }
        else{
            console.log('error connection to mongo server!');
            return next();
        }

    },

    function(req,res){    
        
        if (mainconnection.readyState === 1){

            var email = req.session.passport.user.email;
            var localDate = ((new Date).toString() +' UTC').toLocaleString();
            AccountData.updateOne({email:email},{$set:{activityDate:localDate}},{upsert:true},(err,doc) =>{
            
                if(err){
                    console.log(err);  
                    // return res.render('error',{message: 'Unable connect to database!', error:err});
                    return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});                
                }
                if (!doc){
                    console.log('doc - undefined');
                    // Error! Make flash message!
                    //req.flash('error', 'User with the specified e-mail is not registered on this site!');
                    req.flash('error', 'Користувач із зазначеним e-mail не зареєстрований на цьому сайті!');                
                    return res.redirect('/')
                } 
    
            });
        }
    
       return res.redirect('/search');
  
    }
);  
 
/**
 * @openapi
 * /forgot:
 *   post:
 *     summary: Восстановление пароля пользователя
 *     description: Отправляет электронное письмо с инструкциями по восстановлению пароля пользователя.
 *   tags:
 *     - Authentication
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *       schema:
 *         type: object
 *         properties:
 *           email:
 *             type: string
 *             description: Электронная почта пользователя
 *   responses:
 *     200:
 *       description: Электронное письмо с инструкциями по восстановлению пароля успешно отправлено.
 */
app.post('/forgot', urlencodedParser, check('email')
                                                .isEmail()
                                                //.withMessage('That email doesn‘t look right')
                                                .withMessage('Невірний e-mail.')
                                                .trim()
                                                .normalizeEmail({ gmail_remove_dots : false, 
                                                                  gmail_remove_subaddress: false,
                                                                  outlookdotcom_remove_subaddress: false,
                                                                  icloud_remove_subaddress: false,
                                                                  yahoo_remove_subaddress: false }),  
                                                function (request, response) {
    if (mainconnection.readyState == 1){
        forgotPassword(request,response);
    } 
    else{
        console.log('error connection to mongo server!');
        // return res.render('error',{message: 'Server connection error!'});
        return response.status(500).json({
            success: false,
            message: 'Помилка підключення до сервера!'
        });
    }                                                                                                                                              
});

app.post('/change_password/:token', urlencodedParser,                          
                                      // check('password','Please enter a password at least 8 character and contain at least one uppercase, one lower case and one special character.')   
                                       check('newPassword','Пароль має містити не менше 8-ми символів латиницею, містити одну велику і маленьку літери, цифру та спецсимвол з набору @$_,.—!%*#?& .')
                                          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$_,.—!%*#?&\-])[a-zA-Z\d@$_,.—!%*#?&\-]{8,}$/, "i"),
                                      async function (request, response) {
  

    if(!request.body) 
        return response.sendStatus(400);
    
    console.log(request.body);
    // if (!tokens.verify(secret, request.body._csrf)){
    //     // return response.status(403).send('form tampered with');
    //     return response.status(403).send('Форма була підроблена.');
    // }

    const errors = validationResult(request)
    if (!errors.isEmpty()){         
        const formattedErrors = [];
        errors.array().forEach(({ msg }) => {
            formattedErrors.push({text: msg });
        });   

        console.log(formattedErrors);
        return response.status(400).json({
            success: false,
            message: 'Помилка валідації.',
            errors: formattedErrors
        });
    }   

    if (mainconnection.readyState == 1){
        try {
            const result = await verifyToken(request);
            if (result && result.success) {
                if (result.userId) {
                    request.params.userId = result.userId;
                    return changePassword(request, response);
                }
                else {
                    return response.status(400).json({ 
                        success: false, 
                        message: 'Невірний токен або користувач не знайдений.' 
                    });
                }
                
            }
            return response.status(400).json(result);
        } catch (err) {
            console.error(err);
            return response.status(500).json({ success: false, message: 'Помилка сервера: ' + err.message });
        }
    }
    else{
        console.log('error connection to mongo server!');
        // return res.render('error',{message: 'Server connection error!'});
        return response.status(500).json({
            success: false,
            message: 'Помилка підключення до сервера!'
        });
    }

});

app.get('/getServicePassword', urlencodedParser,function (req, res){
    
    var data={servicePassword: servicePassword()};
    console.log(data);
    return res.send(data);
})

app.get('/getConnectionPassword', urlencodedParser,function (req, res){
    
    var data={connectionPassword: connectionPassword()};
    console.log(data);
    return res.send(data);
})

// Функція для оновлення даних прошивок РРО
app.post('/firmwares_data_update', urlencodedParser, function (req, res){

    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }

    var firmwaredbconnection = mongoose.createConnection(FirmwareDBConnectionString,{
        tls: false,
        // key:  fs.readFileSync('/etc/ssl/mongodb.pem'),
        // cert: fs.readFileSync('/etc/ssl/mongodb.crt'),
        // ca:   fs.readFileSync('/etc/ssl/mongodb-ca.crt'),
        // useUnifiedTopology: true,
        // useNewUrlParser: true,
        // // ssl: false,
        // ssl: true,
        // sslValidate: true,
        // sslKey:  '/etc/ssl/mongodb.pem',
        // sslCert: '/etc/ssl/mongodb.crt',
        // sslCA:   '/etc/ssl/mongodb-ca.crt',
    });

    firmwaredbconnection.once('open', () => {
        console.log('Mongoose connection open to firmware DB');      
    });

    
    firmwaredbconnection.on('open', async() => {

        console.log('Firmware DB Connected!');

        const FirmwareData = firmwaredbconnection.model('FirmwareData', require('./schemas/firmware_db/firmware_data'),'FirmwareDataCollection');
        // зміна даних прошивок
        // req.body.updateFirmwaresData - це JSON-рядок з даними списку прошивок для оновлення
        try{
            if (req.body.updateFirmwaresData!=null)
                await  updateFirmwaresData(FirmwareData,req,res);
            
            // видалення даних прошивок
            // req.body.removeFirmwares - це JSON-рядок з даними списку прошивок для видалення
            if (req.body.removeFirmwares!=null)
                await removeFirmwares(FirmwareData,req,res);

            firmwaredbconnection.close(() => {
                console.log('Firmware DB connection closed.');
            });

            req.flash('success', 'Дані прошивок РРО успішно оновлені!');
            return res.redirect('/eeprom_data');
        } catch (err) {

            firmwaredbconnection.close(() => {
                console.log('Firmware DB connection closed.');
            });

            req.flash('error', 'Помилка оновлення даних прошивок РРО: ' + err.message);   
            return res.redirect('/eeprom_data');
        }
    });
});

// Функція оновлення списку РРО для прошивки
app.post('/rro_firmware_update', urlencodedParser, function (req, res){

    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }

    var firmwaredbconnection = mongoose.createConnection(FirmwareDBConnectionString,{
        tls: false,
        // key:  fs.readFileSync('/etc/ssl/mongodb.pem'),
        // cert: fs.readFileSync('/etc/ssl/mongodb.crt'),
        // ca:   fs.readFileSync('/etc/ssl/mongodb-ca.crt'),
        // useUnifiedTopology: true,
        // useNewUrlParser: true,
        // // ssl: false,
        // ssl: true,
        // sslValidate: true,
        // sslKey:  '/etc/ssl/mongodb.pem',
        // sslCert: '/etc/ssl/mongodb.crt',
        // sslCA:   '/etc/ssl/mongodb-ca.crt',
    });

    firmwaredbconnection.once('open', () => {
        console.log('Mongoose connection open to firmware DB');      
    });

    firmwaredbconnection.on('open', async() => {

        console.log('Firmware DB Connected!');

        // Отримання моделі RROFirmwareUpdater з бази даних
        // Модель RROFirmwareUpdater визначена у файлі ./models/firmware_db/rro_firmware_updater.js
        // і використовується для роботи зі списком РРО для перепрошивки
        // Модель підключається до колекції 'RROFirmwareUpdateCollection'
        // у базі даних, яка містить інформацію про РРО, що потребують оновлення прошивки
      
        const RROFirmwareUpdater = firmwaredbconnection.model('RROFirmwareUpdater', require('./schemas/firmware_db/rro_firmware_updater'),'RROFirmwareUpdateCollection');
        // зміна даних РРО у списку для перепрошивки
        // req.body.updateDevicesFirmware - це JSON-рядок з даними списку РРО для оновлення
        try{

            if (req.body.updateDevicesFirmware!=null)
                await  updateDevicesFirmware(RROFirmwareUpdater,req,res);
            
            // видалення РРО зі списку для перепрошивки
            // req.body.removeDevices - це JSON-рядок з даними даними списку РРО для видалення
            if (req.body.removeDevices!=null)
                await removeDevices(RROFirmwareUpdater,req,res);

            firmwaredbconnection.close(() => {
                console.log('Firmware DB connection closed.');
            });

            req.flash('success', 'Дані списку РРО для перепрошивки успішно оновлені!');
            return res.redirect('/rro_flasher');
        } catch (err) {
         
            req.flash('error', 'Помилка оновлення списку РРО для перепрошивки: ' + err.message);   
            return res.redirect('/rro_flasher');
        }
    });
});

app.get('/myaccount', urlencodedParser, function(req,res){
    
    console.log(req.session)
    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else 
    /*if(req.session.passport.user)*/
    {
        let userData = req.session.passport.user;
        let data;
        if (userData.provider==='google'){
            data = {provider:       userData.provider,
                    username:       userData.displayName,            
                    email:          userData.email,
                    picture:        userData.picture,
                    verified:       userData.verified,
                    email_verified: userData.email_verified,
                    language:       userData.language}

        } else {
            data = {username:               userData.username,            
                    email:                  userData.email,
                    category:               userData.category, 
                    confirmed:              userData.confirmed,
                    remember_me:            userData.remember_me,
                    regdate:                userData.regdate,
                    expireDate:             userData.expireDate,
                    companyName:            userData.companyName,
                    servicePswd:            userData.servicePswd,
                    contactPhones:          userData.contactPhones,
                    deviceLimit:            userData.deviceLimit,
                    devicePswd:             userData.devicePswd,
                    rcvAllPacketsMode:      userData.rcvAllPacketsMode,
                    firstPacketSpecialMode: userData.firstPacketSpecialMode,
                    isAdmin:        userData.isAdmin}
        }
        return res.render('myaccount',{page:'Home', menuId:'home', user_profile:data});            
   }
});

app.get('/mysettings', urlencodedParser, function(req,res){
    
    console.log(req.session)
    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else 
    /*if(req.session.passport.user)*/
    {
        let userData = req.session.passport.user;
        let data;
        if (userData.provider==='google'){
            data = {provider:       userData.provider,
                    username:       userData.displayName,            
                    email:          userData.email,
                    picture:        userData.picture,
                    verified:       userData.verified,
                    email_verified: userData.email_verified,
                    language:       userData.language}

        } else {
            data = {username:       userData.username,            
                    email:          userData.email,
                    category:       userData.category, 
                    confirmed:      userData.confirmed,
                    remember_me:    userData.remember_me,
                    regdate:        userData.regdate,
                    companyName:    userData.companyName,
                    expireDate:     userData.expireDate,
                    contactPhones:  userData.contactPhones,
                    isAdmin:        userData.isAdmin}
        }
        console.log(data.contactPhones);
        return res.render('mysettings',{page:'Home', menuId:'home', user_profile:data});            
   }
});

app.get('/logout', urlencodedParser, function(req,res){
    console.log('Enter to logout function');

        if (req.session) {               
            Token.deleteMany({user: req.user._id}).then(function (err){
                if(err) console.error(err);
            });
            res.clearCookie('remember_me');
            req.session.destroy(() => {
                res.clearCookie('retailbox.sid');
            });
            return res.redirect('/sign-in');
        }

    return res.redirect('/sign-in');

});

app.post('/check_passwords', urlencodedParser,                             
                            check('new_pswd','Довжина нового пароля повинна бути не менше 8-ми символів, він повинен містити, як мінімум, одну велику та одну маленьку літери, одну цифру та один спеціальний знак (@$_,.!%*#?&).')
                            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$_,.—!%*#?&\-])[a-zA-Z\d@$_,.—!%*#?&\-]{8,}$/, "i"),                                                       
                            // check('confirm_password', 'Passwords do not match.').custom((value, {req}) => (value === req.body.password))  
                            check('new_pswd', 'Паролі не співпадають.').custom((value, {req}) => (                             
                                value === req.body.cnf_pswd)), function (req, res) {

    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else 
    /*if(req.session.passport.user)*/
    {
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            // Build your resulting errors however you want! String, object, whatever - it works!
            return `${msg}`;
        };

        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {            
            return res.json({error:{message: result.array({onlyFirstError:true}).join(",")}});
        }
      
        var response = undefined;
        let userData = req.session.passport.user;

        if (mainconnection.readyState == 1) {
            AccountData.findOne({email: userData.email}, function (err, user) {
                if (err) { 
                    response = {error:{message: err}}; 
                }
                else
                // Перевірка наявності користувача
                if (!user) { 
                    response = {error:{message: 'Невірне ім\'я користувача.' }};
                }
                else
                if (!verifyPassword(req.body.cur_pswd,user.hash)) { 
                    response = {error:{message: 'Невірний пароль.' }}                
                }
                else
                    response = {verified: 'done'}

                res.json(response);                      
            
            });            
        }   
        else{
            console.log('error connection to mongo server!');
            res.json({error:{message: 'Помилка підключення до сервера!' }});
        }
    }
});

app.post('/save_new_password', urlencodedParser, function(req,res){

    if (mainconnection.readyState == 1) {
        let userData =  req.session.passport.user;
        var salt = genRandomString(16);
        var passwordData = sha512(req.body.new_pswd, salt); 
        AccountData.updateOne({email:userData.email},{$set:{hash:passwordData}},{upsert:true},(err,doc) =>{
            if(err){
                console.log(err);  
                // return res.render('error',{message: 'Unable connect to database!', error:err});
                return res.json({error:{message: err}});                
            }
            if (!doc){
                console.log('doc - undefined');
                // Error! Make flash message!
                //req.flash('error', 'User with the specified e-mail is not registered on this site!');
                return res.json({error:{message: 'Обліковий запис у базі даних не знайдений!'}});
            } 

            res.json({result: 'success'});

        });
    }
    else{
        console.log('error connection to mongo server!');
        res.json({error:{message: 'Помилка підключення до сервера!' }});
    }
});

app.post('/user_data_update', urlencodedParser, function(req,res){

    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else 
    /*if(req.session.passport.user)*/
    {
        let userData =  req.session.passport.user;
        if (mainconnection.readyState == 1) {
            
            AccountData.updateOne({email:userData.email},{$set:{username:req.body.username, contactPhones:req.body.contactPhones}},{upsert:true},(err,doc) =>{
                if(err){
                    console.log(err);  
                    // return res.render('error',{message: 'Unable connect to database!', error:err});
                    return res.json({error:{message: err}});                
                }
                if (!doc){
                    console.log('doc - undefined');
                    // Error! Make flash message!
                    //req.flash('error', 'User with the specified e-mail is not registered on this site!');
                    return res.json({error:{message: 'Обліковий запис у базі даних не знайдений!'}});
                } 
                req.session.passport.user.username = req.body.username;
                req.session.passport.user.contactPhones = req.body.contactPhones;

                res.json({result: 'success'});
            });

        }       
        else{
            console.log('error connection to mongo server!');
            res.json({error:{message: 'Помилка підключення до сервера!' }});
        }
    }
});

app.post('/processing', urlencodedParser, function(req,res){

    console.log("Прийшов запит про готовність файлу");
    var filedata=req.body.fileName;
    console.log(filedata);
    var filename = filedata.substr(0, filedata.lastIndexOf('.')) + '.xml'    
    var file_path = __dirname + '/downloads/'+filename;    
    console.log(file_path);

    fs.access(file_path, fs.F_OK, (err) => {
        if (err) {               
            console.log("Файл " +filename +" не знайдений");
            res.status(404).send("Файл " +filename +" не знайдений");            
        }
        else{
            console.log("Файл знайдений");
            res.status(200).send(filename);
         }
    }); 
});

app.get('/downloading', urlencodedParser, function(req,res){

    var file=req.query.destFile;
    var file_path = __dirname + '/downloads/'+file;
    console.log("file_path = "+file_path);
    var filename = path.basename(file_path);
    var mimetype = mime.lookup(file_path);

    res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-Type', mimetype);

    return res.download(file_path, file, function(err) {
        if (err) {
            console.log(err); // Check error if you want
        }
            
        fs.unlink(file_path, function(){
            console.log("File was deleted") // Callback
        });
    });
});    


app.get('/ksefview', urlencodedParser, function(req,res){

    var file=req.query.destFile;
    var file_path = __dirname + '/downloads/'+file;
    console.log("file_path = "+file_path);
    var mimetype = mime.lookup(file_path);
    res.setHeader('Content-Type', mimetype);

    return res.sendFile(file_path, function(err) {
        if (err) {
            console.log(err); // Check error if you want
        }
        
        fs.unlink(file_path, function(){
            console.log("File was deleted") // Callback
        });
    });
});    

app.post('/htmlview', urlencodedParser, function(req,res){

    if(!req.user){
        // req.flash('error', 'Session timed out. Authentication required.');
        req.flash('error', 'Час сеансу минув. Необхідна автентифікація.');
        return res.redirect('/');
    }
    else {    
        let xmlfile = req.body.data;
        let userData = req.session.passport.user;
        let data;

        if (userData.provider==='google'){
            data = {provider:       userData.provider,
                    username:       userData.displayName,            
                    email:          userData.email,
                    picture:        userData.picture,
                    verified:       userData.verified,
                    email_verified: userData.email_verified,
                    language:       userData.language}
    
        } else {
            data = {username:       userData.username,            
                    email:          userData.email,
                    category:       userData.category, 
                    confirmed:      userData.confirmed,
                    remember_me:    userData.remember_me,
                    regdate:        userData.regdate,
                    expireDate:     userData.expireDate}
        }
      
        //res.setHeader('Content-Type', "text/html; charset=UTF-8") 
               
        return res.render('ksefview',  {page:'Home', 
                                        menuId:'home',
                                        user_profile:data,
                                        file:xmlfile});
    }
});

// Starting both http & https servers
const httpServer = http.createServer(app);
//--const httpsServer = https.createServer(credentials, app);

httpServer.listen(3000, () => {
    console.log('HTTP Server running on port 3000');
    console.log('Local IP: '+getIPAddress());
    schedule.scheduleJob(scheduleMinute.toString()+' '+scheduleHour.toString()+' * * *',checkExpiredDate);
});

//--httpsServer.listen(443, () => {
//--  	console.log('HTTPS Server running on port 443');
//--});


//app.listen(3000);

// process.on('exit', (code) => {
//     mongoClient.close();
//     console.log(`About to exit with code: ${code}`);
//  });
//  process.on('SIGINT', function() {
//     console.log("Caught interrupt signal");
//     process.exit();
//  });    if (mainconnection.readyState == 0){

var mainconnection = mongoose.createConnection(process.env.DB_CONNECTION_STRING,{
    // useUnifiedTopology: true, 
    // useNewUrlParser: true,
    // // ssl: false,
    tls: false,
    // key:  fs.readFileSync("/etc/ssl/mongodb.pem"),
    // cert: fs.readFileSync("/etc/ssl/mongodb.crt"),
    // ca:   fs.readFileSync("/etc/ssl/mongodb-ca.crt"),
    // ssl: true,
    // sslValidate: true,
    // sslKey:  '/etc/ssl/mongodb.pem',
    // sslCert: '/etc/ssl/mongodb.crt',
    // sslCA:   '/etc/ssl/mongodb-ca.crt',
});

const User = mainconnection.model('User', require('./schemas/userSchema'),'UserCollection');
const AccountData = mainconnection.model('AccountData', require('./schemas/usersDataSchema'),'UserCollection');
const Token = mainconnection.model('Token', require('./schemas/tokenSchema'),'tokens');
const FmUser = mainconnection.model('FmUser', require('./schemas/fmUserSchema'),'UserCollection');
// mongoose.connect(dbConnectionString,{
//             useUnifiedTopology: true, 
//             useNewUrlParser: true,
//             // ssl: false,
//             ssl: true,        
//             sslValidate: true,
//             sslKey:  fs.readFileSync("/etc/ssl/mongodb.pem"),
//             sslCert: fs.readFileSync("/etc/ssl/mongodb.crt"),
//             sslCA:   fs.readFileSync("/etc/ssl/mongodb-ca.crt"),

// 	    }).then(() => {
//                 console.log('DB Connected!');
//             })
                                    
//         .catch(err => 
//             console.log(`DB Connection Error: ${err.message}`)
//     );

mainconnection.once('open',() => {
    console.log('Mongoose connection open to DB');      
});

mainconnection.on('open',() => {
    console.log('DB Connected!');      
});

mainconnection.on('error', (err) => {
    //    response.render('error',{message:'Unable connect to Database! ', error:'Timeout'});
    console.log('error connection to mongo server!');
    console.log(err); 
});    

function checkExpiredDate(){
    console.log('scheduler is running!');
    if (mainconnection.readyState == 1) {   
        AccountData.find((err, accounts)=>{        

            if(err){
                console.log(err);  
                // return res.render('error',{message: 'Unable connect to database!', error:err});
                return res.render('error',{message: 'Неможливо підключитись до бази даних!', error:err});
            }
            if (accounts!=undefined){
                if (accounts.length > 0) {

                    var index = 0; 
                    job = schedule.scheduleJob('*/1,* * * *', function(){
                        var date = new Date();
                        var verifyDate1 =  new Date(date.getFullYear(), date.getMonth(), date.getDate() + preWarningDays1);
                        var verifyDate2 =  new Date(date.getFullYear(), date.getMonth(), date.getDate() + preWarningDays2);
                        do {
                            if (!accounts[index].isAdmin){
                                var expireDate = accounts[index].expireDate;
                                
                                if (expireDate==null){
                                    index++;
                                    continue;
                                }

                                if (verifyDate1.getFullYear()==expireDate.getFullYear()&
                                    verifyDate1.getMonth()==expireDate.getMonth()&
                                    verifyDate1.getDate()==expireDate.getDate()){

                                    sendWarningLevel(accounts[index],preWarningDays1);
                                    index++;                                       
                                    break;
                                }
                                else
                                if (verifyDate2.getFullYear()==expireDate.getFullYear()&
                                    verifyDate2.getMonth()==expireDate.getMonth()&
                                    verifyDate2.getDate()==expireDate.getDate()){

                                    sendWarningLevel(accounts[index],preWarningDays2);
                                    index++;                                       
                                    break;
    
                                }
                            }
                            
                            index++; 

                        } while(index < accounts.length)
   
                        if (index>=accounts.length){
                            schedule.cancelJob(job);
                            console.log('scheduler is canceled!');
                        }                         

                    })
                }
            } 
        });
    }
};

function sendWarningLevel(account, days){

    console.log('Warning-1: '+account.email);

    var user_name = account.email;
    if (account.username!=null)
        user_name = account.username;
    
    var str=days.toString();
    if (days==preWarningDays1)   
        str += ' днів';
    else
    if (days==preWarningDays2)   
        str += ' дні';

    var expireDate= moment(account.expireDate,moment.ISO_8601).utc().format('DD-MM-YYYY');

    var mailOptions = {
    from: process.env.MAIL_SENDER,
    to: account.email,
    subject: 'Закінчується термін підписки на послуги сайту "https://retailbox-prro.ics-market.com.ua" ',
    html:    '<div style="text-align:center"><img src="cid:logo@ics" alt="Logo" style="max-width:200px;margin-bottom:10px;"></div>' +

           '<p align = "center"><b> Доброго дня, шановний(-а) '+  user_name + '!</b></p><br><br>'+

           'Нагадуємо Вам, що через '+ str + ' закінчується термін підписки на сервіси сайту https://rro.ics-market.com.ua <br><br>' +
           '<b>Доступ Вашого облікового запису до сервісів сайту буде припинено '+expireDate+'.</b><br><br>'+               
           'За умовами та іншими питаннями продовження передплати на наступний період '+
           'Вам необхідно письмово звернутися до адміністратора сайту: registration@ics-market.com.ua. <br><br>'+
 

           '<b>Ми дуже сподіваємося, що наші сервіси стали Вам у нагоді і будемо щиро раді продовжити '+
           'взаємне співробітництво щодо подальшого їх розвитку разом із нашою командою!</b><br><br>'+
               
           'Це повідомлення було надіслано Вам автоматично, відповідати на нього не потрібно.<br><br>'+
 
           'З повагою, Адміністрація сайту.',
    attachments: [{ filename: 'logo.jpg', path: path.join(__dirname, 'icons', 'logo.jpg'), cid: 'logo@ics' }]

    };

    mailer.sendMail(mailOptions, 'warning').catch(function(error){
        if (error) {
            console.log(error);
        }
    });

}