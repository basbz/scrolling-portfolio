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

  function pick (keys, obj, acc) {
    return keys.reduce(function (acc, key) {
      acc[key] = obj[key];
      return acc;
    }, acc || {});
  }

  function where (spec) {
    return function (target) {
      for(var key in spec) {
        if(!target.hasOwnProperty(key) || target[key] !== spec[key])
          return false;
      }

      return true;
    };
  }

  function find(fn, arr) {
    for(var i = 0, len = arr.length; i < len; i++) {
      if(fn(arr[i]) === true)
        return arr[i];
    }
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

  function resize_thumbs (items, size) {
    var offset = 24;

    return items.map(function (item) {
      item.width = size;
      item.offset = offset;
      offset += size;
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

  function main (items, thumbs) {
    var current_range;

    $(document).ready(function () {
      View.mount({
        switchTab: function (cid, tabIndex, callback) {
          var item = find(where({cid: cid}), items);

          if(item) {
            item.tabIndex = tabIndex;
            callback(item);
          }
        },

        resize: function (spec, callback) {
          var range = select(resize_items(items), spec);

          current_range = range;

          return callback({
            thumbs: resize_thumbs(thumbs, 312),
            items: items.slice(range.start, range.end + 1),
            last_item: last(items),
            last_thumb: last(thumbs)
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
      },$('#content'), $('#nav'));
    });
  }

  $.getJSON('/data/index.json').then(function (json) {
    var items = [], thumbs = [], index = 0;

    json.forEach(function (proj) {
      var c = cid();

      items.push(pick(['id', 'name', 'caption'], proj, {
        cid: c,
        type: 'proj',
        tabIndex: 0
      }));

      thumbs.push(pick(['id', 'name', 'caption'], proj, {
        cid: c,
        type: 'proj'
      }));

      proj.assets.forEach(function (asset) {
        var c = cid();
        index++;

        if(asset.src) {

          items.push(pick(['id', 'name', 'src', 'src_w', 'src_h', 'type'], asset, {
            cid: c,
            index: index
          }));

          thumbs.push(pick(['id', 'name', 'ico', 'ico_w', 'ico_h', 'type'], asset, {
            index: index,
            p_name: proj.name,
            p_caption: proj.caption,
            cid: c
          }));
        }
      });
    });

    return main(items, thumbs);
  });
});
