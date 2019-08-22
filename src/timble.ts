const { blake2bl } = require('./utils/crypto');

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

    public createNRGTransfer(address: string): string {
      address = address.toLowerCase()
      const script = [
        'OP_BLAKE2BL',
        blake2bl(blake2bl(address)),
        'OP_EQUALVERIFY',
        'OP_CHECKSIGVERIFY'
      ]
      return script.join(' ')
    }

    public createMakerOutput(shiftLength: number, depositLength: number, settleLength: number,
      paysFromChainId: string, wantsToChainId: string,
      makerWantsAddress: string, makerWantsUnit: string, makerPaysUnit: string,
      makerBCAddress: string) : string {

      makerBCAddress = makerBCAddress.toLowerCase()
      let doubleHashedBcAddress = blake2bl(blake2bl(makerBCAddress))

      makerWantsAddress = makerWantsAddress.toLowerCase()

      const script = [
        ['OP_MONOID', shiftLength, depositLength, settleLength, 'OP_DEPSET'],
        ['OP_0', 'OP_IFEQ',
          'OP_RETURN', 'OP_ENDIFEQ'],
        ['OP_2', 'OP_IFEQ',
          'OP_TAKERPAIR', '2', 'OP_MINUNITVALUE', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
        ['OP_3', 'OP_IFEQ',
          'OP_RETURN', 'OP_ENDIFEQ'],
        ['OP_DROP', paysFromChainId, wantsToChainId, makerWantsAddress, makerWantsUnit, makerPaysUnit, 'OP_MAKERCOLL'],
        ['OP_3', 'OP_IFEQ',
          'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_RETURN_RESULT', 'OP_ENDIFEQ'],
        ['OP_2', 'OP_IFEQ',
          '1', 'OP_MONADSPLIT', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD', 'OP_ENDIFEQ']
      ]
      return script.map(part => part.join(' ')).join(' ')
    }

    public createTakerInput(takerWantsAddress: string, takerSendsAddress: string): string {
      return [takerWantsAddress, takerSendsAddress].join(' ')
    }

    public createTakerOutput(makerTxHash: string, makerTxOutputIndex: string|number, takerBCAddress: string): string {
      takerBCAddress = takerBCAddress.toLowerCase()
      const doubleHashedBcAddress = blake2bl(blake2bl(takerBCAddress))
      const script = [
        [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'],
        ['4', 'OP_IFEQ', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDIFEQ'],
        ['OP_DROP', 'OP_MONAD', 'OP_BLAKE2BL', doubleHashedBcAddress, 'OP_EQUALVERIFY', 'OP_CHECKSIGVERIFY', 'OP_ENDMONAD']
      ]
      return script.map(part => part.join(' ')).join(' ')
    }

    public createTakerCallbackOutputForMaker(makerTxHash: string, makerTxOutputIndex: number): string {
      return [makerTxHash, makerTxOutputIndex, 'OP_CALLBACK'].join(' ')
    }

    public getScriptType(script: Uint8Array|string): string {
      if(typeof script != 'string') script = this.bufferToString(script)
      if (script.startsWith('OP_MONOID')){
        return this.MAKER_OUTPUT
      }
      else if (script.endsWith('OP_CALLBACK')){
        return this.TAKER_CALLBACK
      }
      else if (script.indexOf('OP_MONAD') > -1 && script.indexOf('OP_CALLBACK') > -1){
        return this.TAKER_OUTPUT
      }
      else if (script.startsWith('OP_BLAKE2BL')){
        return this.NRG_TRANSFER
      }
      else return this.TAKER_INPUT
    }

    public parseTakerOutput(script: string|Uint8Array):{
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


    public parseNRGTransfer(script: string|Uint8Array):{
      doubleHashedBcAddress:string
    }{
      if(typeof script != 'string') script = this.bufferToString(script)

      const doubleHashedBcAddress = script.split(' ')[1]
      return {
        doubleHashedBcAddress
      }
    }

    public parseTakerInput(script: string|Uint8Array):{
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

    public parseTakerCallback(script: string|Uint8Array):{
      makerTxHash: string,
      makerTxOutputIndex: string
    }{
      if(typeof script != 'string') script = this.bufferToString(script)

      const [makerTxHash, makerTxOutputIndex, OP_Callback] = script.split(' ')
      return {
        makerTxHash,
        makerTxOutputIndex
      }
    }

    public parseMakerOutput(script: string|Uint8Array):{
      shiftStartsAt: number,
      depositEndsAt: number,
      settleEndsAt: number,
      paysChainId: string,
      wantsChainId: string,
      wantsAddress: string,
      wantsUnit: string,
      paysUnit: string,
      doubleHashedBcAddress: string
    }{
      if(typeof script != 'string') script = this.bufferToString(script)

      const [shiftStartsAt, depositEndsAt, settleEndsAt] = script.split(' OP_DEPSET ')[0].split(' ').slice(1)
      const tradeInfo = script.split(' OP_MAKERCOLL ')[0].split(' ')
      const [paysChainId, wantsChainId, wantsAddress, wantsUnit, paysUnit] = tradeInfo.slice(tradeInfo.length - 5)

      const doubleHashedBcAddress = script.split(' OP_IFEQ OP_BLAKE2BL ')[1].split(' ')[0]

      return {
        shiftStartsAt: parseInt(shiftStartsAt, 10),
        depositEndsAt: parseInt(depositEndsAt, 10),
        settleEndsAt: parseInt(settleEndsAt, 10),
        paysChainId: paysChainId,
        wantsChainId: wantsChainId,
        wantsAddress: wantsAddress,
        wantsUnit: wantsUnit,
        paysUnit: paysUnit,
        doubleHashedBcAddress: doubleHashedBcAddress
      }
    }


}
