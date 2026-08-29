const mongoose = require('mongoose');

const FmUserSchema = mongoose.Schema({
    _id:      mongoose.SchemaTypes.ObjectId,
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

    
});
// compile schema to model
//const FmUser = mongoose.model('FmUser', FmUserSchema,'UserCollection')
//module.exports=FmUser;
module.exports=FmUserSchema;