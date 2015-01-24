'use strict';

var api = require('./api');

var i18n = new api.I18n({
  optional: ' (optional)',
  add: 'Add',
  remove: 'Remove',
  up: 'Up',
  down: 'Down'
});

module.exports = {
  i18n: i18n,
  transformers: {
    Num: new api.Transformer({
      format: function (value) {
        return Nil.is(value) ? value : String(value);
      },
      parse: function (value) {
        var n = parseFloat(value);
        var isNumeric = (value - n + 1) >= 0;
        return isNumeric ? n : value;
      }
    })
  }
};