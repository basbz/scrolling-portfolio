define(['templates'], function (Templates) {
  function draw_image (item) {
    return Templates.image(item);
  }

  function draw_proj (item) {
    item.tabs = [
      {id: 'project', name: 'Project'},
      {id: 'index', name: 'Index'},
      {id: 'profile', name: 'Profiel'}
    ];

    var title = [];
    if(item.name)
      title.push(item.name);

    if(item.caption)
      title.push(item.caption);

    item.title = title.join('<br>');

    item.tabs[item.tabIndex].active = true;

    item.content = 'Project Content';

    return Templates.project(item);
  }

  function draw_item (item) {
    if(item.type === 'img')
        return draw_image(item);

    return draw_proj(item);
  }

  function draw (items, $el) {
    $el.html(items.map(draw_item).join(''));
  }

  function redraw ($el, items, dir) {
    items.del.forEach(function (item) {
      $el.find('[data-cid="' + item.cid + '"]').remove();
    });

    if(dir === 'fwd')
      return items.add.forEach(function (item) {
        $el.append(draw_item(item));
      });

     items.add.reverse();
     items.add.forEach(function (item) {
        $el.prepend(draw_item(item));
      });
  }

  function stretch ($el, width) {
    $el.css('width', width);
  }

  function bounds ($el) {
    return {
      offset: $el.scrollLeft() || 0,
      limit: $el.width()
    };
  }



  return {
    mount: function (store, $content) {
      var win_bounds = bounds.bind(null, $(window));

      store.resize(win_bounds(), function (spec) {
        stretch($content, spec.last_item.offset + spec.last_item.width);
        draw(spec.items, $content);
      });

      $(window).on('scroll', function () {
        store.update(win_bounds(), function (spec) {
          redraw($content, spec.items, spec.dir);
        });
      });
    }
  };
});
