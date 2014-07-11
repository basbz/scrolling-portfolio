define(['state-machine'], function (StateMachine) {
  var machine = StateMachine({
    small: {
      projWidth: function () {
         return 564;
      },

      imgWidth: function () {
        return {size: 420, spacing: 84};
      },

      navWidth: function () {
      }
    }
  });

  machine.setState('small');

  return machine;
});
