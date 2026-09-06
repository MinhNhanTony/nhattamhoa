var mongoose = require('mongoose');


var UserSchema = mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    phone: Number,
    password:String,
    level:Number,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('User', UserSchema);
