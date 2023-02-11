const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

/*********************
 * Define User Model *
 *********************/
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  token: { type: String },
});

/**********************************
 * On save hook, encrypt password *
 **********************************/
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });

});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

userSchema.virtual('roleInfo', {
  ref: 'Role',
  localField: 'role',
  foreignField: '_id',
  justOne: true
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });
/**************************
 * Create the model class *
 **************************/
mongoose.model("User", userSchema);
