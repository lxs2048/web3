import { Card, Col, Row, Badge, Table, Tag, Button } from 'antd';
import dayjs from 'dayjs'
import useReduxStore from '../../hooks/useReduxStore'
import { ETHER_ADDRESS } from '../../redux/slices/balanceSlice';
export const convert = (n) => {
    if (!n || !window.WEB) return ''
    return window.WEB.web3.utils.fromWei(n, "ether")
}
const timestampFormat = (timestamp) => {
    return dayjs(timestamp * 1000).format('YYYY/MM/DD')
}
export const balanceType = (address) => {
    if (address === ETHER_ADDRESS) {
        return 'ETH'
    }
    return 'DOL'
}
const getPendingOrder = (order = {}) => {
    if (!window.WEB) return {
        my: [],
        other: []
    }
    const { AllOrders = [], CancelOrders = [], FillOrders = [] } = order;
    const filterIds = [...CancelOrders, ...FillOrders].map(item => item.id);
    const pendingOrders = AllOrders.filter(item => !filterIds.includes(item.id));
    return {
        my: pendingOrders.filter(item => item.createUser === window.WEB.Account),
        other: pendingOrders.filter(item => item.createUser !== window.WEB.Account),
    }
}
function Order() {
    const [order, dispatch] = useReduxStore(state => state.order)
    console.log(order, '数据😎😎😎state');
    const columns = [
        {
            title: '时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => {
                return <span>{timestampFormat(timestamp)}</span>
            }
        },
        {
            title: '原始',
            dataIndex: 'tokenFrom',
            key: 'tokenFrom',
            render: (tokenFrom, item) => {
                return <>
                    <Tag color="green">{balanceType(tokenFrom)}</Tag>
                    <b>{convert(item.amountFrom)}</b>
                </>
            }
        },
        {
            title: '目标',
            dataIndex: 'tokenTo',
            key: 'tokenTo',
            render: (tokenTo, item) => {
                return <>
                    <Tag color="cyan">{balanceType(tokenTo)}</Tag>
                    <b>{convert(item.amountTo)}</b>
                </>
            }
        },
    ];

    const columnsMy = [
        ...columns,
        {
            title: '操作',
            dataIndex: 'id',
            key: 'id',
            render: (id) => {
                return <Button danger onClick={() => {
                    const { Instance: { exchangeInstance }, Account } = window.WEB || {}
                    exchangeInstance && exchangeInstance.methods.cancelOrder(id).send({
                        from: Account
                    })
                }}>取消</Button>
            }
        }
    ]
    const columnsOther = [
        ...columns,
        {
            title: '操作',
            dataIndex: 'id',
            key: 'id',
            render: (id) => {
                return <Button danger onClick={() => {
                    const { Instance: { exchangeInstance }, Account } = window.WEB || {}
                    exchangeInstance && exchangeInstance.methods.fillOrder(id).send({
                        from: Account
                    })
                }}>买入</Button>
            }
        }
    ]

    return (
        <div style={{ width: '100%', padding: '16px', boxSizing: 'border-box' }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Badge.Ribbon text="已完成" color="#597ef7">
                        <Card title="全部订单" bordered={false}>
                            <Table dataSource={order.FillOrders} columns={columns} rowKey="id" />
                        </Card>
                    </Badge.Ribbon>
                </Col>
                <Col span={8}>
                    <Badge.Ribbon text="进行中" color="#95de64">
                        <Card title="我的订单" bordered={false}>
                            <Table dataSource={getPendingOrder(order)['my']} columns={columnsMy} rowKey="id" />
                        </Card>
                    </Badge.Ribbon>
                </Col>
                <Col span={8}>
                    <Badge.Ribbon text="进行中" color="#95de64">
                        <Card title="其他订单" bordered={false}>
                            <Table dataSource={getPendingOrder(order)['other']} columns={columnsOther} rowKey="id" />
                        </Card>
                    </Badge.Ribbon>
                </Col>
            </Row>
        </div>
    )
}

export default Order