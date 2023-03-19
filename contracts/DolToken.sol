// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;
// 导入安全数学方法
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
contract DolToken {
    using SafeMath for uint256;//为uint256后面使用sub，add方法
    string public name = 'DolToken';//自定生成getter方法
    string public symbol = 'DOL';//令牌的名称
    uint256 public decimals = 18;//令牌使用的小数位数
    uint256 public totalSupply;//供应量
    // mapping类型
    mapping(address => uint256) public balanceOf;//返回地址为 的另一个帐户的帐户余额
    // 事件在合约中一旦被触发，会把传递进来的参数存储到交易的日志中，与合约的地址关联，合并到区块链中，区块可以访问交易的日志，前端可以对日志进行追踪，如前端可以监听一笔交易完成后在请求获取余额，还可以订阅transfer事件
    event Transfer(address indexed _from, address indexed _to, uint256 _value);//本身是在代币协议中必须要求的，不可更改，公开透明，以太坊也会订阅这个事件
    mapping(address => mapping(address => uint256)) public allowance;
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    constructor(){
        totalSupply = 1000000 * (10 ** decimals);
        // 部署智能合约需要一个账号从里面扣款，从配置中拿到from里填写的账户，测试时不填默认是第一账户
        balanceOf[msg.sender] = totalSupply;//部署账号拥有所有代币
    }
    function transfer(address _to, uint256 _value) public returns (bool success){
        require(_to != address(0));//需要有效地址
        _transfer(msg.sender, _to, _value);
        return true;
    }
    function _transfer(address _from,address _to,uint256 _value) internal {
        require(balanceOf[_from] >= _value);//true正常执行，否则抛出错误，会被以太坊的接口接收纳入到日志中，同时退回gas
        // 从哪个账号发起的调用者
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        // 触发事件
        emit Transfer(_from, _to, _value);
    }
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        // _from某个放款账号
        // _to 收款账号
        // msg.sender 交易所账号地址
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);//账户和授权了的金额不小于当前转账金额
        // 从授权金额中减去准备转账的值
        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
        // 转账
        _transfer(_from,_to,_value);
        return true;
    }
    function approve(address _spender, uint256 _value) public returns (bool success){
        // msg.sender 当前网页登录账号
        // _spender 第三方交易所的账号地址
        // _value 授权钱数
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender,_value);
        return true;
        /*
            不同账号授权给不同交易所的额度的JS数据结构
            {
                user1:{
                    A:100,
                    B:200,
                }
                user2:{
                    A:100,
                    C:200,
                }
            }
         */
    }
}