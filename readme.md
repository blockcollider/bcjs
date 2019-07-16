# BC RPC SDK

## Examples

`examples/get-balance.ts`:

```typescript
import RpcClient from '../src/client';
import {
    GetBalanceRequest
} from '../src/protos/bc_pb';

const address = process.env.BC_RPC_ADDRESS || 'https://localhost:3000'
const scookie = process.env.BC_RPC_SCOOKIE

const client = new RpcClient(address, scookie);
const req = new GetBalanceRequest();
req.setAddress('<your address>');
client.getBalance(req).then(balance => {
    console.log(balance);
})
```

Before running install ts-node with `yarn global add ts-node`

Then run like `NODE_TLS_REJECT_UNAUTHORIZED=0 BC_RPC_ADDRESS=https://localhost:3001 BC_RPC_SCOOKIE=trololo ts-node examples/get-balance.ts`

And you should get response similar to this:

```js
{ confirmed: '7536',
  unconfirmed: '0',
  collateralized: '96',
  collateralizedspendable: '0',
  unit: 'nrg' }
```
