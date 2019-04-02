require('dotenv').config();

const config = {
    app: {
        port: process.env.PORT,
        defaultPollInterval: process.env.POLL_INTERVAL_MILLI || 180000
    },
    mongo: {
        connectString: process.env.MONGODB_URI
    },
    session: {
        secret: process.env.SESSION_SECRET
    },

}

module.exports = config;