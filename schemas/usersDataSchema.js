const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    username:   String,
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
    category:   {
                 type: Number,
                 default: undefined},                        
    expireDate: { 
                 type: Date,
                 default: undefined},
    disabled:   {
                 type: Boolean,
                 default: false},   
    activityDate:{ 
                 type: Date,
                 default: undefined},
    companyName:{ 
                 type: String,
                 default: undefined},
    servicePswd:{ 
                 type: String,
                 default: undefined},             
    contactPhones:{ 
                 type: [String],
                 default: undefined},   
    notes:      { 
                 type: String,
                 default: undefined},
    deviceLimit:{ type: Number, 
                 default: 0 },
    devicePswd: { type: String, 
                 default: undefined},
    rcvAllPacketsMode:{ type: Boolean,
                 default: undefined },                 
    firstPacketSpecialMode:{ type: Boolean,
                 default: undefined },                     

});

// compile schema to model
//const AccountData = mongoose.model('AccountData', accountSchema,'UserCollection')
//module.exports=AccountData;
module.exports=accountSchema;