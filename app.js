const express = require('express');
const router = require('./routes/index')

const app = express()

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const SERVER_URL = 'localhost'
app.use((req, res, next) => {
    if (req.get('origin').includes(SERVER_URL)) {
        res.header("Content-Type", "text/html");
        res.header('Access-Control-Allow-Origin', `${req.get('origin')}`);        // localhost로부터의 요청에 응답한다
        res.header('Access-Control-Allow-Methods', 'PUT, DELETE');
        res.header('Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    }

    if (req.method === 'OPTIONS') { res.sendStatus(200); return; } next();
});


app.use('/', router)

app.set('port', 3000)

app.listen(app.get('port'), function (err) {
    console.log('Server is listening at port', app.get('port'))
})