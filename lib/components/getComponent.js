'use strict';

// here requires must be dynamic since there is a circular
// dependency between getComponent and components
function getComponent(type, options) {
  var kind = type.meta.kind;
  switch (kind) {
    case 'irreducible' :
      return require('./Textbox');
    case 'struct' :
      return require('./Struct');
    case 'list' :
      return require('./List');
  }
}

module.exports = getComponent;