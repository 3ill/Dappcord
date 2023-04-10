const hre = require("hardhat");

const tokens = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), "ether");
};

const main = async () => {
  const [deployer] = await hre.ethers.getSigners();

  const NAME = "Thrill";
  const SYMBOL = "3ILL";

  //Deploy the contract

  const Dappcord = await hre.ethers.getContractFactory("Dappcord");
  const dappcord = await Dappcord.deploy(NAME, SYMBOL);
  await dappcord.deployed();

  const deployerAddress = await deployer.address;
  console.log(
    "🚀 ~ file: deploy.js:20 ~ main ~ deployerAddress:",
    deployerAddress
  );

  console.log(`Deployed contract at => ${dappcord.address}`);

  /**
   * ! creating 3 channels
   */

  const CHANNELS_NAME = ["General", "intro", "jobs"];
  const COSTS = [tokens(1), tokens(0), tokens(0.25)];

  for (let i = 0; i < 3; i++) {
    const transaction = await dappcord
      .connect(deployer)
      .createChannel(CHANNELS_NAME[i], COSTS[i]);
    await transaction.wait();

    console.log(`Created the following channels #${CHANNELS_NAME[i]}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
