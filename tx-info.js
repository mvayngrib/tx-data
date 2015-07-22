
var typeforce = require('typeforce')
var bitcoin = require('bitcoinjs-lib')
var utils = require('tradle-utils')
var getKey = require('key-by-val')
var TxData = require('./tx-data')
var DATA_TYPES = TxData.types

exports.parse = function getTxInfo(tx, networkName, prefix) {
  var parsed = {
    txId: tx.getId(),
    tx: tx,
    addressesFrom: tx.ins
      .map(function(i) {
        return utils.getAddressFromInput(i, networkName)
      })
      .filter(truthy),
    addressesTo: tx.outs
      .map(function(o) {
        return utils.getAddressFromOutput(o, networkName)
      })
      .filter(truthy)
  }

  var data = TxData.fromTx(tx, prefix)
  if (data) {
    parsed.txType = getKey(DATA_TYPES, data.type())
    parsed.txData = data.data()
  }

  return parsed
}

exports.validate = function (txInfo) {
  try {
    typeforce({
      txId: 'String',
      tx: 'Object',
      addressesFrom: 'Array',
      addressesTo: 'Array',
      txType: '?String',
      txData: '?Buffer'
    }, txInfo)

    return true
  } catch (err) {
    return false
  }
}

function truthy (o) {
  return !!o
}
