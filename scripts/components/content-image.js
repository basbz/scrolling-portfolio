define(['react'], function (React) {
  return React.createClass({
    render: function () {
      return React.DOM.div({
        cid: this.props.cid,
        className: 'image-item',
        style: {left: this.props.offset}
      }, React.DOM.div({className: 'content ' + this.props.orientation},
        React.DOM.div({
          style: {
            background: '#efefef',
            width: this.props.dim.width,
            height: this.props.dim.height
          }, className: 'image'}//,
          //React.DOM.img({
            //width: this.props.dim.width,
            //height: this.props.dim.height,
            //src: '//basbenzineb.nl/bucket/images/' + this.props.src
          //})
        ),
        React.DOM.div({className: 'index'}, this.props.index)
      ));
    }
  });
});
