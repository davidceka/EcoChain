// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
contract Prova{
    ufixed8x1 ris=0;
    uint256 var1=25;
    uint256 var2=2;
    function getRis() public returns(ufixed8x1){
        ris=10*2/100;
        return ris;
    }
}