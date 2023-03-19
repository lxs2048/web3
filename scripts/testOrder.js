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
    const [one,two] = accounts
    try {
        // 初始化查询
        await token.transfer(two,toWei(100000),{
            from: one
        })
        const initAssets = await getAssets(accounts,exchange,token)
        console.log(initAssets,'数据😎😎😎initAssets');
        // 1. 账户1存到交易所一定量ETH，如50
        await exchange.depositEther({
            from: one,
            value: toWei(50)
        })
        // 2. 账户2存到交易所一定量DOL，如10000
        await token.approve(exchange.address,toWei(10000),{
            from:two
        })//授权
        await exchange.depositToken(token.address,toWei(10000),{
            from: two,
        })//转账
        const deposit = await getAssets(accounts,exchange,token)
        console.log(deposit,'数据😎😎😎deposit');
        // 3. 账户1创建订单1ETH兑换100DOL，查看订单状态0
        await exchange.makeOrder(ETHER_ADDRESS,toWei(1),token.address,toWei(100),{
            from: one
        })//补充创建
        const order1 = await exchange.makeOrder(ETHER_ADDRESS,toWei(1),token.address,toWei(100),{
            from: one
        })
        const id1 = order1.logs[0].args.id; // 获取信息的方式
        const initOrder1 = await getOrder(exchange,id1)
        console.log(initOrder1,'数据😎😎😎initOrder1');
        // 4. 账户1取消订单，查看订单状态2
        await exchange.cancelOrder(id1,{
            from: one
        })
        const order1Cancel = await getOrder(exchange,id1)
        console.log(order1Cancel,'数据😎😎😎order1Cancel');
        // 5. 账户1再次创建新订单1ETH兑换100DOL，查看订单状态0
        const order2 = await exchange.makeOrder(ETHER_ADDRESS,toWei(1),token.address,toWei(100),{
            from: one
        })
        const id2 = order2.logs[0].args.id; // 获取信息的方式
        const initOrder2 = await getOrder(exchange,id2)
        console.log(initOrder2,'数据😎😎😎initOrder2');
        // 6. 账户2完成订单，订单状态为1
        await exchange.fillOrder(id2,{
            from:two
        })
        const Order2Fill = await getOrder(exchange,id2)
        console.log(Order2Fill,'数据😎😎😎Order2Fill');
        // 7. 查看账号1和2在交易所的金额，注意小费扣除(配置了2%)，交易完成后交易所里账户1剩余【49ETH、100DOL】，账户2剩余【1ETH、10000 - (100 + 100*2%)】，第一个账号也会累计2%小费
        const finalAssets = await getAssets(accounts,exchange,token)
        console.log(finalAssets,'数据😎😎😎finalAssets');
    } catch (error) {
        console.log(error,'数据😎😎😎error');
    }
    callback()
}

const getAssets = async (accounts,exchange,token) => {
    const [one,two] = accounts
    // 账户1和2在交易所的ETH和DOL
    const oneExchangeETH = await exchange.balanceOf(ETHER_ADDRESS,one)
    const twoExchangeETH = await exchange.balanceOf(ETHER_ADDRESS,two)
    const oneExchangeDOL = await exchange.balanceOf(token.address,one)
    const twoExchangeDOL = await exchange.balanceOf(token.address,two)
    // 账户1和2本身的ETH和DOL
    const oneSelfDOL = await token.balanceOf(one)
    const twoSelfDOL = await token.balanceOf(two)
    const oneSelfETH = await web3.eth.getBalance(one);
    const twoSelfETH = await web3.eth.getBalance(two);

    return {
        oneExchangeETH: fromWei(oneExchangeETH),
        twoExchangeETH: fromWei(twoExchangeETH),
        oneExchangeDOL: fromWei(oneExchangeDOL),
        twoExchangeDOL: fromWei(twoExchangeDOL),
        oneSelfDOL: fromWei(oneSelfDOL),
        twoSelfDOL: fromWei(twoSelfDOL),
        oneSelfETH: fromWei(oneSelfETH),
        twoSelfETH: fromWei(twoSelfETH),
    }
}
const getOrder = async (exchange,id) =>{
    return exchange.orders(id)
}