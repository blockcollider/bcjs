import {web3, EMB, submitTransaction} from './web3'

export const transferEMB = async function(privateKey, from, to, amount) {
	try {
    let data = EMB.methods.transfer(
			to,
			web3.utils.toHex(Math.floor(Math.pow(10,8)*(parseFloat(amount))))
		).encodeABI()
    submitTransaction({to:EMB._address,from,value:web3.utils.toHex(0),data,privateKey},(err,hash)=>{
      if(hash) return hash
      else return err
    });
  }
	catch(err){
		return err
	}
}
