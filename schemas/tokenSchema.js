const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TokenSchema = Schema({
    value: {type: String,
            required: true
    },
    createDate: {type: Date, default: Date.now},
    user:   {type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
    }
});

//const Token = mongoose.model("Token", TokenSchema,"tokens");
//module.exports = Token;
module.exports = TokenSchema;