define(['react'], function (React) {
  return React.createClass({
    getInitialState: function () {
      return {activeMenuItem: 0};
    },

    title: function () {
      var title_parts = _.flatten(_.map([this.props.name, this.props.caption], function (part) {
        if(part)
          return [part, React.DOM.br()];
        return [];
      }));

      if(title_parts.length)
        return title_parts.concat([React.DOM.br(), React.DOM.br()]);

      return title_parts;
    },

    menuItems: function () {
      return _.map([
        {id: 'project', name: 'Project'},
        {id: 'index', name: 'Index'},
        {id: 'profile', name: 'Profiel'},
        {id: 'contact', name: 'Contact'}
      ], function (item) {
        item.active = false;
        return item;// this.menuItemTemplate(item);
      }).map(function (menu, index) {
        if(index === this.state.activeMenuItem)
          return [React.DOM.span({}, menu.name), React.DOM.br()];

        return [React.DOM.a({
          href: '#' + menu.name,
          'data-tab-id': index
        }, menu.name), React.DOM.br()];
      }, this);
    },

    render: function () {
      return React.DOM.div({
        'data-cid': this.props.cid,
        className: 'item',
        style: {left: this.props.offset}
      },
        React.DOM.header({}, 'Andrea Ronhaar \u2014   Grafish ontwerp'),
        React.DOM.br({style: {clear: 'both'}}),
        React.DOM.p({className: 'menu'}, this.menuItems()),

        React.DOM.p({}, React.DOM.span(
          {className: 'title'}, this.title()
        ), this.props.content)
      );
    }
  });
});
