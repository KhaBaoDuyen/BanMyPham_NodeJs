const _ = require("lodash");

function sanitizeInput(data) {
      return {
            name: _.trim(data.name),
            email: _.trim(data.email),
            password: _.trim(data.password),
      }
}
module.exports = sanitizeInput;