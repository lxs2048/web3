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
    // 存储以太坊币测试
    await exchange.depositEther({
        from:accounts[0],
        value:toWei(10)
    })
    let ret = await exchange.tokens(ETHER_ADDRESS,accounts[0])
    console.log(fromWei(ret))
    // 1.授权
    await token.approve(exchange.address,toWei(10000),{
        from:accounts[0]
    })
    // 2.存储
    await exchange.depositToken(token.address,toWei(10000),{
        from:accounts[0]
    })
    // 3.查看，每执行一次累计存10000，还可以添加自定义代币查看剩余
    let ret1 = await exchange.tokens(token.address,accounts[0])
    let ret2 = await token.balanceOf(accounts[0])
    console.log(fromWei(ret1),fromWei(ret2))

    callback()
}