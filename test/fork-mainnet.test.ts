//fork-mainnet.test.ts
import { expect } from "chai";
import hre from "hardhat";
import { BigNumber } from "ethers";
//const { ethers, network } = hre;

describe("Mainnet Fork - DAI interaction", function () {
    // DAI mainnet address (example)
    const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    // pick a known DAI-rich address (example: Binance hotspot). We can replace with any holder address found on Etherscan.
    const DAI_WHALE = "0x28C6c06298d514Db089934071355E5743bf21d60";

    let signer: any;
    let provider: any;
    let dai: any;

    before(async function () {
        const { ethers } = hre;
        provider = ethers.provider;

        //attach ERC20 minimal ABI
        const ERC20_ABI = [
            "function balanceOf(address) view returns (uint256)",
            "function transfer(address to, uint amount) returns (bool)",
            "function decimals() view returns (uint8)",
            "event Transfer(address indexed from, address indexed to, uint amount)"
        ];
        dai = new ethers.Contract(DAI_ADDRESS, ERC20_ABI, provider);

        // get the first test account (Hardhat gives multiple default accounts)
        [signer] = await ethers.getSigners();
    });

    // read data on blockchain
    it("read total supply and a whale balance", async function () {
//        const total = await dai.balanceOf(DAI_ADDRESS); // not totalSupply but demo: we can call other method if ABI available
        const whaleBal = await dai.balanceOf(DAI_WHALE);

        console.log("DAI whale balance (raw): ", whaleBal.toString());
        expect(whaleBal).to.be.a("object");
    });

    // impersonating
    it("impersonate whale, fund it with ETH, and transfer some DAI to test signer", async function () {
        const { ethers, network } = hre;
        const recipient = signer.address;
//        const recipient = (await ethers.getSigners())[0].address;

        // 1 give some ETH to the whale to pay gas on the fork
        const fundAmount = ethers.utils.parseEther("1");
        // Use network.provider.send (underlying JSON-RPC) to call hardhat_setBalance
        await network.provider.send("hardhat_setBalance", [
            DAI_WHALE, 
            fundAmount.toHexString(), // v5 使用 toHexString() 替代 "0x" + ...
        ]);
//        await provider.send("hardhat_setBalance", [DAI_WHALE, "0x" + fundAmount.toBigInt().toString(16)]);

        // 2 impersonate the whale
        await network.provider.send("hardhat_impersonateAccount", [DAI_WHALE]);
        const whaleSigner = await ethers.getSigner(DAI_WHALE);

        // 3 connect dai contract to whale signer and transfer tokens
        const transferAmount = ethers.utils.parseUnits("100.0", 18); // 100 DAI
        const daiWithWhale = dai.connect(whaleSigner);

        // record balance before
        const before = await dai.balanceOf(recipient);
        console.log("Recipient before: ", ethers.utils.formatUnits(before, 18));

        // perform transfer
        const tx = await daiWithWhale.transfer(recipient, transferAmount);
        await tx.wait();

        const after = await dai.balanceOf(recipient);
        console.log("Recipient after: ", ethers.utils.formatUnits(after, 18));

        expect(after.sub(before)).to.equal(transferAmount);

        // stop impersonation
        await network.provider.send("hardhat_stopImpersonatingAccount", [DAI_WHALE]);
    });
});