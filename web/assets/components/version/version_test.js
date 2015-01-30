'use strict';

describe('fydp.version module', function() {
  beforeEach(module('fydp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
