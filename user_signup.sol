// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
contract user_signup{
    struct user_sign {
        string name;
        string email;
        uint256 age;
        uint256 phone;
        string addr;
    }
       mapping(bytes32 => user_sign) public signup;

    function addUser(
        bytes32 signupId,
        string memory name,
        string memory email,
        uint256 age,
        uint256  phone,
        string memory addr
    ) external {
        signup[signupId] = user_sign(name, email, age, phone,addr);
    }
}
