// SPDX-License-Identifier: GPLv3
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract DaoToken is ERC20, ERC20Burnable {
    constructor() ERC20("DaoToken", "DT") {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }
}