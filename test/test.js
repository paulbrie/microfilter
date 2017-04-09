/* global describe it */
const assert = require('assert')
const Microfilter = require('../microfilter')

describe('Check the helpers', function () {
  describe('isString', function () {
    it('should return true for "a string"', function () {
      assert.equal(Microfilter.isString('a string'), true)
    })
  })
  describe('isNumber', function () {
    it('should return true for 1', function () {
      assert.equal(Microfilter.isNumber(1), true)
    })
  })
  describe('isBoolean', function () {
    it('should return true for false(bool)', function () {
      assert.equal(Microfilter.isBool(false), true)
    })
  })
})
