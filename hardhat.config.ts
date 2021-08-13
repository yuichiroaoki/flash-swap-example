import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import '@typechain/hardhat'
import "solidity-coverage"

import "./tasks/accounts";
import "./tasks/balance";
import "./tasks/block-number";


module.exports = {
  solidity: "0.7.6",
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_MAINNET_RPC_URL,
        blockNumber: 12975788
      }
    }
  },
  mocha: {
    timeout: 200000
  }
};