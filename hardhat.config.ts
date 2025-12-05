//hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "dotenv/config";

const ALCHEMY_URL = process.env.ALCHEMY_MAINNET_URL || "";
const ENV_BLOCK = process.env.FORK_BLOCK_NUMBER;

// Ensure there's a default value here, or handle `undefined`, otherwise TypeScript might throw an error
const FORK_BLOCK = ENV_BLOCK && ENV_BLOCK !== "" 
  ? parseInt(ENV_BLOCK) 
  : 19258000; // Give a default block height to prevent undefined

console.log("-----------------------------------------");
console.log("Currently read RPC URL:", ALCHEMY_URL ? "✅ Obtained" : "❌ Not obtained(undefined)");
console.log("Blocks in environment variables:", ENV_BLOCK);
console.log("The final Fork Block used:", FORK_BLOCK);
console.log("-----------------------------------------");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
  // If our contract references forge-std, we need to configure remappings
  // Alternatively, we could instruct Hardhat to ignore Foundry's test files to prevent compilation errors
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      forking: {
        url: ALCHEMY_URL,
        blockNumber: FORK_BLOCK
      },
    },
  },
};

export default config;