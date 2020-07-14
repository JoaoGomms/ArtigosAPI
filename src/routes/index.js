const {Router} = require('express');
const router = Router();
const admin = require("firebase-admin");


let serviceAccount = require('../../firebasesdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();


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


router.post('/new-article', (req, res) => {

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
