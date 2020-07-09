const { Router } = require('express');
const router = Router();
const admin = require("firebase-admin");

let serviceAccount = require('../../firebasesdk.json');

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();


router.get('/', (req, res) => {

    db.collection('Artigos').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                res.render('index', {articles: doc.data()});
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });

// res.render('index');


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
