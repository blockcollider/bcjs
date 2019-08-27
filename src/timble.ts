const { blake2blTwice } = require('./utils/crypto');

export default class TimbleScript {

    // Global Variables
    static NRG_TRANSFER = 'nrg_transfer';
    static MAKER_OUTPUT = 'maker_output';
    static TAKER_INPUT = 'taker_input';
    static TAKER_OUTPUT = 'taker_output';
    static TAKER_CALLBACK = 'taker_callback';

    static bufferToString(scriptBuffer: Uint8Array): string {
      return Buffer.from(scriptBuffer).toString('ascii')
    }

    static stringToBuffer(scriptString : string) : Uint8Array {
      return new Uint8Array(Buffer.from(scriptString, 'ascii'))
    }

    static createNRGLockScript(address: string): string {
      address = address.toLowerCase()
      const script = [
        'OP_BLAKE2BL',
        blake2blTwice(address),
        'OP_EQUALVERIFY',
        'OP_CHECKSIGVERIFY'
      ]
      return script.join(' ')
    }

    static parseNRGLockScript(script: string|Uint8Array):{
      doubleHashedBcAddress:string
    }{
      if(typeof script != 'string') script = TimbleScript.bufferToString(script)

      const doubleHashedBcAddress = script.split(' ')[1]
      return {
        doubleHashedBcAddress
      }
    }

    static createMakerLockScript(
      shiftMaker: number, shiftTaker: number, depositLength: number, settleLength: number,
      sendsFromChain: string, receivesToChain: string,
      sendsFromAddress: string, receivesToAddress: string,
      sendsUnit: string, receivesUnit: string,
      bcAddress: string
    ) : string {
      bcAddress = bcAddress.toLowerCase()
      let doubleHashedBcAddress = blake2blTwice(bcAddress)

      const script = [
        ['OP_MONOID', shiftMaker, shiftTaker, depositLength, settleLength, 'OP_DEPSET'],
        ['OP_0', 'OP_IFEQ',
          'OP_RETURN', 'OP_ENDIFEQ'],
        ['OP_2', 'OP_IFEQ',
          'OP_TAKERPAIR', '2', 'OP_MINUNITVALUE', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
        ['OP_3', 'OP_IFEQ',
          'OP_RETURN', 'OP_ENDIFEQ'],
        ['OP_DROP', sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit, 'OP_MAKERCOLL'],
        ['OP_3', 'OP_IFEQ',
          'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
        ['OP_2', 'OP_IFEQ',
          '1', 'OP_MONADSPLIT', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ']
      ]
      return script.map(part => part.join(' ')).join(' ')
    }

    static parseMakerLockScript(script: string|Uint8Array): {
      shiftMaker: number,
      shiftTaker: number,
      deposit: number,
      settlement: number,
      sendsFromChain: string,
      receivesToChain: string,
      sendsFromAddress: string,
      receivesToAddress: string,
      sendsUnit: string,
      receivesUnit: string,
      doubleHashedBcAddress: string
    } {
      if(typeof script != 'string') script = TimbleScript.bufferToString(script)

      const [shiftMaker, shiftTaker, deposit, settlement] = script.split(' OP_DEPSET ')[0].split(' ').slice(1)
      const tradeInfo = script.split(' OP_MAKERCOLL ')[0].split(' ')
      const [sendsFromChain, receivesToChain, sendsFromAddress, receivesToAddress, sendsUnit, receivesUnit] = tradeInfo.slice(tradeInfo.length - 5)

      const doubleHashedBcAddress = script.split(' OP_IFEQ OP_BLAKE2BL ')[1].split(' ')[0]

      return {
        shiftMaker: parseInt(shiftMaker, 10),
        shiftTaker: parseInt(shiftTaker, 10),
        deposit: parseInt(deposit, 10),
        settlement: parseInt(settlement, 10),
        sendsFromChain: sendsFromChain,
        receivesToChain: receivesToChain,
        sendsFromAddress: sendsFromAddress,
        receivesToAddress: receivesToAddress,
        sendsUnit: sendsUnit,
        receivesUnit: receivesUnit,
        doubleHashedBcAddress: doubleHashedBcAddress
      }
    }


    static createTakerUnlockScript(takerWantsAddress: string, takerSendsAddress: string): string {
      return [takerWantsAddress, takerSendsAddress].join(' ')
    }

    static parseTakerUnlockScript(script: string|Uint8Array):{
      takerWantsAddress: string,
      takerSendsAddress: string
    }{
      if(typeof script != 'string') script = TimbleScript.bufferToString(script)

      const [takerWantsAddress, takerSendsAddress] = script.split(' ')
      return {
        takerWantsAddress,
        takerSendsAddress
      }
    }

    static createTakerLockScript(makerTxHash: string, makerTxOutputIndex: string|number, takerBCAddress: string): string {
      takerBCAddress = takerBCAddress.toLowerCase()
      const doubleHashedBcAddress = blake2blTwice(takerBCAddress)
      const script = [
        [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'],
        ['4', 'OP_IFEQ', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDIFEQ'],
        ['OP_DROP', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD']
      ]
      return script.map(part => part.join(' ')).join(' ')
    }

    static parseTakerLockScript(script: string|Uint8Array):{
      makerTxHash: string,
      makerTxOutputIndex: number,
      doubleHashedBcAddress: string
    }{
      if(typeof script != 'string') script = TimbleScript.bufferToString(script)

      if (script.indexOf('OP_CALLBACK') === -1) {
        throw new Error('Invalid taker outpout script')
      }
      const [makerTxHash, makerTxOutputIndex] = script.split(' OP_CALLBACK')[0].split(' ')
      const doubleHashedBcAddress = script.split(' OP_BLAKE2BL ')[1].split(' ')[0]

      return {
        makerTxHash: makerTxHash,
        makerTxOutputIndex: parseInt(makerTxOutputIndex, 10),
        doubleHashedBcAddress: doubleHashedBcAddress
      }
    }

    static createTakerCallbackLockScript(makerTxHash: string, makerTxOutputIndex: number): string {
      return [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'].join(' ')
    }

    static parseTakerCallbackLockScript(script: string|Uint8Array): {
      makerTxHash: string,
      makerTxOutputIndex: string
    } {
      if(typeof script != 'string') script = TimbleScript.bufferToString(script)

      const [makerTxHash, makerTxOutputIndex, OP_Callback] = script.split(' ')
      return {
        makerTxHash,
        makerTxOutputIndex
      }
    }

    static getScriptType(script: Uint8Array|string): string {
      if(typeof script != 'string') script = TimbleScript.bufferToString(script)
      if (script.startsWith('OP_MONOID')){
        return TimbleScript.MAKER_OUTPUT
      } else if (script.endsWith('OP_CALLBACK')){
        return TimbleScript.TAKER_CALLBACK
      } else if (script.indexOf('OP_MONAD') > -1 && script.indexOf('OP_CALLBACK') > -1){
        return TimbleScript.TAKER_OUTPUT
      } else if (script.startsWith('OP_BLAKE2BL')){
        return TimbleScript.NRG_TRANSFER
      } else return TimbleScript.TAKER_INPUT
    }

}
