const Contacts = artifacts.require("DolToken.sol")
const fromWei = (bn)=>{
    return web3.utils.fromWei(bn,"ether");
}
const toWei = (number)=>{
    return web3.utils.toWei(number.toString(),"ether");
}
module.exports = async function(callback){
    const token = await Contacts.deployed()
    // 转账
    await token.transfer('0x72e32551B6eF58bE2b125F09c4754Daa760d12f7',toWei(10000),{
        from:'0xD1Bc206C1Dba42Cf01A1427dA56e61Dda31dd2bf'
    })
    // 获取第一个账号
    const firstCount = await token.balanceOf
    ('0xD1Bc206C1Dba42Cf01A1427dA56e61Dda31dd2bf')
    console.log('第一',fromWei(firstCount))
    // 获取第二个账号
    const secondCount = await token.balanceOf
    ('0x72e32551B6eF58bE2b125F09c4754Daa760d12f7')
    console.log('第二',fromWei(secondCount))
    callback()
}