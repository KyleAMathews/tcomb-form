'use strict';

// here requires must be dynamic since there is a circular
// dependency between getComponent and the components
function getComponent(type, options) {
  switch (type.meta.kind) {
    case 'irreducible' :
      return require('./components/Textbox');
    case 'struct' :
      return require('./components/Struct');
    case 'enums' :
      return require('./components/Select');
    case 'list' :
      return require('./components/List');
    case 'maybe' :
    case 'subtype' :
      return getComponent(type.meta.type, options);
  }
}

module.exports = getComponent;