// SPDX-License-Identifier: GPLv3
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenExchanger {

    IERC20 public immutable daoToken;
    IERC20 public immutable stableCoin;
    uint256 public immutable creationTime;
    uint8 public immutable interestRate;
    

    constructor(
        IERC20 _daoToken,
        IERC20 _stableCoin
    ) {
        daoToken = _daoToken;
        stableCoin = _stableCoin;
        creationTime = block.timestamp - 15778463; //half a year in the past for demo purposes
        interestRate = 5; //percentage of interest rate
    }

    function redeemDaoTokens(uint256 amount) external {
        require(stableCoin.balanceOf(address(this)) >= getAmountWithInterest(amount), "Insufficient funds in the exchanger");
        daoToken.transferFrom(msg.sender, address(this), amount);
        stableCoin.transfer(msg.sender, getAmountWithInterest(amount));
    }

    function getAmountWithInterest(uint256 amount) public view returns(uint256) {
        uint256 timeDifference = block.timestamp - creationTime;
        uint256 interestAmount = (amount * uint256(interestRate) * timeDifference) / (31556926 * 100);
        return amount + interestAmount;
    }
}

//stable coin (fDAI on Goerli):
//0x88271d333C72e51516B67f5567c728E702b3eeE8