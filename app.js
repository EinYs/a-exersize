const express = require('express');
const router = require('./routes/index')

const app = express()

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/', router)

app.set('port', 3000)

app.listen(app.get('port'), function(err){
    console.log('Server is listening at port', app.get('port'))
})