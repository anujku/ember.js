import MutableArrayTests from 'ember-runtime/tests/suites/mutable_array';
import MutableArray from 'ember-runtime/mixins/mutable_array';
import EmberObject from 'ember-runtime/system/object';
import {computed} from 'ember-metal/computed';

/*
  Implement a basic fake mutable array.  This validates that any non-native
  enumerable can impl this API.
*/
var TestMutableArray = EmberObject.extend(MutableArray, {

  _content: null,

  init: function(ary) {
    this._content = Ember.A(ary || []);
  },

  replace: function(idx, amt, objects) {

    var args = objects ? objects.slice() : [],
        removeAmt = amt,
        addAmt    = args.length;

    this.arrayContentWillChange(idx, removeAmt, addAmt);

    args.unshift(amt);
    args.unshift(idx);
    this._content.splice.apply(this._content, args);
    this.arrayContentDidChange(idx, removeAmt, addAmt);
    return this;
  },

  objectAt: function(idx) {
    return this._content[idx];
  },

  length: computed(function() {
    return this._content.length;
  }),

  slice: function() {
    return this._content.slice();
  }

});


MutableArrayTests.extend({

  name: 'Basic Mutable Array',

  newObject: function(ary) {
    ary = ary ? ary.slice() : this.newFixture(3);
    return new TestMutableArray(ary);
  },

  // allows for testing of the basic enumerable after an internal mutation
  mutate: function(obj) {
    obj.addObject(this.getFixture(1)[0]);
  },

  toArray: function(obj) {
    return obj.slice();
  }

}).run();
