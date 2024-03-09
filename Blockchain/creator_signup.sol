// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
contract creator_signup{
    struct creator_sign {
        string name;
        string email;
        string platform;
        string addr;
        string channel_id;
        string channel_name;
    }
       mapping(bytes32 => creator_sign) public signup;

    function addUser(
        bytes32 signupId,
        string memory name,
        string memory email,
        string memory platform,
        string memory addr,
        string memory channel_id,
        string memory channel_name
    ) external {
        signup[signupId] = creator_sign(name, email, platform,addr,channel_id,channel_name);
    }
}
