'use strict'

var assert = require('assert')
var bufferEqual = require('buffer-equal')
var bitcoin = require('bitcoinjs-lib')
var utils = require('tradle-utils')

TransactionData.types = {
  permission: 1,
  public: 2
}

TransactionData.ENCODING = 'base64'

function TransactionData(prefix, type, data) {
  assert(
    typeof prefix !== 'undefined' &&
    typeof type !== 'undefined' &&
    typeof data !== 'undefined',
    'prefix, type and data are all required'
  )

  if (!Object.keys(TransactionData.types).some(function(key) {
    return TransactionData.types[key] === type
  })) {
    throw new Error('unsupported transaction data type')
  }

  this._prefix = prefix
  this._type = type
  this._data = data
}

TransactionData.prototype.type = function() {
  return this._type
}

TransactionData.prototype.data = function() {
  return this._data
}

TransactionData.prototype.serialize = function() {
  var typeBuf = new Buffer(1)
  typeBuf.writeUInt8(this.type(), 0)
  var prefixBuf = new Buffer(this._prefix)
  var dataBuf = Buffer.isBuffer(this._data) ? this._data : new Buffer(TransactionData.ENCODING)

  return Buffer.concat([
    prefixBuf,
    typeBuf,
    dataBuf
  ], prefixBuf.length + typeBuf.length + dataBuf.length)
}

TransactionData.deserialize = function(buf, prefix) {
  assert(
    typeof buf !== 'undefined' &&
    typeof prefix !== 'undefined',
    'buf and prefix are required'
  )

  var prefixBuf = new Buffer(prefix)
  var prefixLength = prefixBuf.length
  if (!bufferEqual(buf.slice(0, prefixLength), prefixBuf)) return

  var type = buf[prefixLength]
  var data = buf.slice(prefixLength + 1)
  return new TransactionData(prefix, type, data)
}

TransactionData.fromTx = function(tx, prefix) {
  var data = utils.getOpReturnData(tx)
  return data && TransactionData.deserialize(data, prefix)
}

module.exports = TransactionData
