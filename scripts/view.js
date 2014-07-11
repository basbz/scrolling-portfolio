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

  function redraw_proj (item) {
    $('#content > [data-cid="'+ item.cid +'"]').replaceWith(draw_proj(item));
  }


  function draw_item (item) {
    if(item.type === 'img')
        return draw_image(item);

    return draw_proj(item);
  }

  function draw (items, $el) {
    $el.html(items.map(draw_item).join(''));
  }

  function draw_thumbs (items, $el) {
    $el.html(items.map(function (item) {
      if(item.type === 'img')
       return Templates['image-thumb'](item);

     return Templates['project-thumb'](item);
    }).join(''));
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
    mount: function (store, $content, $thumbs) {
      var win_bounds = bounds.bind(null, $(window)), content_width, thumbs_width;

      store.resize(win_bounds(), function (spec) {
        content_width = spec.last_item.offset + spec.last_item.width;
        thumbs_width = spec.last_thumb.offset + spec.last_thumb.width;
        stretch($content, content_width);
        draw(spec.items, $content);
        draw_thumbs(spec.thumbs, $thumbs);
      });

      $(window).on('scroll', function () {
        var w_bounds = win_bounds(),
            f =  w_bounds.offset/ (content_width - w_bounds.limit);

        $thumbs.css('left', -Math.round((thumbs_width - w_bounds.limit) * f));

        store.update(w_bounds, function (spec) {
          redraw($content, spec.items, spec.dir);
        });
      });

      $('body').on('click', '[data-menu]', function (e) {
        var cid, index, $this = $(this);
        e.preventDefault();

        index = Number($this.attr('data-menu'));
        cid = $this.closest('[data-cid]').attr('data-cid');

        store.switchTab(cid, index, redraw_proj);
      });
    }
  };
});
