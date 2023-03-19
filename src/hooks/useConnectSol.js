import { useEffect, useState } from "react"
import Web3 from 'web3'
import tokenJson from '../build/DolToken.json'
import exchangeJson from '../build/Exchange.json'
function useConnectSol() {
    const [init,setInit] = useState({})
    useEffect(() => {
        async function start() {
            const initData = await initWeb()
            window.WEB = initData
            setInit(initData)
        }
        start()
    }, [])
    return [init]
}
export default useConnectSol

// 初始化获取web3，授权，获取合约实例
const initWeb = async () => {
    // 连接
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    // 授权
    const accounts = await requestAccounts(web3)
    // 货币合约实例
    const tokenInstance = await getInstance(web3, tokenJson)
    const exchangeInstance = await getInstance(web3, exchangeJson)
    return {
        web3: web3,
        Account: accounts[0],
        Instance: {
            tokenInstance,
            exchangeInstance
        }
    }
}

// 授权
const requestAccounts = async (web3) => {
    return web3.eth.requestAccounts()
}

// 获取合约实例
const getInstance = async (web3, json) => {
    // 网络id
    const networkId = await web3.eth.net.getId()
    const abi = json.abi
    const address = json.networks[networkId].address
    const contractObj = await new web3.eth.Contract(abi, address)
    return contractObj
}