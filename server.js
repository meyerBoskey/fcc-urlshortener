const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const port = process.env.PORT || 3000;
const ShortUrl = require('./models/shortUrl')
app.use(cors());

// Connect to mLab
mongoose.connect('mongodb://testUser:testPassword@ds157584.mlab.com:57584/cpsulli', {useMongoClient:true});

// ejs middleware
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/new/:urlToShort(*)', (req, res, next) => {
    let {urlToShort} = req.params;
    let regex = /[-a-zA-z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

    if(regex.test(urlToShort) === true) {
        let short = Math.floor(Math.random() * 100000).toString();
        let data = new ShortUrl({
            originalUrl: urlToShort,
            shortenedUrl: short
        });
        data.save(err => {
            if(err) res.send('Error saving to dataBase')
        });
        return res.json(data)
    }

    let data = new ShortUrl({
        originalUrl: urlToShort,
        shortenedUrl: "Invalid URL"
    });
    res.json(data);
});

app.get("/:urlToForward", (req, res, next) => {
    let urlToShort = req.params.urlToForward;
ShortUrl.find({'shortenedUrl': urlToShort}, (err, data) => {
        if(err) res.send('Error reading database');
        let re = new RegExp("^(http|https)://", "i");
        let strToCheck = data[0].originalUrl;
        if(re.test(strToCheck)) {
            res.redirect(301, strToCheck);
        }else {
            res.redirect(301, 'http://' + strToCheck);
        }
    });
 });

// Index route
app.get('/', (req, res) => {
    res.render('index');
});

// Start server
const server = app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
