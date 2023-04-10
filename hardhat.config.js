require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
require("dotenv").config();
const { PRIVATE_KEY, GOERLI_URL, ETHERSCAN_API } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: GOERLI_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API,
  },
};
