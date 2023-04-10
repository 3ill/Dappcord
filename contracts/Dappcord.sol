// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Dappcord is ERC721 {
    using Counters for Counters.Counter;
    address public immutable Owner;
    mapping(uint256 => Channels) public dappcordChannels;
    mapping(uint256 => mapping(address => bool)) public hasJoined;
    uint256 public totalChannels;
    uint256 public totalSupply;

    struct Channels {
        uint256 id;
        string name;
        uint256 cost;
    }

    modifier onlyOwner() {
        require(msg.sender == Owner, "Not the owner");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        Owner = msg.sender;
    }

    function mint(uint256 _id) public payable {
        require(_id != 0);
        require(_id <= totalChannels);
        require(hasJoined[_id][msg.sender] == false);
        require(msg.value >= dappcordChannels[_id].cost);
        hasJoined[_id][msg.sender] = true;
        totalSupply++;
        _safeMint(msg.sender, totalSupply);
    }

    function createChannel(
        string memory _name,
        uint256 _cost
    ) public onlyOwner {
        totalChannels++;
        dappcordChannels[totalChannels] = Channels(totalChannels, _name, _cost);
    }

    function getChannel(uint256 _id) public view returns (Channels memory) {
        return dappcordChannels[_id];
    }

    function withdraw() public onlyOwner {
        (bool success, ) = Owner.call{value: address(this).balance}("");
        require(success, "transaction failed");
    }
}
