// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
contract coa{
    struct ownership {
        string creator_name;
        string creator_addr;
        string user_name;
        string user_addr;        
    }
       mapping(bytes32 => ownership) public release;

    function owner(
        bytes32 signupId,
        string memory creator_name,
        string memory creator_addr,
        string memory user_name,
        string memory user_addr
    ) external {
        release[signupId] = ownership(creator_name,creator_addr,user_name,user_addr);
    }
}
