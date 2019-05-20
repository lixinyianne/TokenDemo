var XYtoken = artifacts.require("./XYtoken.sol")

module.exports = function(deployer) {
    deployer.deploy(XYtoken);
};