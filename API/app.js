// require express to use expressapp
const express = require('express');
const session = require('express-session');
const app = express();
//require mysql2
const mysql = require('mysql2');

//allow for getting only single data from the form
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 1,
        },
    })
);

app.listen(5000);

app.get('/set', (req, res) => {
    req.session.username = 'Johndoe';
    res.send('Session data set! go to /get to retrieve it' + req.session.username)
});

app.get('/get', (req, res) => {
    const username = req.session.username;
    res.send(`Hello ${username ? username : 'stranger'}`);
})