const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const flash = require('connect-flash');
const config = require('./config');
const processJob = require('./modules/latency/background-service');

require('./config/passport')(passport);
const authenticated = require('./middleware/authenticated');


const app = express();
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const monitorRoutes = require('./routes/monitor');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/assets', express.static(path.join(__dirname, 'assets')));


app.use(session({
    secret: config.session.secret,
    saveUninitialized: true,
    resave: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    if(req.user){
        res.locals.userDetails = {
            name: req.user.firstName,
            email: req.user.email
        }
    }
    next();
});


app.use('/', authRoutes(passport));
app.use('/dashboard', authenticated, dashboardRoutes);
app.use('/service-watcher', authenticated, monitorRoutes);



const port = config.app.port || 5000;

app.listen(port).on("listening", () => {
    console.log(`App running on port ${port}`)
});
