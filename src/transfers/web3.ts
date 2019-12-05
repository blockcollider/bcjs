var Web3 = require("web3");
var Tx = require('ethereumjs-tx').Transaction;

let options = {gasLimit:2000000000000,gasPrice:20000}
export const mainnet_url = 'https://mainnet.infura.io/v3/ca4c368803c347699a5d989cd367c0a6';
export const web3 = new Web3(new Web3.providers.HttpProvider(mainnet_url));

export const EMB_ADDRESS = "0xbfCdE98b92722f9BC33a5AB081397CD2D5409748";
export const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
export const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";

export const EMB_ABI = require('./contracts/Emblem.json').abi;
export const DAI_ABI = require('./contracts/DAI.json');
export const USDT_ABI = require('./contracts/USDT.json');

export const DAI = new web3.eth.Contract(DAI_ABI,DAI_ADDRESS,options);
export const USDT = new web3.eth.Contract(USDT_ABI,USDT_ADDRESS,options);
export const EMB = new web3.eth.Contract(EMB_ABI,EMB_ADDRESS,options);


const getNonce = (from) => {
  return new Promise((resolve, reject) => {
    web3.eth.getTransactionCount(from,'pending', (error, result) => {
      if(error) reject(error);
      resolve(web3.utils.toHex(result));
    })
  })
}

const getGasPrice = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getGasPrice((error, result) => {
      if(error) reject(error);
      resolve(result*10);
    })
  })
}

const sendRawTransaction = (tx,done) => {
  web3.eth.sendSignedTransaction(tx)
  .on('transactionHash',()=>done(null,tx))
  .on('error',(err)=>done(err))
}

const signTransaction = ({from,to,value,data,privateKey},done) => {
  Promise.all([getNonce(from), getGasPrice()]).then(values => {
    return({
      gasLimit: web3.utils.toHex(53000),
      gasPrice: web3.utils.toHex(values[1]),
      nonce: values[0],
      to,
      value,
      data
    });
  }).then((rawTx)=> {
      let tx = new Tx(rawTx, {'chain':'mainnet'});
      tx.sign(Buffer.from(privateKey, 'hex'));
      done(null,tx,'0x'+tx.serialize().toString('hex'));
  }).catch(err=>{
      done(err);
  });
}

export const submitTransaction = (args, done) => {
  signTransaction(args,(err,tx,serializedTx)=>{
    if(!err){
      sendRawTransaction(serializedTx,(err,receipt)=>{
        if(!err)done(null,tx.hash(true).toString('hex'))
        else done(err)
      })
    }
    else done(err)
  })
}
