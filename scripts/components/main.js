define([
  'react',
  'stores/item',
  'components/content'
], function (React, ItemStore, ContentComp) {

  var comp, Comp = React.createClass({
    render: function () {
      return React.DOM.div({className: 'app'}, ContentComp());
    }
  });

  return {
    mount: function (el) {
      comp = React.renderComponent(Comp(), el);
    }
  };
});
