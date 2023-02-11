const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slug')

const categorySchema = new Schema({
  image: { type: String },
  name: { type: String, unique: true, required: true },
  slug: { type: String, unique: true, required: true },
});

categorySchema.pre('save', function (next) {
  const category = this;
  category.slug = slug(category.name);
  return next();

});

categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

mongoose.model("Category", categorySchema);
