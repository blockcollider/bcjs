# BC RPC SDK

## Tests

Tests are written in [Jest](https://jestjs.io/) framework.
Run them using `yarn run test`.

## Examples

`examples/get-balance.ts`:

```typescript
import RpcClient from '../src/client';
import {
    GetBalanceRequest
} from '@overline/proto/proto/bc_pb';

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

# Releasing

- releases are done only from `master` branch
- **double check that CI checks ran successfully before releasing (or manually run** `yarn && yarn lint && yarn test && yarn compile` **)**
- test new release with `./node_modules/.bin/release-it --dry-run`
- if everything looks as expected, run `./node_modules/.bin/release-it`
