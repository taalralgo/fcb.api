const mongoose = require('mongoose');
const {
    errorMessage,
    permissionDenied,
    removeFile
} = require('./controllerHelper');
const Live = mongoose.model('Live');
const M3U8FileParser = require('m3u8-file-parser');
const fs = require("fs");

exports.getAll = async (req, res) => {
    try {
        const lives = await Live.find().sort({name: 'asc'});
        return res.send({status: true, data: lives, total: lives.length});
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}

exports.create = async (req, res) => {
    try {
        const {name, url, group, premium, description} = req.body;
        const live = new Live();
        live.name = name;
        live.url = url;
        live.group = group;
        live.premium = premium;
        live.description = description;
        if (req.files && req.files[0]) {
            live.image = req.files[0].filename
        }
        await live.save();
        res.status(200).json({status: true, msg: "Live created successfully."});
    } catch (error) {
        console.log(error);
        removeFileIfError(req);
        res.status(200).json({status: false, msg: "Something went wrong. Please try again"});
    }
}

exports.import = async (req, res) => {
    try {
        const filename = __dirname + '/../public/' + req.files[0].filename;
        const content = fs.readFileSync(filename, {encoding: 'utf-8'});
        const reader = new M3U8FileParser();
        reader.read(content);
        reader.getResult();
        const result = reader.getResult();
        await Live.deleteMany();
        let nbre = 0;
        for (var i = 0; i < result.segments.length; i++) {
            const name = result.segments[i].inf.tvgName.toLowerCase();
            // if (name === 'sport french' || name === 'rmc' || name === 'tf1' || name === 'canal + sport' || name === 'canal+ sport'
            //     || name === 'canal+' || name ==='france sport')
            if(result.segments[i].inf.groupTitle.toUpperCase() === 'FRANCE SPORT')
            {
                console.log(name)
                const tv = result.segments[i].inf;
                const url = result.segments[i].url;
                const description = `La chaine officielle ${tv.tvgName} | ${tv.groupTitle}`;
                const live = new Live();
                live.image = tv.tvgLogo;
                live.name = tv.title.toUpperCase();
                live.url = url.replace('.ts', '.m3u8');
                live.group = tv.groupTitle;
                live.premium = false;
                live.description = tv.tvgName;
                await live.save();
                nbre++;
            }
        }
        reader.reset();
        res.status(200).json({status: true, msg: "Live imported successfully.", nbre});
        removeFileIfError(req);
    } catch (error) {
        console.log(error);
        removeFileIfError(req);
        res.status(200).json({status: false, msg: "Something went wrong. Please try again"});
    }
}

const removeFileIfError = (req) => {
    if (req.files && req.files[0]) {
        removeFile(req.files[0].filename);
    }
}