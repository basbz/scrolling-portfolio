require.config({
  baseUrl: "/scripts",
  paths: {
    handlebars: '/bower_components/handlebars/handlebars.amd'
  }
});

define(['view'], function (View) {
  var log = window.log = console.log.bind(console);

  function buffer () {
    cancelAnimationFrame(handle);

    handle = requestAnimationFrame(function () {
      ItemStore.scroll($(window).scrollLeft() || 0);
    });
  }

  var cid = (function init_cid (__c) {
    return function cid () {
      return 'c-' + (++__c);
    };
  }(0));

  function add (data) {
    store.push(_.extend(data, {
      cid: cid(),
      index: ++__index
    }));
  }

  function extract_project (proj) {
    return {
      id: proj.id,
      cid: cid(),
      type: 'proj',
      name: proj.name,
      caption: proj.caption,
      tabIndex: 0
    };
  }

  function extract_asset (asset) {
    asset.cid = cid();
    return asset;
  }

  function extract_items (projects) {
    return projects.reduce(function (acc, proj) {

      acc.push(extract_project(proj));

      return proj.assets.reduce(function (acc, asset) {
        if(asset.type === 'img' && asset.src) {
          acc.push(extract_asset(asset));
        }

        return acc;

      }, acc);
    }, []);
  }

  function resize_image (img) {
    var size = 480;

    if(img.src_h > img.src_w) {
      img.height = size;
      img.width = Math.round(img.src_w * (size / img.src_h));
      return img;
    }

    img.width = size;
    img.height = Math.round(img.src_h * (size / img.src_w));
    return img;
  }

  function resize_items (items) {
    var offset = 0;

    return items.map(function (item, index) {
      item.offset = offset;

      if(item.type === 'img'){
        item = resize_image(item);
        offset += item.width + 84;
      } else {
        item.width = 564;
        offset += item.width;
      }

      return item;
    });
  }

  function last (arr) {
    return arr[arr.length - 1];
  }

  function select (items, spec) {
    var item, start = 0,
        limit = spec.offset + spec.limit;

    for(var i = 0, len = items.length; i < len; i++) {
      item = items[i];

      if(item.offset <= spec.offset)
        start = i;

      if(item.offset > limit)
        return {start: start, end: i};

    }

    return {start: start, end: items.length};
  }

  function diff_fwd (a, b) {
    return {
      add: {start: a.end, end: b.end},
      del: {start: a.start, end: b.start}
    };
  }

  function diff_bwd (a, b) {
    return {
      add: {start: b.start, end: a.start},
      del: {start: a.end, end: b.end}
    };
  }
  //$(window).on('scroll', buffer);
  $.getJSON('/data/index.json').then(function (json) {
    var current_range, items = extract_items (json);

    $(document).ready(function () {
      View.mount({
        resize: function (spec, callback) {
          var range = select(resize_items(items), spec);

          current_range = range;

          return callback({
            items: items.slice(range.start, range.end + 1),
            last_item: last(items)
          });
        },

        update: function (spec, callback) {
          var pacth, dir, range = select(items, spec);

          if(current_range.start > range.start) {
            dir = 'bwd';
            patch = diff_bwd(current_range, range);
          } else {
            dir = 'fwd';
            patch = diff_fwd(current_range, range);
          }

          current_range = range;

          return callback({
            dir: dir,
            items: {
              add: items.slice(patch.add.start, patch.add.end),
              del: items.slice(patch.del.start, patch.del.end)
            }
          });
        }
      },$('#content'));
    });
  });
});
