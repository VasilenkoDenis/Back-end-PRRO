const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    email:      String,
    rememberMe: {
                type:Boolean,    
                default: false},
    hash:       {
                 salt: String,
                 passwordHash: String},
    confirmed:  {
                 type: Boolean,
                 default: false},  
    regdate:    {
                 type: Date,
                 default: undefined},                        
    isAdmin:    {
                type: Boolean,
                default: false}, 
    token:      {
                type: String, 
                default: undefined},           

});

// compile schema to model
//const User = mongoose.model('User', userSchema,'UserCollection')
//module.exports=User;
module.exports=userSchema;