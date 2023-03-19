const DolToken = artifacts.require("DolToken.sol")
const Exchange = artifacts.require("Exchange.sol")

const fromWei = (bn) => {
    return web3.utils.fromWei(bn, "ether");
}
const toWei = (number) => {
    return web3.utils.toWei(number.toString(), "ether");
}
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';//address(0)默认地址0x后40个0
module.exports = async function (callback) {
    const token = await DolToken.deployed()
    const exchange = await Exchange.deployed()
    const accounts = await web3.eth.getAccounts()
    const [one, two] = accounts
    try {
        // 1.平分DOL
        await token.transfer(two, toWei(500000), {
            from: one
        })
        // 2.各自存500ETH
        await exchange.depositEther({
            from: one,
            value: toWei(500)
        })
        await exchange.depositEther({
            from: two,
            value: toWei(500)
        })
        // 3.各自存DOL
        await token.approve(exchange.address, toWei(250000), {
            from: one
        })//授权
        await exchange.depositToken(token.address, toWei(250000), {
            from: one,
        })//转账
        await token.approve(exchange.address, toWei(250000), {
            from: two
        })//授权
        await exchange.depositToken(token.address, toWei(250000), {
            from: two,
        })//转账
        // 4. 双方都创建订单
        for (let i = 1; i < 6; i++) {
            await exchange.makeOrder(ETHER_ADDRESS, toWei(10*i), token.address, toWei(100*i), {
                from: one
            })
            await exchange.makeOrder(token.address, toWei(100*i),ETHER_ADDRESS, toWei(10*i), {
                from: one
            })
            await exchange.makeOrder(ETHER_ADDRESS, toWei(10*i), token.address, toWei(100*i), {
                from: two
            })
            await exchange.makeOrder(token.address, toWei(100*i),ETHER_ADDRESS, toWei(10*i), {
                from: two
            })
        }
    } catch (error) {
        console.log(error, '数据😎😎😎error');
    }
    callback()
}


