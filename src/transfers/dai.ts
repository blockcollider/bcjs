import {web3, DAI, submitTransaction} from './web3'

export const transferDAI = async function(privateKey, from, amount, to) {
	try {
    let data = DAI.methods.transfer(to,web3.utils.toHex(amount)).encodeABI()
    submitTransaction({to:DAI._address,from,value:web3.utils.toHex(0),data,privateKey},(err,hash)=>{
      if(hash) return hash
      else return err
    });
  }
	catch(err){
		return err
	}
}
