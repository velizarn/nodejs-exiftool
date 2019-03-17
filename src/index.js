/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */

'use strict';

if (['staging', 'production'].includes(process.env.NODE_ENV)) {
  require('sqreen');
}

const throng = require('throng');

require('dotenv').config();

const WORKERS = process.env.WEB_CONCURRENCY || require('os').cpus().length;

const
  path = require('path'),
  express = require('express'),
  bodyParser = require('body-parser'),
  logger = require('heroku-logger'),
  helmet = require('helmet'),
  fs = require('fs'),
  exiftool = require('node-exiftool');

const {
  PORT = 5000,
  NODE_ENV,
  LOG_LEVEL,
  EXIFTOOL_PATH
} = process.env;

const {
  forceDomainSSL
} = require('./functions');

if (NODE_ENV !== 'test') {
  throng({
    workers: WORKERS,
    lifetime: Infinity,
    master: startMaster,
    start: startWorker
  });
} else {
  startWorker(1);
}

// This will only be called once
function startMaster() {
  logger.info('Started master');
}

function startWorker(workerId) {

  const ep = new exiftool.ExiftoolProcess(EXIFTOOL_PATH);

  const app = express();

  app.set('views', path.join(__dirname, 'src/views'));
  app.set('view engine', 'ejs');
  
  app.use(express.static('public'));
  app.use(forceDomainSSL);

  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.send(`${(new Date()).toLocaleString()} - ${req.header('host')}`);
  });

  app.get('/test/exif', (req, res) => {
    let imgPath = __dirname + '/../test/image.jpg';
    ep
      .open()
      .then(() => logger.info(`Started exiftool process ${workerId}`))
      .then(() => ep.readMetadata(imgPath, []))
      .then((data, err) => {
      
        if (data) {
        
          let orderedData = {};
        
          const unordered = data['data'][0];
        
          Object.keys(unordered).sort().forEach(function(key) {
            orderedData[key.toString()] = unordered[key.toString()];
          });
        
          res.send(`${JSON.stringify(orderedData, null, 2)}`);
        }
        if (err) {
          res.send(err);
        }
      })
      .then(() => ep.close())
      .then(() => logger.info('Closed exiftool'))
      .catch((err) => logger.error(err));
  });
  
  module.exports = app.listen(PORT, () => {
    logger.info(`Listening on ${PORT}, WEB_CONCURRENCY: ${workerId}, LOG_LEVEL: ${LOG_LEVEL}`);
  });
}