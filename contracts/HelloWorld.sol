// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;  // Explicit version

contract HelloWorld {
    string private message;
    
    // Add event for better frontend tracking
    event MessageUpdated(string newMessage);

    constructor() {
        message = "Hello World!";
        emit MessageUpdated("Hello World!");
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function setMessage(string calldata newMessage) public {  // Using calldata for gas optimization
        require(bytes(newMessage).length > 0, "Message cannot be empty");
        message = newMessage;
        emit MessageUpdated(newMessage);
    }
} 