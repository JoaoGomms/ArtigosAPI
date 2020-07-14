const {Router} = require('express');
const router = Router();
const admin = require("firebase-admin");
const multer = require('multer');
const path = require('path');
const fs = require('fs');



let serviceAccount = require('../../firebasesdk.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "flutter-psychology.appspot.com"
});

let db = admin.firestore();
let bucket = admin.storage().bucket();



router.get('/',   async(req, res) => {

    const articlesSnapshot = await db.collection('Artigos').get();

    const articles = [];

    articlesSnapshot.forEach((doc) => {
        articles.push({
            id: doc.id,
            data: doc.data()

        });

    });

    res.render('index', {articles: articles})
});


function uploadPic (picName, picture) {

    bucket.upload(picture, {
        destination: "pic/" + picName,
        metadata: {
            contentType: picture.mimetype,
            cacheControl: 'public, max-age=31536000'
        }
    }, (err, file) => {
        if (err) {
            console.log("ESSE É O ERRO", err);
        } else {
            console.log('done');
        }
        return;
    });
};



const handleError = (err, res) => {
    console.log(err)

    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

const upload = multer({
    dest: 'temporary'
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});







router.post('/new-article', (req, res) => {

    upload.single("file" /* name attribute of <file> element in your form */),
        (req, res) => {
            const tempPath = req.file.path;
            const targetPath = path.join(__dirname, "./temporary/image.png");

            if (path.extname(req.file.originalname).toLowerCase() === ".png") {
                fs.rename(tempPath, targetPath, err => {
                    if (err) return handleError(err, res);

                    res
                        .status(200)
                        .contentType("text/plain")
                        .end("File uploaded!");
                });
            } else {
                fs.unlink(tempPath, err => {
                    if (err) return handleError(err, res);

                    res
                        .status(403)
                        .contentType("text/plain")
                        .end("Only .png files are allowed!");
                });
            }
        }


        uploadPic('imagem1',path.join(__dirname, "./temporary/image.png"))

    console.log(req.body);
    const newArticle = {
        title: req.body.title,
        subtitle: req.body.subtitle,
        conteudo: req.body.content,
        url: req.body.name,

    };
    db.collection('Artigos').add(newArticle)




    res.send('recebido');

});

module.exports = router;
