const DolToken = artifacts.require("DolToken.sol")
const Exchange = artifacts.require("Exchange.sol")

const fromWei = (bn)=>{
    return web3.utils.fromWei(bn,"ether");
}
const toWei = (number)=>{
    return web3.utils.toWei(number.toString(),"ether");
}
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';//address(0)默认地址0x后40个0
module.exports = async function(callback){
    const token = await DolToken.deployed()
    const exchange = await Exchange.deployed()
    const accounts = await web3.eth.getAccounts()
    // 提取以太坊币测试
    await exchange.withdrawEther(toWei(2),{
        from:accounts[0],
    })
    let ret = await exchange.balanceOf(ETHER_ADDRESS,accounts[0])
    console.log(fromWei(ret))
    // 提取不需要授权
    await exchange.withdrawToken(token.address,toWei(500),{
        from:accounts[0]
    })
    // 3.查看结果
    let ret1 = await exchange.balanceOf(token.address,accounts[0])
    let ret2 = await token.balanceOf(accounts[0])
    console.log(fromWei(ret1),fromWei(ret2))

    callback()
}