const { blake2blTwice } = require('./utils/crypto');

export default class TimbleScript {

    // Global Variables
    public NRG_TRANSFER = 'nrg_transfer';
    public MAKER_OUTPUT = 'maker_output';
    public TAKER_INPUT = 'taker_input';
    public TAKER_OUTPUT = 'taker_output';
    public TAKER_CALLBACK = 'taker_callback';

    public bufferToString(scriptBuffer: Uint8Array): string {
      return Buffer.from(scriptBuffer).toString('ascii')
    }

    public stringToBuffer(scriptString : string) : Uint8Array {
      return new Uint8Array(Buffer.from(scriptString, 'ascii'))
    }

    public createNRGLockScript(address: string): string {
      address = address.toLowerCase()
      const script = [
        'OP_BLAKE2BL',
        blake2blTwice(address),
        'OP_EQUALVERIFY',
        'OP_CHECKSIGVERIFY'
      ]
      return script.join(' ')
    }

    public parseNRGLockScript(script: string|Uint8Array):{
      doubleHashedBcAddress:string
    }{
      if(typeof script != 'string') script = this.bufferToString(script)

      const doubleHashedBcAddress = script.split(' ')[1]
      return {
        doubleHashedBcAddress
      }
    }

    public createMakerLockScript(
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

    public parseMakerLockScript(script: string|Uint8Array): {
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
      if(typeof script != 'string') script = this.bufferToString(script)

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


    public createTakerUnlockScript(takerWantsAddress: string, takerSendsAddress: string): string {
      return [takerWantsAddress, takerSendsAddress].join(' ')
    }

    public parseTakerUnlockScript(script: string|Uint8Array):{
      takerWantsAddress: string,
      takerSendsAddress: string
    }{
      if(typeof script != 'string') script = this.bufferToString(script)

      const [takerWantsAddress, takerSendsAddress] = script.split(' ')
      return {
        takerWantsAddress,
        takerSendsAddress
      }
    }

    public createTakerLockScript(makerTxHash: string, makerTxOutputIndex: string|number, takerBCAddress: string): string {
      takerBCAddress = takerBCAddress.toLowerCase()
      const doubleHashedBcAddress = blake2blTwice(takerBCAddress)
      const script = [
        [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'],
        ['4', 'OP_IFEQ', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDIFEQ'],
        ['OP_DROP', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD']
      ]
      return script.map(part => part.join(' ')).join(' ')
    }

    public parseTakerLockScript(script: string|Uint8Array):{
      makerTxHash: string,
      makerTxOutputIndex: number,
      doubleHashedBcAddress: string
    }{
      if(typeof script != 'string') script = this.bufferToString(script)

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

    public createTakerCallbackLockScript(makerTxHash: string, makerTxOutputIndex: number): string {
      return [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'].join(' ')
    }

    public parseTakerCallbackLockScript(script: string|Uint8Array): {
      makerTxHash: string,
      makerTxOutputIndex: string
    } {
      if(typeof script != 'string') script = this.bufferToString(script)

      const [makerTxHash, makerTxOutputIndex, OP_Callback] = script.split(' ')
      return {
        makerTxHash,
        makerTxOutputIndex
      }
    }

    public getScriptType(script: Uint8Array|string): string {
      if(typeof script != 'string') script = this.bufferToString(script)
      if (script.startsWith('OP_MONOID')){
        return this.MAKER_OUTPUT
      } else if (script.endsWith('OP_CALLBACK')){
        return this.TAKER_CALLBACK
      } else if (script.indexOf('OP_MONAD') > -1 && script.indexOf('OP_CALLBACK') > -1){
        return this.TAKER_OUTPUT
      } else if (script.startsWith('OP_BLAKE2BL')){
        return this.NRG_TRANSFER
      } else return this.TAKER_INPUT
    }

}
