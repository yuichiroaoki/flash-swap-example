// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;


contract Base {

    bool internal locked;
	address public owner;

    event Received(address, uint);

    constructor() {
		owner = msg.sender;
    }
    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

}