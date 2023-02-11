const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slug');

const liveSchema = new Schema({
  image: {type: String},
  slug: {type: String},
  name: {type: String, required: true},
  url: {type: String, required: true},
  group: {type: String},
  premium: {type: Boolean, required: true},
  description: {type: String},
});

liveSchema.pre('save', function (next) {
  const live = this;
  live.slug = slug(live.name);
  return next();
});

liveSchema.set('toObject', {virtuals: true});
liveSchema.set('toJSON', {virtuals: true});

mongoose.model("Live", liveSchema);