import {web3, USDT, submitTransaction} from './web3'

export const transferUSDT = async function(privateKey, from, to, amount) {
	try {
    let data = USDT.methods.transfer(
			to,
			web3.utils.toHex(Math.floor(Math.pow(10,6)*(parseFloat(amount))))
		).encodeABI()
    submitTransaction({to:USDT._address,from,value:web3.utils.toHex(0),data,privateKey},(err,hash)=>{
      if(hash) return hash
      else return err
    });
  }
	catch(err){
		return err
	}
}
