const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const {Subscriber} = require('../models/Subscriber');

let storage = multer.diskStorage({
    destination:(req,file, cb) => {
        cb(null, "uploads/");
    },
    filename : (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter:(req, file, cb) => {
        const ext = path.extname(file.originalname);
        if(ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false)
        }
        cb(null, true)
    }
})

const upload = multer({storage:storage}).single("file");


//=================================
//             Video
//=================================


router.post('/uploadfiles', (req, res) => {

    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err) {
            return res.json({success:false, err});
        }
        return res.json({success:true, url:res.req.file.path, filename : res.req.file.filename})
    })

});


router.post('/thumbnail', (req, res) => {


    let filePath = ""
    let fileDuration = ""
    console.log(req.body.url);
    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.url) // 경로
    .on('filenames', function(filenames) { // 썸네일의 파일네임 생성
        console.log('will generate' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function() {
        console.log('Screenshots taken');
        return res.json({success:true,
        url:filePath,
        fileDuration:fileDuration}) // 비디오의 러닝타임
    }) // 썸네일 생성하고 무엇을 할것인지
    .screenshots({
        count : 3, // 3개의 썸네일을 찍을 수 있음
        folder : 'uploads/thumbnails', // 이 폴더에 썸네일이 저장될 것임
        size : '320x240',
        filename : 'thumbnail-%b.png' // %b는 확장자를 뺀 원래 이름
    }) 
});


router.post('/uploadVideo', (req, res) => {

    // 비디오 정보들을 저장한다.
    
    const video = new Video(req.body);

    video.save((err, doc) => {
        if(err) return res.json({success:false, err:err});
        res.status(200).json({success:true});
    });

});


router.get('/getVideos', (req, res) => {

    // 비디오를 DB에서 가져와서 클라이언트에 보냄.

    Video.find()
    .populate('writer') // writer 정보도 가져옴
    .exec((err, videos) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({success:true, videos})
    });
    

});

router.post('/getVideoDetail', (req, res) => {

    // 비디오를 DB에서 가져와서 클라이언트에 보냄.

    Video.findOne({"_id":req.body.videoId})
    .populate('writer') // writer 정보도 가져옴
    .exec((err, videoDetail) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({success:true, videoDetail})
    });
    

});

router.post('/getSubscriptionVideos', (req, res) => {

    // 구독하는 사람들을 먼저 찾고
    Subscriber.find({userFrom:req.body.userFrom})
    .exec((err, subscriberInfo) => {
        if(err) return res.status(400).send(err);

        let subscribedUser = [];
        subscriberInfo.map((subscriber, i) => {
            subscribedUser.push(subscriber.userTo);
        })

        // 찾은 사람들의 비디오를 가지고옴
        Video.find({'writer': {$in:subscribedUser}})
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({success : true, videos});
        })
    })
    

    
});

module.exports = router;
