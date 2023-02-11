const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slug');

const newsSchema = new Schema({
    image: {type: String, required: true},
    slug: {type: String},
    name: {type: String, required: true},
    content: {type: String, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    publishAt: {type: Date, default: Date.now(), required: true},
});

newsSchema.pre('save', function (next) {
    const news = this;
    news.slug = slug(news.name);
    return next();
});

newsSchema.virtual('categoryInfo', {
    ref: 'Category',
    localField: 'category',
    foreignField: '_id',
    justOne: true
});

newsSchema.set('toObject', {virtuals: true});
newsSchema.set('toJSON', {virtuals: true});

mongoose.model("News", newsSchema);
