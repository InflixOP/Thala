// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
contract buy_token{
    struct buy_tok {
        string creator_name;
        string creator_addr;
        string channel_name;
        string user_name;
        string user_addr;
    }
       mapping(bytes32 => buy_tok) public buy;

    function buyToken(
        bytes32 signupId,
        string memory creator_name,
        string memory creator_addr,
        string memory channel_name,
        string memory user_name,
        string memory user_addr
    ) external {
        buy[signupId] = buy_tok(creator_name,creator_addr, channel_name,user_name,user_addr);
    }
}
