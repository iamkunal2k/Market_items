const Market_items = artifacts.require("Market_items");

module.exports = function(deployer) {
  deployer.deploy(Market_items);
};
