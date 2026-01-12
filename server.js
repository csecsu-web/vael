require('dotenv').config();
const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use(require('./middleware'));

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/home'));
app.use('/', require('./routes/today'));
app.use('/', require('./routes/week'));
app.use('/', require('./routes/month'));
app.use('/', require('./routes/lifeos'));
app.use('/', require('./routes/export'));
app.use('/', require('./routes/export-md'));
app.use('/', require('./routes/delete'));

app.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});
