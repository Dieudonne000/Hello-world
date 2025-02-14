const HelloWorld = artifacts.require("HelloWorld");

contract("HelloWorld", accounts => {
  it("should return the initial message", async () => {
    const instance = await HelloWorld.deployed();
    const message = await instance.getMessage();
    assert.equal(message, "Hello World!", "Initial message should be 'Hello World!'");
  });

  it("should update the message", async () => {
    const instance = await HelloWorld.deployed();
    await instance.setMessage("New message");
    const message = await instance.getMessage();
    assert.equal(message, "New message", "Message should be updated");
  });
}); 