define(['lodash', 'rect', 'stores/viewport'], function (_, Rect, Viewport) {
  var __id = 0, __index = 0,
      store = [], bindings = [];

  function cid () {
    return 'c-' + (++__id);
  }

  function add (data) {
    store.push(_.extend(data, {
      cid: cid(),
      index: ++__index
    }));
  }

  function exex (binding) {
    binding.fn.apply(binding.context, _.rest(arguments));
  }

  function fire () {
    _.each(bindings, exec);
  }

  function image_width (dim) {
    return dim.width + Rect.imgWidth().spacing;
  }

  function image_dimension (img) {
    var size = Rect.imgWidth().size;

    if(img.src_h > img.src_w)
      return {
        height: size,
        width: Math.round(img.src_w * (size / img.src_h))
      };

    return {
      width: size,
      height: Math.round(img.src_h * (size / img.src_w))
    };
  }

  function visible_items () {
    var items = [], itemWidth,
        len = store.length,
        viewportOffset = 24 - Viewport.offset(),
        limit = Viewport.width(),
        off = 0;


    for(var i = 0; i < len; i ++) {
      item = store[i];
      itemWidth = item.width;

      if(viewportOffset + itemWidth < 0) {

      } else if (viewportOffset < limit) {
        item.offset = off;
        items.push(item);
      } else {
        break;
      }

      off += itemWidth;
      viewportOffset += itemWidth;
    }

    return items;
  }

  return {
    mount: function (projects) {
      _.each(projects, function (project) {
        project.type = 'proj';
        project.width = Rect.projWidth();
        add(_.omit(project, 'assets'));

        _.each(project.assets, function (asset) {
          if(asset.type === 'img' && asset.src) {
            asset.dim = image_dimension(asset);
            asset.width = image_width(asset.dim);
            add(asset);
          }
        });
      });
    },

    scroll: function (offset) {
      console.log(offset);
    },

    findItem: function () {
      return visible_items();
    },

    onChange: function () {
    }
  };
});
