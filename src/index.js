const app = require('./app');

app.listen(app.get('port'));
console.log('Serve on port ', app.get('port'));