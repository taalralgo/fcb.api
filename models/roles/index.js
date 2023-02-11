const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*********************
 * Define User Model *
 *********************/
const roleSchema = new Schema({
  name: { type: String },
});

mongoose.model("Role", roleSchema);
