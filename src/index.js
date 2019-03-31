const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();
require('./middleware/passport-local-strategy')(passport);
const authenticated = require('./middleware/authenticated');


const app = express();
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const monitorRoutes = require('./routes/monitor');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(morgan('dev'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes(passport));
app.use('/dashboard', authenticated, dashboardRoutes);
app.use('/monitor', authenticated, monitorRoutes);


const port = process.env.PORT || 5000;

app.listen(port).on("listening", () => {
    console.log(`App running on port ${port}`)
});
