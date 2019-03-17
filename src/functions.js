'use strict';

const logger = require('heroku-logger');

require('dotenv').config();

const {
  NODE_ENV,
  APP_DOMAIN = '',
  PUBLIC_DOMAIN = ''
} = process.env;

/**
 * Determines if default Heroku app domain is invoked on Production
 *
 * @param {Object} [req] Request object
 * @return {Boolean}
 * @private
 */
const isAppDomainOnProduction = (req) => ((
  APP_DOMAIN !== '' &&
    PUBLIC_DOMAIN !== '' &&
    req.headers.host === APP_DOMAIN
));

/**
 * Determines if a non secure url is requested on production
 *
 * @param {Object} [req] Request object
 * @return {Boolean}
 * @private
 */
const isNonSecurePublicDomainOnProduction = (req) => ((
  PUBLIC_DOMAIN !== '' &&
    req.headers.host === PUBLIC_DOMAIN &&
    req.header('x-forwarded-proto') !== 'https'
));

/**
 * Force using HTTPS on Staging and Production
 *
 * @param {Object} [req] Request object
 * @param {Object} [res] Response object
 * @param {Object} [next] Middleware callback
 * @public
 */
const forceDomainSSL = (req, res, next) => {
  switch(NODE_ENV) {
  case 'local':
    // @TODO
    next();
    break;
  case 'review':
  case 'staging':
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(302, `https://${req.headers.host}${req.originalUrl}`);
    }
    else {
      next();
    }
    break;
  case 'production':
    if (isAppDomainOnProduction(req)) {
      res.redirect(302, `https://${PUBLIC_DOMAIN}${req.originalUrl}`);
    }
    else if (isNonSecurePublicDomainOnProduction(req)) {
      logger.info(`Insecure request to ${PUBLIC_DOMAIN}`);
      res.redirect(302, `https://${req.headers.host}${req.originalUrl}`);
    }
    else next();
    break;
  default:
    next();
  }
};

module.exports = {
  forceDomainSSL
};