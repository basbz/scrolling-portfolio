define([
  'react',
  'stores/item',
  'components/content-project',
  'components/content-image'
], function (React, ItemStore, ProjComp, ImgComp) {
  var Dom = React.DOM;

  function createComponent(item) {
    if(item.type === 'proj')
      return ProjComp(item);

    return ImgComp(item);
  }

  return React.createClass({
    render: function () {
      var attr = {
        className: 'content-items',
        style: {width: this.props.width || 0}
      };

      return React.DOM.div(attr, ItemStore.findItem().map(createComponent));
    }
  });
});
