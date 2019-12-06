import {web3, submitTransaction} from './web3'

export const transferETH = async function(privateKey, from, to, amount) {
	try {
		let value = web3.utils.toHex(web3.utils.toWei(amount.toString(),'ether'))
		submitTransaction({from,to,value,data:'0x0',privateKey},(err,hash)=>{
			if(hash) return hash
			else return err
		});
  }
	catch(err){
		return err
	}
}
