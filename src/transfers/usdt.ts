import {web3, USDT, submitTransaction} from './web3'

export const transferUSDT = async function(privateKey, from, amount, to) {
	try {
    let data = USDT.methods.transfer(to,web3.utils.toHex(amount)).encodeABI()
    submitTransaction({to:USDT._address,from,value:web3.utils.toHex(0),data,privateKey},(err,hash)=>{
      if(hash) return hash
      else return err
    });
  }
	catch(err){
		return err
	}
}
