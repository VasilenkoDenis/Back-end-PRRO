// Данные OAuth
// Идентификатор клиента: 515030901131-7ld408dv7jevdor8ema8pjvnoqtf3r23.apps.googleusercontent.com
// Секретный код клиента: 6uHkBkaotUVAwgGpq6SbZB8e

const GOOGLE_CLIENT_ID = '515030901131-7ld408dv7jevdor8ema8pjvnoqtf3r23.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '6uHkBkaotUVAwgGpq6SbZB8e';
const GOOGLE_CALBACK_URL = 'https://rro.ics-market.com.ua/validateWithGoogle';

const {google} = require('googleapis');

const googleConfig = {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: GOOGLE_CALBACK_URL, // this must match your google api settings
 };
  
 /**
 * Эта область сообщает Google, какую информацию мы хотим запросить.
 */
// const  defaultScope  =  [
//   'https://www.googleapis.com/auth/plus.me',
//   'https://www.googleapis.com/auth/userinfo.email' ,
// ] ;

const defaultScope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
];    



var GA = module.exports = {
    // Constants export
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALBACK_URL,
    defaultScope,

    /**
     * Create the google auth object which gives us access to talk to google's apis.
     */
    createConnection: function () {
        return new google.auth.OAuth2(
            googleConfig.clientId,
            googleConfig.clientSecret,
            googleConfig.redirect
        );
    },

    /**
     * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
     */
    getConnectionUrl: function (auth) {
        return auth.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
            scope: defaultScope
        });
    },

    /**
     * Helper function to get the library with access to the google plus api.
     */
    getGooglePeopleApi: function (auth) {
        return google.people({
            version: 'v1',
            auth: auth,
        });
    },

    /**
     * Part 1: Create a Google URL and send to the client to log in the user.
     */
    getGoogleAuthenticationUrl: function () {
        return new Promise(async (resolve, reject) => {
            const auth = await GA.createConnection();
            const authorizeUrl = await GA.getConnectionUrl(auth);
            resolve({
                url: authorizeUrl
            });
        });
    },

    /**
     * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
     */
    getGoogleAccountFromCode: async function (code) {

        const auth = await GA.createConnection();
        const data = await auth.getToken(code);
        const tokens = data.tokens;
        await auth.setCredentials(tokens);

        const people = GA.getGooglePeopleApi(auth);
        const me = await people.people.get({
            resourceName: 'people/me',
            personFields: 'emailAddresses,names,photos',
        });
        return me.data;

    },
};