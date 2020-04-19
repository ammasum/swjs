const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type: '*/*'}));

app.all('*', (req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Request-Headers", "*");
    res.set("Access-Control-Allow-Headers", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    next();
});

app.get('/post', (req, res) => {
    const post = [
        {
            name: "Masum change respose",
            title: "Hello world"
        },
        {
            name: "Emad",
            title: "Hello world"
        }
    ];
    res.send(post);
});

app.post('/createPost', (req, res) => {
    res.send([req.body]);
});

app.listen(8080, () => {
    console.log('server start at http://localhost:8080');
});
