
var bitcoin = require('bitcoinjs-lib')
var utils = require('tradle-utils')
var TxData = require('./tx-data')
var DATA_TYPES = TxData.types

module.exports = function getTxInfo(tx, networkName, prefix) {
  var addresses = {}
  var parsed = {
    tx: {
      id: tx.getId(),
      body: tx,
      addresses: addresses
    }
  }

  addresses.from = tx.ins
    .map(function(i) {
      return utils.getAddressFromInput(i, networkName)
    })
    .filter(truthy)

  addresses.to = tx.outs
    .map(function(o) {
      return utils.getAddressFromOutput(o, networkName)
    })
    .filter(truthy)

  var txData = TxData.fromTx(tx, prefix)
  if (txData) {
    parsed.type = txData.type() === DATA_TYPES.public ? 'public' : 'permission'
    parsed.key = txData.data()
  }

  parsed.data = {
    type: txData.type() === DATA_TYPES.public ? 'public' : 'permission',
    key: txData.data(),
  }

  return parsed
}

function truthy (o) {
  return !!o
}
