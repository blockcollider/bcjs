import {web3, EMB, submitTransaction} from './web3'

export const transferEMB = async function(privateKey, from, amount, to) {
	try {
    let data = EMB.methods.transfer(to,amount).encodeABI()
    submitTransaction({to:EMB._address,from,value:web3.utils.toHex(0),data,privateKey},(err,hash)=>{
      if(hash) return hash
      else return err
    });
  }
	catch(err){
		return err
	}
}
