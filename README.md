# nodejs-exiftool

Node.js integration for Phil Harvey's ExifTool, deployed to Heroku.

## Setup

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Click on "Deploy to Heroku" button above and follow the instructions:
* Enter an application name
* Choose a region
* Update config vars or leave default values

#### Creating an app without a name

*The app name argument is optional. If no app name is specified, a random name will be generated.
Since Heroku app names are in a global namespace, you can expect that common names, like “blog” or “wiki”, will already be taken. It’s often easier to start with a default name and rename the app later.*

### Local environment

1) Install Javascript dependencies (via yarn or npm)

2) Create .env file with required params, point EXIFTOOL_PATH to your local exiftool instance.

3) Start the application

## Resources

https://www.sno.phy.queensu.ca/~phil/exiftool/

https://www.npmjs.com/package/node-exiftool

https://github.com/heroku/node-js-getting-started

https://devcenter.heroku.com/articles/getting-started-with-nodejs