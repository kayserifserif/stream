if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const Twitter = require('twitter-lite');
const needle = require('needle');

const indexRouter = require('./routes/index');
const fluidRouter = require('./routes/fluid');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/fluid', fluidRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// const client = new Twitter({
//   version: "2",
//   extension: false,
//   consumer_key: process.env.TWITTER_CONSUMER_KEY,
//   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//   access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
//   access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
// });

// const stream = client.stream("statuses/filter", {
//     track: 'i wonder'
//   })
// const stream = client.stream()
//   .on("start", response => console.log("start"))
//   .on("data", tweet => console.log("data", tweet.text))
//   .on("ping", () => console.log("ping"))
//   .on("error", error => console.log("error", error))
//   .on("end", response => console.log("end"));
  
// referencing:
// https://github.com/twitterdev/Twitter-API-v2-sample-code/blob/master/Filtered-Stream/filtered_stream.js
// https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/quick-start
// https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/integrate/build-a-rule

// (async () => {

//   const response = await needle('post', 'https://api.twitter.com/2/tweets/search/stream/rules',
//     {
//       "add": [
//         { "value": '"i wonder" -is:retweet -is:reply -is:quote -has:mentions -has:media -has:images -has:videos -has:links -has:hashtag' }
//       ]
//     },
//     {
//       headers: {
//         "content-type": "application/json",
//         "authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
//       }
//     });

//   const stream = needle.get('https://api.twitter.com/2/tweets/search/stream', {
//     headers: {
//       Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
//     }
//   }, { timeout: 20000 });

//   stream
//     .on('data', data => {
//       try {
//         const json = JSON.parse(data);
//         if (json.data.text.substring(0, 2) === "RT") return;
//         if (json.data.text.substring(0, 1) === "@" ) return;
//         console.log(json.data.text);
//       } catch (e) {
//         // Keep alive signal received. Do nothing.
//       }
//     })
//     .on('error', error => {
//       if (error.code === 'ETIMEDOUT') {
//         stream.emit('timeout');
//       }
//     })
//     .on('timeout', () => {
//       console.warn('A connection error occurred.');
//     });

// })();

module.exports = app;