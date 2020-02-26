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

# Releasing

- releases are done only from `master` branch
- check if `./scripts/download-proto.sh && yarn run proto && yarn run compile` runs without error and does not produce any change
    - if it does, commit it
- in a separate commit, update the version in package.json to N+1 (0.0.1 -> 0.0.2), in the commit message, say `Version vX.Y.Z`
    - you can add a list of changes from the previous version as bullet list to 3rd and next lines of commit message
- Create signed tag to to the commit called as the new version (e.g. `v0.0.2`)
- Push both master and the tag (`git push origin master && git push --tags`)
