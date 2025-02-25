/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-ethers")

module.exports = {
  solidity: "0.7.3",
  defaultNetwork: "ganache",
  networks: {
    hardhat: {},
    ganache: {
      url: 'HTTP://127.0.0.1:7545',
      accounts: ['0xdcf84dc597484077bf45f9136e75f5fca302e9fa3690b54b355b6953b340c9b2'],
    },
  },
}