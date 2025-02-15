// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HelloWorld {
    string private message;
    
    event MessageUpdated(string newMessage);

    constructor() {
        message = "Hello World!";
        emit MessageUpdated("Hello World!");
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function setMessage(string memory newMessage) public {
        message = newMessage;
        emit MessageUpdated(newMessage);
    }
} 