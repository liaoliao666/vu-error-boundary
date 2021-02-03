if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/vu-error-boundary.production.min.js')
} else {
  module.exports = require('./dist/vu-error-boundary.development.js')
}
