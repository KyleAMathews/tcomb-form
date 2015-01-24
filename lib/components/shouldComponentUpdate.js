'use strict';

module.exports = function (nextProps, nextState) {
  return nextProps.type !== this.props.type ||
    nextProps.options !== this.props.options ||
    nextProps.value !== this.props.value ||
    nextState.hasError !== this.state.hasError
};