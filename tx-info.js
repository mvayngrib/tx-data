
var bitcoin = require('bitcoinjs-lib')
var utils = require('tradle-utils')
var TxData = require('./tx-data')
var DATA_TYPES = TxData.types

module.exports = function getTxInfo(tx, networkName, prefix) {
  var txData = TxData.fromTx(tx, prefix)
  if (!txData) return

  var addresses = {}
  addresses.from = tx.ins.map(function(i) {
      return utils.getAddressFromInput(i, networkName)
    })
    .filter(truthy)

  addresses.to = tx.outs.map(function(o) {
      return utils.getAddressFromOutput(o, networkName)
    }).filter(truthy)

  return {
    type: txData.type() === DATA_TYPES.public ? 'public' : 'permission',
    key: txData.data(),
    tx: {
      id: tx.getId(),
      body: tx,
      addresses: addresses
    }
  }
}

function truthy (o) {
  return !!o
}
