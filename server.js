//const MongoClient = require('mongodb').MongoClient;dbConnectionString
 var fs = require('fs');
 var http = require('http');
//-- var https = require('https');

//Standard port for MongoDB: 27017
// Local  -10.215.0.121:27017
// Remote -213.160.150.219:10400
// DataCentre -185.250.23.89:10400 (Domain name: rro.ics-market.com.ua)
//const dbConnectionString = 'mongodb://snmp_user:Service_RW@213.160.150.219:10400/snmp_main_db';
//const KSEFServerConnectionString = 'mongodb://mainUSER:KSEFpswd_2021@213.160.150.219:10400/ksef_main_db';
const dbConnectionString = 'mongodb://snmp_user:Service_RW@rro.ics-market.com.ua:10400/snmp_main_db';
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
var passport = require('passport'); // Passport - це middleware для Node.js, який забезпечує аутентифікацію користувачів у веб-додатках. Він підтримує різні стратегії аутентифікації, такі як локальна аутентифікація, OAuth, OpenID та інші, що дозволяє легко інтегрувати аутентифікацію у ваш додаток.
var utils = require('./modules/utils'); // Модуль utils.js надає допоміжні функції для генерації токенів та випадкових чисел. Він містить функцію generateToken, яка генерує випадковий рядок заданої довжини, використовуючи символи латинського алфавіту та цифри. Функція getRandomInt використовується для отримання випадкового цілого числа у заданому діапазоні.
var secret = tokens.secretSync();
const tokensecret = '$';
const f_tokensecret ='EsKe28sdsWXd_2@sMc';
const tokensalt = 'asarERfd14s';
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

var registerNewUser = function (request, response){

    var query = User.findOne({email: request.body.email});
    assert.ok(!(query instanceof Promise));
    
    query.then(function(doc) {
   
      //console.log(doc);
      if(doc==null){
      // if (typeof doc === 'undefined'){
          console.log('undefined');
          // Generate HASH 
          var salt = genRandomString(16);
          var passwordData = sha512(request.body.password, salt);
      
          // a document instance
          var curUser = new User({username: request.body.username,
                                  email: request.body.email,
                                  hash: passwordData});

          // save model to database                                            
          curUser.save(function (err, user) {
              if (err) {
                  return console.error(err);
              }
          
              console.log(curUser.name + " saved to user collection.");       

              var EMAIL_SECRET = Buffer.from(sha256(tokensecret, tokensalt).passwordHash).toString('base64');
              console.log(EMAIL_SECRET);
              
              var index = undefined;
              function getUserId (){
                  User.findOne({email: request.body.email}). then( doc => {

                      index =  doc._id;
                      console.log('index1 - ' + index);                    
  
                      // sync making emailToken
                      var emailToken = jwt.sign({user:`${index}`}, EMAIL_SECRET);
                          
                          console.log(emailToken)

                          // const url = `https://rro.ics-market.com.ua/confirmation/${emailToken}`;
                          //const url = `https://${getIPAddress()}/confirmation/${emailToken}`;
                          const url = `http://${getIPAddress()}:3000/confirmation/${emailToken}`;

                          // надіслати листа з паролем на e-mail
                          var nodemailer = require('nodemailer');

                          var transporter = nodemailer.createTransport({
                              name: "ics-market.com.ua",
                                // service: 'gmail',
                              host: "smtp-relay.gmail.com",//"smtp.gmail.com",
                              port: 465,
                              secure: true,
                              pool: true,
                                // auth: {
                                //     user: 'd.vasilenko@ics-market.com.ua',
                                //     pass: 'grubzpmnpwhgxsbb'
                                // }
                          });

                          var mailOptions = {
                            from: 'rro@ics-market.com.ua',
                            to: doc.email,
                            subject: 'Завершення реєстрації на сайті: https://rro.ics-market.com.ua',
                            html:    '<p align = "center"><b> Доброго дня, шановний(-а) '+ doc.username + '!</b></p><br><br>'+

                                     'Адміністратор сайту \"https://rro.ics-market.com.ua\" зареєстрував Ваш обліковий запис. <br>' +
                                     'Ваш пароль доступу до сайту: '+request.body.password+'<br>' +
                                     'Будь ласка, дочекайтесь активації Вашого облікового запису адміністратором сайту.<br>'+
                                     'Скоро Вам буде надіслано листа про активацію Вашого облікового запису.<br>'+
                                     'З питань реєстрації та активації можна звертатися до адміністратора: registration@ics-market.com.ua <br><br>'+
                                                                         
                                     'Це повідомлення було надіслано Вам автоматично, відповідати на нього не потрібно.<br><br>'+

                                     'З повагою, Адміністрація сайту.'
                          };
                
                          transporter.sendMail(mailOptions, function(error, info){
                              if (error) {
                                  console.log(error);
                              }
                          });
                          
                          var maillist =['registration@ics-market.com.ua'];
                          User.find({isAdmin: true}). then( doc => {

                            if (doc!=null){
                                doc.forEach(function(account){
                                    maillist.push(account.email);
                                })
                            }
                          });
                        
                          mailOptions = {
                              from: 'rro@ics-market.com.ua',
                              //to: request.body.email,
                              to: maillist,//'registration@ics-market.com.ua',
                              subject: 'Підтвердіть реєстрацію нового користувача на сайті: https://rro.ics-market.com.ua',
                              html:   '<p align="center"><b> Доброго дня, шановний(-а) адміністратор сайту \"https://rro.ics-market.com.ua\"!</b></p><br><br>'+

                                      `Користувач: ${doc.username} з e-mail: ${doc.email} успішно зареєстрований на сайті: https://rro.ics-market.com.ua. <br>` +
                                      `адміністратором ${request.session.passport.user.username} (e-mail: ${request.session.passport.user.email}). <br>`+  

                                      'Пароль доступу на сайт: <b>'+ request.body.password + '<b><br>' +
                                      `Цей пароль доступу був також надісланий за адресою ${doc.email} автоматично! <br><br>` +

                                      `Щоб завершити реєстрацію цього користувача, перейдіть будь ласка за цим посиланням: <a href="${url}"> Підтвердити реєстрацію </a><br><br>`+

                                      'Це повідомлення було надіслано Вам автоматично, так як Ви є членом групи адміністраторів сайту.'
                          };
                
                          transporter.sendMail(mailOptions, function(error, info){
                              if (error) {
                                  console.log(error);
                                  return response.render('registration', {                
                                      page:'Home', 
                                      menuId:'home',                     
                                      data: request.body, // { email }
                                      errors: {
                                          email: { msg: error} // Message for email
                                      },
                                      csrfToken:tokens.create(secret)
                                  })
                      
                              } else {
                                  console.log('Email sent: ' + info.response);
                              }
                          });
                  
                          // Success! Make flash message!
                          //request.flash('success', 'We have sent registering information on your e-mail. Please check your e-mail box.');            
                          //request.flash('success', 'Ми надіслали Вам реєстраційну інформацію на електронну пошту. Будь ласка, перевірте Ваші вхідні листи.');
                          request.flash('success', `Запит на реєстрацію облікового запису \"${doc.email}\" прийнято. Вам надіслано листа. \n Щоб завершити реєстрацію облікового запису, перейдіть за посиланням у листі \"Підтвердити реєстрацію\".`);
                          return response.redirect('/admin_panel');
                  });
               
                };

              getUserId();
              
          });

      }else{
          console.log('defined')
          request.body.email = null;
          // Повідомляємо що користувач вже існує в системі 
          return response.render('registration', {                
              page:'Home', 
              menuId:'home',                     
              data: request.body, // { email }
              errors: {
                  // email: { msg: 'This e-mail address is already registered!' } // Message for email
                  email: { msg: 'Ця електронна адреса вже зареєстрована!' } // Message for email
              },
              csrfToken:tokens.create(secret)
         })
      }

    });
}

var forgotPassword = function (req, res){

    User.findOne({email: req.body.email},(err, doc)=>{        
    
        if(err){
            console.log(err);  
            // return res.render('error',{message: 'Unable connect to database!', error:err});
            return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
        }
        if (!doc){
            console.log('doc - undefined');
            // Error! Make flash message!
            // req.flash('error', 'User with the specified e-mail is not registered on this site!');
            req.flash('error', 'Користувач із зазначеним e-mail не зареєстрований на цьому сайті!');
            return res.redirect('/forgot_password');//res.render('forgot_password',{page:'Home', menuId:'home'});
        } 
        
        // Якщо користувача знайдено – генеруємо токен для скидання пароля

        var FORGOT_SECRET = Buffer.from(sha256(f_tokensecret, tokensalt).passwordHash).toString('base64');
        console.log(FORGOT_SECRET);
        
        var index =  doc._id;

        // sync making forgotToken
        var forgotToken = jwt.sign({user:`${index}`}, FORGOT_SECRET);
                          
        console.log(forgotToken)

        User.updateOne({email: req.body.email},{$set:{token:forgotToken}},{upsert:true},(err,doc) =>{
            
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
                return res.redirect('/forgot_password');//res.render('forgot_password',{page:'Home', menuId:'home'});
            } 

        });

 
        //const url = `https://rro.ics-market.com.ua/change_password/${forgotToken}`;
        //const url = `https://${getIPAddress()}/change_password/${forgotToken}`;
        const url = `http://${getIPAddress()}:3000/change_password/${forgotToken}`;
                
        // надіслати листа з паролем на e-mail
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            name: "ics-market.com.ua",
            // service: 'gmail',
            host: "smtp-relay.gmail.com", //"smtp.gmail.com",  
            port: 465,
            secure: true,
            pool: true,
            // auth: {
            //     user: 'd.vasilenko@ics-market.com.ua',
            //     pass: 'grubzpmnpwhgxsbb'
            // }
        });

        var mailOptions = {
            from:  'rro@ics-market.com.ua',//'rro@ics-market.com.ua',
            to: req.body.email,
            subject: 'Відновлення доступу на сайт: https://rro.ics-market.com.ua',
            html:   `<p align="center"><b> Доброго дня, шановний(-а) ${doc.username} '!</b></p><br><br>`+

                    'Вам було надіслано цей лист, оскільки Ви були зареєстровані на сайті <b>https://rro.ics-market.com.ua</b>.<br>' +
                    '<b> Якщо Ви не заходили на сайт та не намагалися відновити свій пароль, будь ласка, проігноруйте цей лист.</b><br><br>'+

                    `Для відновлення пароля доступу на сайт, будь ласка, перейдіть за посиланням: <a href="${url}"> Відновити пароль </a><br><br>`+

                    'Це повідомлення було надіслано Вам автоматично, відповідати на нього не потрібно.<br><br>'+
                    
                    'З повагою, Адміністрація сайту.'
        };
               
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                req.flash('error', error);
                return res.redirect('/forgot_password');
//                res.render('forgot_password',{page:'Home', menuId:'home'})
                     
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
                 
        // Success! Make flash message!
        // req.flash('success', 'We have sent you an email. Please check your e-mail box.');
        req.flash('success', 'Ми надіслали Вам листа. Будь ласка, перевірте Вашу елекронну пошту.');
        return res.redirect('/forgot_password');
        //res.render('forgot_password',{page:'Home', menuId:'home'});
    });
}

var confirmNewUser = function (id, req, res){

    //const FmUser = require('./models/fmuser');
    var localDate = ((new Date).toString() +' UTC').toLocaleString();
    // Пошук у базі та зміна статусу користувача за кодом:
    // Змінюємо статус підтвердження реєстрації користувача.
    // Заносимо дату реєстрації користувача.
    // Записуємо зміни до документа
    FmUser.findByIdAndUpdate(id,{confirmed: true, regdate: localDate},{useFindAndModify:false},(err, doc)=>{
    
        if(err){
            console.log(err);  
            // return res.render('error',{message: 'Unable connect to database!', error:err});
            return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
        }
        if (!doc){
            console.log('doc - undefined');
            // return res.render('error',{message: 'User not found!', error:'Error: This user not registered in users database!'});
            return res.render('error',{message: 'Користувач не знайдений!', error:'Помилка: користувач не зареєстрований у базі даних!'});
        } 

        // надіслати листа з паролем на e-mail
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            name: "ics-market.com.ua",
                //service: 'gmail',
            host: "smtp-relay.gmail.com",//"smtp.gmail.com",
            port: 465,
            secure: true,
            pool: true,
                //auth: {
                //  user: 'd.vasilenko@ics-market.com.ua',
                //  pass: 'grubzpmnpwhgxsbb'
                //}
        });

        var mailOptions = {
            from: 'rro@ics-market.com.ua',
            to: doc.email,
            subject: 'Успішне завершення реєстрації на сайті: https://rro.ics-market.com.ua',
            html:    '<p align = "center"><b> Доброго дня, шановний(-а) '+ doc.username + '!</b></p><br><br>'+

                     'Адміністратор сайту \"https://rro.ics-market.com.ua\" підтвердив Ваш обліковий запис. <br>' +                     
                     'Нагадуємо, що Ви можете самостійно змінити пароль доступу, виданий адміністратором, прямо на сайті! <br>' +
                     'Бажаємо Вам приємної роботи!<br><br>'+

                     'Це повідомлення було надіслано Вам автоматично, відповідати на нього не потрібно.<br><br>'+
                     
                     'З повагою, Адміністрація сайту.'
        };

        transporter.sendMail(mailOptions, function(err, info){
            if (err) {
                console.log(err);
            }
        });

        var maillist =['registration@ics-market.com.ua'];
        User.find({isAdmin: true}). then( doc => {

          if (doc!=null){
              doc.forEach(function(account){
                  maillist.push(account.email);
              })
          }
        });

        let mail_context =  '<p align = "center"><b> Доброго дня, шановний(-а) адміністратор сайту \"https://rro.ics-market.com.ua\"!</b></p><br><br>';

        // Якщо користувач не в поточній сесії, тоді 
        if (req.session.passport === undefined) 
      
            mail_context += 'Один із адміністраторів ';
        else    
            mail_context += `Aдміністратор ${req.session.passport.user.username} (e-mail: ${req.session.passport.user.email}) <br>`;  
            
        mail_context +=  'успішно підтвердив реєстрацію користувача ' +doc.username+ ' на сайті: https://rro.ics-market.com.ua.<br>' +
                         'Лист про активацію облікового запису вже надіслано на зареєстрований e-mail: ' +doc.email+' !<br><br>'+

                         'Це повідомлення було надіслано Вам автоматично, так як Ви є членом групи адміністраторів сайту.';

        mailOptions = {
            from: 'rro@ics-market.com.ua',            
            to: maillist,//'registration@ics-market.com.ua',
            subject: 'Успішне завершення реєстрації на сайті: https://rro.ics-market.com.ua',
            html:    mail_context
        };

        transporter.sendMail(mailOptions, function(err, info){
            if (err) {
                console.log(err);
            }
        });

        // req.flash('success', 'Congratulation! Your e-mail was successfully confirmed.');
        req.flash('success', 'Вітаємо! Адреса електронної пошти була успішно підтверджена.');
        return res.redirect('/admin_panel');              
        
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

var verifyToken = function(req, res){

    var FORGOT_SECRET = Buffer.from(sha256(f_tokensecret, tokensalt).passwordHash).toString('base64');
            
    const decoded = jwt.verify(req.params.token, FORGOT_SECRET);
    console.log(decoded.user);
    var id = decoded.user;
    //const FmUser = require('./models/fmuser');
    
    FmUser.findById(id,(err, doc)=>{

        if(err){
            console.log(err);  
            // return res.render('error',{message: 'Unable connect to database!', error:err});
            return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
        }
        if (!doc){
            console.log('doc - undefined');
            // return res.render('error',{message: 'User not found!', error:'Error: This user not registered in users database!'});
            return res.render('error',{message: 'Користувач не знайдений', error: 'Помилка: користувач не зареєстрований у базі даних!'});
        } 
        
        console.log('from db: '+ doc.token);
        console.log('from mail: '+ req.params.token);
        var tokenEqual = false;
        if (doc.token === req.params.token){
            tokenEqual = true;
        }

        FmUser.findByIdAndUpdate(id,{$unset: {token: ''}},{useFindAndModify:false},(err, doc)=>{

            if(err){
                console.log(err);  
                // return res.render('error',{message: 'Unable connect to database!', error:err});
                return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
            }

            if (!doc){
                console.log('doc - undefined');
                // return res.render('error',{message: 'User not found!', error:'Error: This user not registered in users database!'});
                return res.render('error',{message: 'Користувач не знайдений!', error: 'Помилка: користувач не зареєстрований у базі даних!'});
            } 
            
        });

        if (tokenEqual)
            return res.render('change_password',{page:'Home', menuId:'home', jwt:req.params.token, errors:{}, csrfToken:tokens.create(secret)});
        else{
            // req.flash('error','Error: bad user token!');
            req.flash('error', 'Помилка: невірний токен користувача!');
            return res.redirect('/forgot_password');
        }
    });
}

var changePassword = function(req, res){
    var token =  String(req.body.jwt);
    console.log('body token: '+ token);
    var FORGOT_SECRET = Buffer.from(sha256(f_tokensecret, tokensalt).passwordHash).toString('base64');
            
    const decoded = jwt.verify(token, FORGOT_SECRET);
    console.log(decoded.user);
    var id = decoded.user;
    console.log('_id = '+id);    

    // Generate HASH 
    var salt = genRandomString(16);
    var passwordData = sha512(req.body.password, salt);
    //const FmUser = require('./models/fmuser');
    FmUser.findByIdAndUpdate(id,{hash: passwordData},{useFindAndModify:false},(err, doc)=>{
    
        if(err){
            console.log(err);  
            // return res.render('error',{message: 'Unable connect to database!', error:err});
            return res.render('error',{message: 'Неможливо підключитися до бази даних!', error:err});
        }
        if (!doc){
            console.log('doc - undefined');
            // return res.render('error',{message: 'User not found!', error:'Error: This user not registered in users database!'});            
            return res.render('error',{message: 'Користувач не знайдений!', error: 'Помилка: користувач не зареєстрований у базі даних!'});
        } 

        // надіслати листа з паролем на e-mail
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            name: "ics-market.com.ua",
            // service: 'gmail',
            host: "smtp-relay.gmail.com", //"smtp.gmail.com",
            port: 465,
            secure: true,
            pool: true,
            // auth: {
            //     user: 'd.vasilenko@ics-market.com.ua',
            //     pass: 'grubzpmnpwhgxsbb'
            // }
        });

        var mailOptions = {
            from: 'rro@ics-market.com.ua',
            to: doc.email,
            subject: 'Успішна зміна пароля доступу на сайт: https://rro.ics-market.com.ua',
            html:    '<p align="center"><b> Доброго дня, шановний(-а) '+ doc.username + '!</b></p><br><br>'+

                                      'Ви успішно змінили свій пароль на сайті https://rro.ics-market.com.ua. <br>' +
                                      'Ваш новий пароль: <b>'+ req.body.password + '</b><br><br>' +                                    
                                      
                                      'Це повідомлення було надіслано Вам автоматично, відповідати на нього не потрібно.<br><br>' +
                                      
                                      'З повагою, Адміністрація сайту.'
         };

        transporter.sendMail(mailOptions, function(err, info){
            if (err) {
                console.log(err);
            }
        });

        // req.flash('success', 'Congratulation! Your new password was succesfully saved.');
        req.flash('success', 'Вітаємо! Ваш новий пароль успішно збережено.');
        return res.redirect('/');               
        
    });
}


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
//                 request.flash('error', 'Користувач не знайдений!');
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
    key: 'super-secret-cookie',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }  // 30 min
  }));
app.use(flash());
//app.use(csrf({cookie:true})); 

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

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me',{failureRedirect:'/sign-in'}));
    
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

app.get('/registration', urlencodedParser, function(req,res){
    // console.log(req.csrfToken());
    // var token = req.csrfToken();
    //  res.cookie ( 'CSRF-TOKEN', token)
   
    return res.render('registration',{page:'Home', menuId:'home', data:{}, errors:{}, csrfToken:tokens.create(secret)});
    // res.render('registration',{page:'Home', menuId:'home', data:{}, errors:{}});
});
    
app.post('/registration', urlencodedParser,                          
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
                            check('password','Будь ласка, введіть пароль не менше 8-ми символів, він повинен містити, як мінімум, одну велику та одну маленьку літери, одну цифру та один спеціальний знак (@$_,.—!%*#?&).')      
                                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$_,.—!%*#?&\-])[a-zA-Z\d@$_,.—!%*#?&\-]{8,}$/, "i"),
                            // check('confirm_password', 'Passwords do not match.').custom((value, {req}) => (value === req.body.password))  
                            check('confirm_password', 'Паролі не співпадають.').custom((value, {req}) => (value === req.body.password))  
                                , function (request, response) {


    //console.log(request.csrfToken());
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    if (!tokens.verify(secret, request.body._csrf)){

        // return response.status(403).send('form tampered with.');
        return response.status(403).send('Форма була підроблена.');
    }

    const errors = validationResult(request)
    if (!errors.isEmpty()){
      return response.render('registration', {
          page:'Home', 
          menuId:'home',  
          data: request.body,
          errors: errors.mapped(),
          csrfToken:tokens.create(secret)})
    }

    if (mainconnection.readyState == 1){
       registerNewUser(request,response);
    }
    else{
        console.log('error connection to mongo server!');
        // return response.render('error',{message: 'Server connection error!'});
        return response.render('error',{message: 'Помилка підключення до сервера!'});
    }
   
    User.username = request.body.username;
    User.email = request.body.email;
    var salt = genRandomString(16);
    var passwordData = sha512(request.body.password, salt);
    User.hash = passwordData;
});

app.get('/confirmation/:token', urlencodedParser, function (req,res) {
    try{
        console.log(req.params.token);
        var EMAIL_SECRET = Buffer.from(sha256(tokensecret, tokensalt).passwordHash).toString('base64');
                
        const decoded = jwt.verify(req.params.token, EMAIL_SECRET);
        console.log(decoded.user);
        var id = decoded.user;
        console.log('_id = '+id);    
       
        if (mainconnection.readyState == 1){
            confirmNewUser(id, req, res);
        }  
        else{
            console.log('error connection to mongo server!');
            // return res.render('error',{message: 'Server connection error!'});
            return res.render('error',{message: 'Помилка підключення до сервера!'});
        }
     
    } catch (err){
        // return res.render('error',{message: 'E-mail confirmation error!'});
        return res.render('error',{message: 'Помилка підтвердження e-mail!'});
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
 
 // Forgot password
app.get('/forgot_password', urlencodedParser, function(req,res){
    
   return res.render('forgot_password',{page:'Home', menuId:'home'});

});

app.post('/forgot_password', urlencodedParser, check('email')
                                                .isEmail()
                                                //.withMessage('That email doesn‘t look right')
                                                .withMessage('Невірний e-mail.')
                                                .trim()
                                                .normalizeEmail({ gmail_remove_dots : false, 
                                                                  gmail_remove_subaddress: false,
                                                                  outlookdotcom_remove_subaddress: false,
                                                                  icloud_remove_subaddress: false,
                                                                  yahoo_remove_subaddress: false }),  
                                                function (req, res) {
    if (mainconnection.readyState == 1){
        forgotPassword(req,res);
    } 
    else{
        console.log('error connection to mongo server!');
        // return res.render('error',{message: 'Server connection error!'});
        return res.render('error',{message: 'Помилка підключення до сервера!'});
    }                                                                                                                                              
});

app.get('/change_password/:token', urlencodedParser, function (req, res) {
    console.log(req.params.token); 

    if (mainconnection.readyState == 1){
        verifyToken(req,res);
    }
    else{
        console.log('error connection to mongo server!');
        // return res.render('error',{message: 'Server connection error!'});
        return res.render('error',{message: 'Помилка підключення до сервера!'});
    }                                                                                               
});

app.post('/change_password', urlencodedParser,                          
                             // check('password','Please enter a password at least 8 character and contain at least one uppercase, one lower case and one special character.')   
                             check('password','Будь ласка, введіть пароль не менше 8-ми символів, він повинен містити, як мінімум, одну велику та одну маленьку літери, одну цифру та один спеціальний знак (@$_,.—!%*#?&).')                                                              
                                .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$_,.—!%*#?&\-])[a-zA-Z\d@$_,.—!%*#?&\-]{8,}$/, "i"),
                             // check('confirm_password', 'Passwords do not match.').custom((value, {req}) => (value === req.body.password))  
                             check('confirm_password', 'Паролі не співпадають.').custom((value, {req}) => (value === req.body.password))  
                                , function (req, res) {

    if(!req.body) return res.sendStatus(400);
    console.log(req.body);
    if (!tokens.verify(secret, req.body._csrf)){
        // return res.status(403).send('form tampered with');
        return res.status(403).send('Форма була підроблена.');
    }
            
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        console.log('jwt - '+ req.body.jwt);
        return res.render('change_password',{page:'Home', menuId:'home', jwt:req.body.jwt, errors: errors.mapped(), csrfToken:tokens.create(secret)})
    }

    if (mainconnection.readyState == 1){
        changePassword(req, res);      
    }
    else{
        console.log('error connection to mongo server!');
        // return res.render('error',{message: 'Server connection error!'});
        return res.render('error',{message: 'Помилка підключення до сервера!'});        
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
            req.session.destroy();
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

var mainconnection = mongoose.createConnection(dbConnectionString,{
    // useUnifiedTopology: true, 
    // useNewUrlParser: true,
    // // ssl: false,
    // tls: false,
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
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        name: "ics-market.com.ua",
        //service: 'gmail', 
        host: "smtp-relay.gmail.com", //"smtp.gmail.com",
        port: 465,
        secure: true,
        pool: true,
        //auth: {
        //   user: 'd.vasilenko@ics-market.com.ua',
        //   pass: 'grubzpmnpwhgxsbb'
        //}
    });

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
      from: 'rro@ics-market.com.ua',
      to: account.email,
      subject: 'Закінчується термін підписки на послуги сайту \"https://rro.ics-market.com.ua\" ',
      html:    '<p align = "center"><b> Доброго дня, шановний(-а) '+  user_name + '!</b></p><br><br>'+

               'Нагадуємо Вам, що через '+ str + ' закінчується термін підписки на сервіси сайту https://rro.ics-market.com.ua <br><br>' +
               '<b>Доступ Вашого облікового запису до сервісів сайту буде припинено '+expireDate+'.</b><br><br>'+               
               'За умовами та іншими питаннями продовження передплати на наступний період '+
               'Вам необхідно письмово звернутися до адміністратора сайту: registration@ics-market.com.ua. <br><br>'+

               '<b>Ми дуже сподіваємося, що наші сервіси стали Вам у нагоді і будемо щиро раді продовжити '+
               'взаємне співробітництво щодо подальшого їх розвитку разом із нашою командою!</b><br><br>'+
               
               'Це повідомлення було надіслано Вам автоматично, відповідати на нього не потрібно.<br><br>'+

               'З повагою, Адміністрація сайту.'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        }
    });

}