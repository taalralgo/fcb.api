const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slug');

const VideoSchema = new Schema({
    image: {type: String, comment: "thumbnail de la video"},
    name: {type: String, required: true},
    slug: {type: String},
    url: {type: String, required: true},
    type: {type: String, required: true},
    videoId: {type: String, comment: "If video type is youtube"},
    createdAt: {type: Date, default: Date.now()},
});

VideoSchema.pre('save', function (next) {
    const video = this;
    video.slug = slug(video.name);
    if (video.type === 'youtube') {
        video.image = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
    }
    return next();
});

VideoSchema.set('toObject', {virtuals: true});
VideoSchema.set('toJSON', {virtuals: true});

mongoose.model("Video", VideoSchema);