# Flash Swap Example
Example of Flash Swaps

## Installation and Setup

### 1. Install [Node.js](https://nodejs.org/en/) & [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable), if you haven't already.

### 2. Clone This Repo
Run the following command.
```console
git clone https://github.com/yuichiroaoki/flash-swap-example.git
```

## Quickstart
Right now this repo only works with hardhat mainnet fork.

### 1. Setup Environment Variables
You'll need an ALCHEMY_MAINNET_RPC_URL environment variable. You can get one from [Alchemy website](https://alchemy.com/?r=33851811-6ecf-40c3-a36d-d0452dda8634) for free.

Then, you can create a .env file with the following.

```
ALCHEMY_MAINNET_RPC_URL='<your-own-alchemy-mainnet-rpc-url>'
```

### 2. Install Dependencies
Run the following command.
```console
yarn install
```

### 3. Compile Smart Contracts
Run the following command.
```console
yarn compile
```

### 4. Execute Flash Swaps 🔥
Run the following command.
```console
yarn flashswaps
```

Expected Outputs
```
$ yarn flashswaps
yarn run v1.22.5
$ npx hardhat run scripts/flashswaps.ts
No need to generate any newer typings.
deployer's initial balance 0
deployer's ending balance 4.860772792026915
Congrats! You earned 4.860772792026915 DAI !!
Done in 40.72s.
```

## References
### PairFlash
A sample flash swap contract from Uniswap official docs.

[Docs](https://docs.uniswap.org/protocol/guides/flash-integrations/final-contract) / [GitHub](https://github.com/Uniswap/uniswap-v3-periphery/blob/flash-pair-example/contracts/examples/PairFlash.sol) / [Test](https://github.com/Uniswap/uniswap-v3-periphery/blob/flash-pair-example/test/PairFlash.spec.ts)
