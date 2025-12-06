# Web3 Testing Project — Hardhat + Foundry + Mainnet Fork

English | [中文 README](README_CN.md)

A minimal yet complete Web3 testing environment using **Hardhat**, **Foundry**, **Ethers v5**, **Mocha(Chai v4)** and **Mainnet forking**.  
This project demonstrates smart contract unit testing, integration testing, and live blockchain interaction through a forked Ethereum mainnet.

---

## 📌 Features

- **Hardhat Testing**
  - Unit tests (JavaScript/TypeScript)
  - Integration tests
  - Mainnet fork testing
  - Ethers v5 & Hardhat 2.x & Node v20

- **Foundry (Forge) Testing**
  - Solidity-based unit tests (`forge-tests/`)
  - Supports cheatcodes, fuzzing, gas reporting

- **Mainnet Fork**
  - Fetches live state from Ethereum mainnet
  - Connects to Alchemy RPC using `.env`
  - Reproduces real-world DeFi/contract interactions

---

## 📂 Project Structure

```
my-hardhat-project/
│
├── contracts/
│ └── Counter.sol
│
├── test/
│ └── fork-mainnet.test.ts # Hardhat test using mainnet forking
│
├── forge-tests/
│ └── Counter.t.sol # Solidity tests using Foundry
│
├── hardhat.config.ts
├── foundry.toml (optional)
├── package.json
└── README.md / README_CN.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

(The project already contains correct Hardhat + Ethers v5 setup.)

### 2. Environment Variables

Create .env:

```
ALCHEMY_MAINNET_URL="https://eth-mainnet.g.alchemy.com/v2/API_KEY"
FORK_BLOCK_NUMBER=19258000     # It is recommended to fix a block containing the DAI contract to prevent errors from occurring at Block 0
```

## 🧪 Running Tests

### ▶ Hardhat Testing

This is Solidity/Typescript logic tests for contracts/Counter.sol, including unit / integration / mainnet-forked tests.

**Run command:**

```
npx hardhat test --network hardhat
```

**Expected output:**

```
[PASS] testIncrement() (gas: ...)
[PASS] testSetNumber(uint256) (gas: ...)
Suite result: ok. 2 passed; 0 failed; 0 skipped;
```

### ▶ Foundry (Forge) Testing

This is 100% Solidity logic unit test for contracts/Counter.sol.

(Requires Foundry installed)

```
forge test
```

Foundry tests are placed inside: `forge-tests/Counter.t.sol`

They provide:

- Solidity-native test environment

- Cheatcodes (e.g., vm.roll, vm.prank)

- Fast compile & test cycle


### ▶ Mainnet Fork Testing

This is interactive testing on the Ethereum mainnet. This test forks the mainnet state, simulates a "whale" account, and performs transfers locally via a DAI contract.

**What's it testing?**

- Read State: Read the total DAI supply and the whale account balance.

- Impersonate: Impersonate a whale account.

- Transfer: Transfer 100 DAI from the whale account to the test account.

- Verify: Verify the balance change.


The mainnet fork tests run using:

- Alchemy mainnet RPC

- State fetched from real Ethereum mainnet

- Deterministic behavior if we lock block number

Example in hardhat.config.ts:

```
forking: {
  url: process.env.ALCHEMY_MAINNET_URL,
  blockNumber: Number(process.env.FORK_BLOCK_NUMBER) || undefined,
}
```

This allows interacting with real contract state (e.g., ERC20 balances, Uniswap, Aave, etc.) inside tests without using real money.

**Run command:**
```
npx hardhat test test/fork-mainnet.test.ts
```


**Expected output:**

```
-----------------------------------------
Currently read RPC URL: ✅ Obtained
Blocks in environment variables: 19258000
The final Fork Block used: 19258000
-----------------------------------------
Compiled 1 Solidity file successfully (evm target: paris).


  Mainnet Fork - DAI interaction
DAI whale balance (raw):  7023297669238831468404501
    ✔ read total supply and a whale balance
Recipient before:  0.0
Recipient after:  100.0
    ✔ impersonate whale, fund it with ETH, and transfer some DAI to test signer

  2 passing (970ms)
```

## 🛠 Tech Stack

- Hardhat 2.19.1

- Ethers.js v5 + Mocha(Chai v4)

- TypeScript / Solidity

- Foundry (Forge)

- Alchemy RPC

- Ethereum Mainnet Forking

## 📄 License

MIT - LIN. You may freely use, modify, and distribute this project.

## 🌐 Languages

English (this file)

[中文 README](README_CN.md)