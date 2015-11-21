
var typeforce = require('typeforce')
var bitcoin = require('@tradle/bitcoinjs-lib')
var utils = require('@tradle/utils')
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
    parsed.txType = data.type()
    parsed.txData = data.data()
  }

  return parsed
}

exports.validate = function (txInfo) {
  try {
    typeforce({
      addressesFrom: 'Array',
      addressesTo: 'Array',
      txType: 'Number',
      txData: 'Buffer'
    }, txInfo)

    return isValidType(txInfo.txType) && txInfo.txData.length >= 20
  } catch (err) {
    return false
  }
}

function truthy (o) {
  return !!o
}

function isValidType (type) {
  for (var t in TxData.types) {
    if (TxData.types[t] === type) return true
  }

  return false
}
