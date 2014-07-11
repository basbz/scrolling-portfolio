define(['lodash'], function (_) {

  function getMethods (states) {
    return _.reduce(states, function (methods, state) {
      return methods.concat(_.filter(_.keys(state), function (m) {
        return _.indexOf(methods, m) === -1;
      }));
    }, []);
  }

  function Machine (states, context) {
    this.states = states;
    this.context = context || {};

    _.each(getMethods(states), function (e) {
      this[e] = _.bind(Machine.prototype.handleEvent, this, e);
    }, this);
  }

  Machine.prototype = {
    handleEvent: function (e) {
      if(this.states[this.__state] && this.states[this.__state][e])
        return this.invoke(this.states[this.__state][e], _.rest(arguments));
    },

    setState: function (state) {
      this.__state = state;
    },

    invoke: function (fn, args) {
      args.unshift(this);

      return fn.apply(this.context, args);
    }
  };

  return function (states, context) {
    return new Machine(states, context);
  };
});
