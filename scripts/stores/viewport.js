define(function () {
  var offset = 0, width;

  return {
    width: function () {
      width = width || $('body').innerWidth() + 120;

      return width;
    },

    offset: function () {
      return offset;
    }
  };
});
