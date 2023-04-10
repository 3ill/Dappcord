const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dappcord", async () => {
  let Dappcord, dappcord, deployer, address1, transaction;
  const name = "Thrill";
  const symbol = "3ill";

  const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether");
  };
  beforeEach(async () => {
    [deployer, address1] = await ethers.getSigners();
    Dappcord = await ethers.getContractFactory("Dappcord");
    dappcord = await Dappcord.deploy(name, symbol);

    //create a channel
    transaction = await dappcord
      .connect(deployer)
      .createChannel("general", tokens(1));
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("Checks the name ", async () => {
      const contractName = await dappcord.name();

      expect(contractName).to.equal(name);
    });

    it("checks the symbol", async () => {
      const contractSymbol = await dappcord.symbol();

      expect(contractSymbol).to.equal(symbol);
    });

    it("Sets the owner", async () => {
      const contractOwner = await dappcord.Owner();

      expect(contractOwner).to.equal(deployer.address);
    });
  });

  describe("Creating Channels", () => {
    it("Checks the amount of channels created", async () => {
      transaction = await dappcord.totalChannels();
      expect(transaction).to.equal(1);
    });

    it("Returns channel attributes", async () => {
      transaction = await dappcord.getChannel(1);
      expect(transaction.id).to.be.equal(1);
      expect(transaction.name).to.be.equal("general");
      expect(transaction.cost).to.be.equal(tokens(1));
    });

    it("Should revert the transaction", async () => {
      await expect(
        dappcord.connect(address1).createChannel("general", tokens(1))
      ).to.be.revertedWith("Not the owner");
    });
  });

  describe("Joining channels", () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("1", "ether");

    beforeEach(async () => {
      const transaction = await dappcord
        .connect(address1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();
    });

    it("The user has joined", async () => {
      const result = await dappcord.hasJoined(ID, address1.address);
      expect(result).to.be.equal(true);
    });

    it("Increase the total supply", async () => {
      const result = await dappcord.totalSupply();
      expect(result).to.be.equal(ID);
    });

    it("updates the contract balance", async () => {
      const balance = await ethers.provider.getBalance(dappcord.address);
      expect(balance).to.be.equal(AMOUNT);
    });
  });

  describe("Withdrawing", () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether");
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);
      const transaction = await dappcord
        .connect(address1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();

      const withdrawal = await dappcord.withdraw();
      await withdrawal.wait();
    });

    it("updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("updates the contract balance", async () => {
      expect(await ethers.provider.getBalance(dappcord.address)).to.be.equal(0);
    });
  });
});
