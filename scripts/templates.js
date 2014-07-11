define(['handlebars'], function (Handlebars) {
  return ['project', 'image'].reduce(function (acc, key) {
    acc[key] = Handlebars.default.compile($('#'+ key + '-template').text());
    return acc;
  }, {});
});
