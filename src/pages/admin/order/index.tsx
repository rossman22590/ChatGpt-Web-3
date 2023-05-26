import { getAdminOrders } from '@/request/adminApi';
import { OrderInfo } from '@/types/admin';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Modal, Tag } from 'antd';
import { useRef, useState } from 'react';
import styles from './index.module.less';

function OrderPage() {

    const tableActionRef = useRef<ActionType>();
    const [isModalOpen, setIsModalOpen] = useState({
        open: false,
        title: '',
        json: ''
    });

    const columns: ProColumns<OrderInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 180,
            fixed: 'left'
        },
        {
            title: 'Payer ID',
            dataIndex: 'trade_no',
            render: (_, data) => (
                <a onClick={() => {
                    if (data.notify_info && data.trade_no) {
                        setIsModalOpen({
                            title: 'Payer notification parameter',
                            json: data.notify_info,
                            open: true
                        })
                    }
                }
                }

                >{data.trade_no ? data.trade_no : 'unpaid'}
                </a>
            )
        },
        {
            title: 'Product title',
            dataIndex: 'product_title',
            render: (_, data) => (
                <a onClick={() => {
                    setIsModalOpen({
                        title: 'Product information',
                        json: data.product_info,
                        open: true
                    })
                }}
                >{data.product_title}
                </a>
            )
        },
        {
            title: 'Payment Types',
            dataIndex: 'pay_type',
            width: 120,
            render: (_, data) => {
                const type: { [key: string]: { [key: string]: string } } = {
                    alipay: {
                        color: 'blue',
                        text: 'Alipay'
                    },
                    wxpay: {
                        color: 'green',
                        text: 'WeChat payment'
                    },
					qqpay: {
                        color: 'geekblue',
                        text: 'QQ payment'
                    }
                }
                return <Tag color={type[data.pay_type].color}>{type[data.pay_type].text}</Tag>
            }
        },
        {
            title: 'Payment amount',
            dataIndex: 'money',
            width: 120,
            render: (_, data) => <Tag color="blue">{data.money}元</Tag>
        },
        {
            title: 'Order Status',
            dataIndex: 'trade_status',
            width: 180,
            render: (_, data) => {
                const status:{ [key: string]: { [key: string]: string } } = {
                    TRADE_AWAIT: {
                        color: 'orange',
                        text: 'wait for payment'
                    },
                    TRADE_SUCCESS: {
                        color: 'green',
                        text: 'payment successful'
                    },
                    TRADE_CLOSED: {
                        color: 'red',
                        text: 'Order off'
                    },
                    TRADE_FINISHED: {
                        color: 'purple',
                        text: 'Finish'
                    }
                }
                return <Tag color={status[data.trade_status].color}>{status[data.trade_status].text}</Tag>
            }
        },
        {
            title: 'User ID',
            width: 200,
            dataIndex: 'user_id',
        },
        {
            title: 'Payment channel',
            dataIndex: 'channel',
            width: 120,
            render: (_, data) => (
                <a onClick={() => {
                    setIsModalOpen({
                        title: 'Payment channel information',
                        json: data.payment_info,
                        open: true
                    })
                }}
                >{data.channel}
                </a>

            )
        },
        {
            title: 'Payment link',
            dataIndex: 'pay_url',
            ellipsis: true,
            render: (_, data) => <a href={data?.pay_url || ''} target="_blank" rel="noreferrer">{data.pay_url}</a>
        },
        {
            title: 'Extra parameter',
            dataIndex: 'params',
            width: 100,
            render: (_, data) => (
                <a onClick={() => {
                    setIsModalOpen({
                        title: 'Extra parameter',
                        json: data.params,
                        open: true
                    })
                }}
                >
                    Click to view
                </a>
            )
        },
        {
            title: 'IP',
            dataIndex: 'ip',
        },
        {
            title: 'Creation time',
            dataIndex: 'create_time',
        },
        {
            title: 'Update time',
            dataIndex: 'update_time',
        },
        // {
        //     title: 'operate',
        //     width: 160,
        //     valueType: 'option',
        //     fixed: 'right',
        //     render: (_, data) => [
        //         <Button
        //             key="edit"
        //             type="link"
        //             onClick={() => {
        //                 setEdidInfoModal(() => {
        //                     form?.setFieldsValue({
        //                         ...data
        //                     });
        //                     return {
        //                         open: true,
        //                         info: data
        //                     }
        //                 });
        //             }}
        //         >
        //             edit
        //         </Button>,
        //         <Button
        //             key="del"
        //             type="text"
        //             danger
        //             onClick={() => {
        //                 delAdminProduct({
        //                     id: data.id
        //                 }).then((res) => {
        //                     if (res.code) return
        //                     message.success('successfully deleted')
        //                     tableActionRef.current?.reload()
        //                 })
        //             }}
        //         >
        //             delete
        //         </Button>
        //     ]
        // }
    ];

    function syntaxHighlight(json: string) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    return (
        <div>
            <ProTable
                actionRef={tableActionRef}
                columns={columns}
                scroll={{
                    x: 2000
                }}
                request={async (params, sorter, filter) => {
                    // Form search items will be passed in from Params and passed to the rear port interface.
                    const res = await getAdminOrders({
                        page: params.current || 1,
                        page_size: params.pageSize || 10,
                    });
                    return Promise.resolve({
                        data: res.data.rows,
                        total: res.data.count,
                        success: true,
                    });
                }}
                toolbar={{
                    actions: []
                }}
                rowKey="id"
                search={false}
                bordered
            />

            <Modal
                title={isModalOpen.title}
                open={isModalOpen.open}
                onOk={() => {
                    setIsModalOpen(() => {
                        return {
                            title: '',
                            open: false,
                            json: ''
                        }
                    })
                }}
                onCancel={() => {
                    setIsModalOpen(() => {
                        return {
                            title: '',
                            open: false,
                            json: ''
                        }
                    })
                }}
            >
                {
                    isModalOpen.json && (
                        <pre className={styles.jsonPre} dangerouslySetInnerHTML={{
                            __html: syntaxHighlight(JSON.stringify(JSON.parse(isModalOpen.json), null, 4))
                        }}
                        />
                    )
                }
            </Modal>
        </div>
    )
}

export default OrderPage;
