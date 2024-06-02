//imports
const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

//loads then log the app
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})