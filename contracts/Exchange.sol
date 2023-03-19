// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;
// 导入安全数学方法
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./DolToken.sol";

contract Exchange {
    using SafeMath for uint256; //为uint256后面使用sub，add方法
    // 收费账户地址
    address public feeAccount;
    uint256 public feePercent; // 费率
    mapping(address => mapping(address => uint256)) public tokens;
    address constant ETHER = address(0);
// 订单结构体
struct _Order {
    uint256 id;
    address createUser;
    address tokenFrom;
    uint256 amountFrom;
    address tokenTo;
    uint256 amountTo;
    uint256 timestamp;
    uint16 status; //0创建1完成2取消
}
// _Order[] orderList;//动态数组形式
mapping(uint256 => _Order) public orders; //maping结构
uint256 public orderCount; //记录总的订单数
event Order(
    uint256 id,
    address createUser,
    address tokenFrom,
    uint256 amountFrom,
    address tokenTo,
    uint256 amountTo,
    uint256 timestamp
);
    event Cancel(
        uint256 id,
        address createUser,
        address tokenFrom,
        uint256 amountFrom,
        address tokenTo,
        uint256 amountTo,
        uint256 timestamp
    );
    event Trade(
        uint256 id,
        address createUser,
        address tokenFrom,
        uint256 amountFrom,
        address tokenTo,
        uint256 amountTo,
        uint256 timestamp
    );

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event WithDraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    // 以太币
    function depositEther() public payable {
        // 有payable才能在调用方法的时候，从msg.sender中划msg.value到合约部署的地址,注意：真的会转
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    // 存其他货币
    function depositToken(address _token, uint256 _amount) public {
        // _token要存的类型货币的地址，_amount要存的金额
        require(_token != ETHER);
        // address(this)当前交易所地址，表示把钱转到当前交易所，msg.sender当前存钱用户
        require(
            DolToken(_token).transferFrom(msg.sender, address(this), _amount)
        );
        // 转账成功后在交易所里记录值
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // 添加查余额方法对标代币查询方法
    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }

    // 提取以太币
    function withdrawEther(uint256 _amount) public {
        // 当前账号有不小于该数额的钱
        require(tokens[ETHER][msg.sender] >= _amount);
        // 把记录减少
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        // 使用payable转账，把当前交易所账户的_amount的以太币转给当前账户
        payable(msg.sender).transfer(_amount);
        // 触发WithDraw事件
        emit WithDraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    // 提取其他币
    function withdrawToken(address _token, uint256 _amount) public {
        // _token要取的类型货币的地址，_amount要取的金额
        require(_token != ETHER);
        // 当前账号有不小于该数额的钱
        require(tokens[_token][msg.sender] >= _amount);
        // 把记录减少
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        // 转账，拿到合约货币的实例，当前合约调用该方法，对应transfer内的msg.sender就是交易所账户
        require(DolToken(_token).transfer(msg.sender, _amount));
        // 触发WithDraw事件
        emit WithDraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // 创建订单
    function makeOrder(
        address _tokenFrom,
        uint256 _amountFrom,
        address _tokenTo,
        uint256 _amountTo
    ) public {
        require(balanceOf(_tokenFrom, msg.sender) >= _amountFrom,unicode'创建订单时余额不足');
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenFrom,
            _amountFrom,
            _tokenTo,
            _amountTo,
            block.timestamp,
            0
        );
        // 发出订单事件
        emit Order(
            orderCount,
            msg.sender,
            _tokenFrom,
            _amountFrom,
            _tokenTo,
            _amountTo,
            block.timestamp
        );
    }

    // 取消订单
    function cancelOrder(uint _id) public {
        _Order memory myorder = orders[_id];
        require(myorder.id == _id);
        require(myorder.createUser == msg.sender);
        // 修改状态
        orders[_id] = _Order(
            myorder.id,
            myorder.createUser,
            myorder.tokenFrom,
            myorder.amountFrom,
            myorder.tokenTo,
            myorder.amountTo,
            myorder.timestamp,
            2
        );//创建时间不变
        // 发出取消事件
        emit Cancel(
            myorder.id,
            myorder.createUser,
            myorder.tokenFrom,
            myorder.amountFrom,
            myorder.tokenTo,
            myorder.amountTo,
            block.timestamp
        );//取消时间
    }

    // 完成订单
    function fillOrder(uint _id) public {
        _Order memory myorder = orders[_id];
        require(myorder.id == _id);
        // msg.sender是要完成兑换的人
        // 交易&手续费
        require(
            _trade(
                myorder.createUser,
                myorder.tokenFrom,
                myorder.amountFrom,
                myorder.tokenTo,
                myorder.amountTo,
                msg.sender
            )
        );
        // todo 完成交易，可以补充完成交易的时间和用户，另外存储或改造结构体
        // 修改状态
        orders[_id] = _Order(
            myorder.id,
            myorder.createUser,
            myorder.tokenFrom,
            myorder.amountFrom,
            myorder.tokenTo,
            myorder.amountTo,
            myorder.timestamp,
            1
        );
        emit Trade(
            myorder.id,
            msg.sender,
            myorder.tokenFrom,
            myorder.amountFrom,
            myorder.tokenTo,
            myorder.amountTo,
            block.timestamp
        );//完成人，完成时间
    }

    // 交易：创建人，准备兑换货币类型，准备兑换货币金额，目标兑换货币类型，目标兑换货币金额，完成人
    function _trade(
        address _createUser,
        address _tokenFrom,
        uint256 _amountFrom,
        address _tokenTo,
        uint256 _amountTo,
        address _fillUser
    ) internal returns (bool) {
        // 计算小费，完成订单的人支付，从目标兑换货币金额中计算
        uint256 feeAmount = _amountTo.mul(feePercent).div(100);
        // 两方的存款要足够
        require(balanceOf(_tokenFrom, _createUser) >= _amountFrom,unicode'创建订单用户余额不足');
        require(balanceOf(_tokenTo, _fillUser) >= _amountTo.add(feeAmount),unicode'完成订单余额不足');
        // todo优化，创建人不足会产生坏账单，不能交换，甚至发起人创建订单后资源可以扩展冻结
        // 针对下单人
        tokens[_tokenFrom][_createUser] = tokens[_tokenFrom][_createUser].sub(
            _amountFrom
        );
        tokens[_tokenTo][_createUser] = tokens[_tokenTo][_createUser].add(
            _amountTo
        );
        // 针对完成订单的人
        tokens[_tokenFrom][_fillUser] = tokens[_tokenFrom][_fillUser].add(
            _amountFrom
        );
        tokens[_tokenTo][_fillUser] = tokens[_tokenTo][_fillUser].sub(
            _amountTo.add(feeAmount)
        ); //多减费用
        // 把小费给配置的账户
        tokens[_tokenTo][feeAccount] = tokens[_tokenTo][feeAccount].add(
            feeAmount
        );
        return true;
    }
}
