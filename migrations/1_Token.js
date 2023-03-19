const Contacts = artifacts.require("DolToken.sol")
const Exchange = artifacts.require("Exchange.sol")
module.exports = async function(deployer){
    const accounts = await web3.eth.getAccounts()
    await deployer.deploy(Contacts)
    await deployer.deploy(Exchange,accounts[0],2)
}