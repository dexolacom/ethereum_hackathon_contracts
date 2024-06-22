import hre, { ethers, run } from "hardhat";
import fs from "fs";

async function main() {
    const [signer] = await ethers.getSigners();

    const factory = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";
    const route = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";
    const usdt = "0x04d0CaebCA219DAFBC394cD6e62b3181be29d1B3";
    const weth = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";

    const SwapLibraryFactory = await ethers.getContractFactory("SwapLibrary", signer);
    const SwapLibrary = await SwapLibraryFactory.deploy();
    await SwapLibrary.waitForDeployment();

    const BiscuitV1Factory = await ethers.getContractFactory("BiscuitV1", { libraries: { SwapLibrary }, signer });
    const biscuitV1 = await BiscuitV1Factory.deploy(signer.address, factory, route, usdt, weth);
    await biscuitV1.waitForDeployment();

    const PortfolioManagerFactory = await ethers.getContractFactory("PortfolioManager", signer);
    const portfolioManager = await PortfolioManagerFactory.deploy(signer, biscuitV1.target);
    await portfolioManager.waitForDeployment();

    await biscuitV1.setPortfolioManager(portfolioManager.target);

    const BiscuitV2Factory = await ethers.getContractFactory("BiscuitV2", signer);
    const biscuitV2 = await BiscuitV2Factory.deploy(signer);
    await biscuitV2.waitForDeployment();

    const SignatureHelperFactory = await ethers.getContractFactory("SignatureHelper", signer);
    const signatureHelper = await SignatureHelperFactory.deploy();
    await signatureHelper.waitForDeployment();

    await run("verify:verify", {
        address: SwapLibrary.target,
        constructorArguments: [],
    });

    await run("verify:verify", {
        address: biscuitV1.target,
        constructorArguments: [signer.address, factory, route, usdt, weth],
    });

    await run("verify:verify", {
        address: portfolioManager.target,
        constructorArguments: [signer, biscuitV1.target],
    });

    await run("verify:verify", {
        address: biscuitV2.target,
        constructorArguments: [signer.address],
    });

    await run("verify:verify", {
        address: signatureHelper.target,
        constructorArguments: [],
    });

    const result = {
        SwapLibrary: SwapLibrary.target,
        biscuitV1: biscuitV1.target,
        portfolioManager: portfolioManager.target,
        biscuitV2: biscuitV2.target,
        signatureHelper: signatureHelper.target
    };

    fs.writeFileSync("DeployedAddresses.json", JSON.stringify(result, null, 2));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
