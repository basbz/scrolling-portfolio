define(['handlebars'], function (Handlebars) {
  return ['project', 'image', 'project-thumb', 'image-thumb'].reduce(function (acc, key) {
    acc[key] = Handlebars.default.compile($('#'+ key + '-template').text());
    return acc;
  }, {});
});
