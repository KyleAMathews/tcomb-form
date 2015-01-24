var t = require('tcomb-validation');
var Form = require('./components/Form');
var config = require('./config');
var debug = require('debug');

t.form = {
  Form: Form,
  config: config,
  debug: debug
};

module.exports = t;