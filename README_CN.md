# 基于 Hardhat & Foundry 框架的 Web3 混合测试项目

[English README](README.md) | 中文

这是一个 Web3 混合测试项目，结合了 **Foundry** 高效的 Solidity 单元测试与 **Hardhat** 强大的 TypeScript 集成测试环境，涵盖智能合约单元测试与集成测试以及 fork mainnet链上交互验证的测试。

项目主要包含：
1.  **智能合约**：基础的计数器合约 (`Counter.sol`)。
2.  **单元测试**：使用 Foundry (`forge`) 编写的合约逻辑测试。
3.  **集成/Fork 测试**：使用 Hardhat 分叉以太坊主网，模拟真实链上环境（如 DAI 转账）。

## 📂 项目结构

```
my-hardhat-project/
├── contracts/               # Solidity 智能合约源文件 (Counter.sol)
├── forge-tests/             # Foundry 单元测试文件 (Counter.t.sol)
├── test/                    # Hardhat 集成/Fork 测试脚本 (fork-mainnet.test.ts)
├── hardhat.config.ts        # Hardhat 配置文件 (适配 Ethers v5)
├── foundry.toml             # Foundry 配置文件 (需手动配置路径)
├── package.json             # Node.js 依赖配置
├── .env                     # 环境变量 (私钥、RPC URL)
└── tsconfig.json            # TypeScript 配置
```

## 🛠 前置要求

在开始之前，请确保系统安装了以下工具：

- Node.js: 推荐 v20 (LTS) 或更高版本。

- npm 或 pnpm: 包管理工具。

- Foundry: 用于运行 Solidity 单元测试。

- 安装命令: `curl -L https://foundry.paradigm.xyz | bash` 然后运行 `foundryup`。


## 🚀 快速开始

### 1. 安装依赖

```
npm install
```
注意：本项目为了兼容旧版测试脚本，锁定了 ethers@5.7.2 和 chai@4.x。安装过程中出现 deprecated 警告属于正常现象，请忽略。

### 2. 配置环境变量

复制 .env.example (如果没有则新建) 为 .env：

```
cp .env.example .env
```
或者

```
touch .env
```
在 .env 文件中填入以下内容：

```
# Alchemy 或 Infura 的以太坊主网 RPC URL
ALCHEMY_MAINNET_URL="https://eth-mainnet.g.alchemy.com/v2/API_KEY"

# Fork 的区块高度 (建议固定一个包含 DAI 合约的区块，防止从 Block 0 报错)
FORK_BLOCK_NUMBER=19258000
```

安全警告：请确保 .env 文件已被添加到 .gitignore 中，勿将私钥或 API Key 上传至 GitHub。

### 3. 配置 Foundry (关键步骤)

由于Foundry测试文件位于forge-tests/目录（而非默认的test/），需要在根目录创建或修改foundry.toml文件以指定测试目录：

foundry.toml 内容：

```
[profile.default]
src = "contracts"
out = "out"
libs = ["node_modules", "lib"]
test = "forge-tests"          # 指定测试文件目录
cache_path  = "cache_forge"
```

## 🧪 运行测试
本项目支持两种测试模式：

### 🟢 模式一：单元测试 (Powered by Foundry)
针对 contracts/Counter.sol 的纯 Solidity 逻辑测试。速度极快，无需网络连接。

**运行命令：**&

```
forge test
```
**预期输出：**

```
Running Solidity tests

  contracts/Counter.t.sol:CounterTest
    ✔ test_InitialValue()
    ✔ test_IncByZero()
    ✔ testFuzz_Inc(uint8) (runs: 256)

  3 passing

  Running Mocha tests 
  
  Counter 
    ✔ Should emit the Increment event when calling the inc() function 
    ✔ The sum of the Increment events should match the current value 
    
  2 passing (50ms)
```

### 🔵 模式二：Mainnet Fork 集成测试 (Powered by Hardhat)
针对以太坊主网的交互测试。此测试会 Fork 主网状态，模拟“巨鲸”账户并在本地通过 DAI 合约进行转账。

**测试内容：**

- Read State: 读取 DAI 总供应量及巨鲸账户余额。

- Impersonate: 冒充巨鲸账户。

- Transfer: 从巨鲸账户向测试账户转账 100 DAI。

- Verify: 验证余额变化。

**运行命令：**

```
npx hardhat test test/fork-mainnet.test.ts
```

**预期输出：**

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

## ❓ 常见问题
**Q: 运行 Hardhat 测试时报错 Cannot fork Mainnet from block 0？** 

A: 这是因为没有读取到 .env 中的 FORK_BLOCK_NUMBER，或者该变量被设置为了 0。请检查 .env 文件是否存在，以及 FORK_BLOCK_NUMBER 是否设置为 19258000 或其他现代区块高度。

**Q: 出现 Node.js version not supported 警告** 

A: Hardhat 推荐使用 Node v20+。虽然在 v18 下通常也能运行，但建议升级 Node.js 版本以获得最佳稳定性。

**Q: 为什么会有 forge-std 编译错误？** 

A: 确保已经安装了 forge-std。如果通过npm安装了，确保 foundry.toml 中的 libs 包含了 node_modules。如果使用 git submodule，请运行 forge install foundry-rs/forge-std。

## 📄 License
MIT - LIN