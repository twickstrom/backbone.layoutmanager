var fs = require("fs");
var util = require("util");

var Backbone = require("backbone");
var _ = require("backbone/node_modules/underscore");
var def = require("underscore.deferred");

// Hacky way to get layoutmanager to load with the correct globals
(function() {

  eval(fs.readFileSync(__dirname +
    "/../backbone.layoutmanager.js").toString());

  // Ensure Backbone doesn't ensureElement
  Backbone.View.prototype._ensureElement = function() {
    this.el = { innerHTML: "" };
  };

  Backbone.LayoutManager.configure({
    deferred: function() {
      return def.Deferred();
    },

    fetch: function(path) {
      var done = this.async();

      fs.readFile("./" + path, function(err, contents) {
        done(_.template(contents.toString()));
      });
    },

    when: function(promises) {
      return def.when.apply(null, promises);
    },

    render: function(template, context) {
      return template(context);
    },

    html: function(root, el) {
      return el;
    },

    partial: function(layout, name, template, append) {
      return template;
    },

    detach: function() {},
  });

}).call(_.extend(global, { Backbone: Backbone, _: _ }));

module.exports = Backbone.LayoutManager;
