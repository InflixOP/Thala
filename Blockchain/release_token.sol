// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
contract release_token{
    struct release_tok {
        string creator_name;
        string creator_addr;
        uint256 number;
    }
       mapping(bytes32 => release_tok) public release;

    function relToken(
        bytes32 signupId,
        string memory creator_name,
        string memory creator_addr,
        uint256 number
    ) external {
        release[signupId] = release_tok(creator_name,creator_addr,number);
    }
}
