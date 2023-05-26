import { getAdminProducts, delAdminProduct, postAdminProduct, putAdminProduct } from '@/request/adminApi';
import { ProductInfo } from '@/types/admin';
import { ActionType, ModalForm, ProColumns, ProFormDigit, ProFormGroup, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Form, Tag, message } from 'antd';
import { useRef, useState } from 'react';

function ProductPage() {

    const tableActionRef = useRef<ActionType>();
    const [form] = Form.useForm<ProductInfo>();
    const [edidInfoModal, setEdidInfoModal] = useState<{
        open: boolean,
        info: ProductInfo | undefined
    }>({
        open: false,
        info: undefined
    });
    const columns: ProColumns<ProductInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 180,
        },
        {
            title: 'title',
            dataIndex: 'title',
        },
        {
            title: 'price',
            dataIndex: 'price',
            render: (_, data) => {
                return <a>{data.price}分</a>
            }
        },
        {
            title: 'Original price',
            dataIndex: 'original_price',
            render: (_, data) => {
                return <a>{data.original_price}point</a>
            }
        },
        {
            title: 'Points/days',
            dataIndex: 'integral',
            render: (_, data) => {
                return <a>{data.integral ? data.integral + 'integral' : data.day ? data.day + 'sky' : '-'}</a>
            }
        },
        {
            title: 'State value',
            dataIndex: 'status',
            render: (_, data) => <Tag color={data.status ? 'green' : 'red'}>{data.status ? 'Put on the shelves' : 'dropUp '}</Tag>
        },
        {
            title: 'Creation time',
            dataIndex: 'create_time',
        },
        {
            title: 'Update time',
            dataIndex: 'update_time',
        },
        {
            title: 'operate',
            width: 160,
            valueType: 'option',
            fixed: 'right',
            render: (_, data) => [
                <Button
                    key="edit"
                    type="link"
                    onClick={() => {
                        setEdidInfoModal(() => {
                            form?.setFieldsValue({
                                ...data
                            });
                            return {
                                open: true,
                                info: data
                            }
                        });
                    }}
                >
                    edit
                </Button>,
                <Button
                    key="del"
                    type="text"
                    danger
                    onClick={() => {
                        delAdminProduct({
                            id: data.id
                        }).then((res) => {
                            if (res.code) return
                            message.success('successfully deleted')
                            tableActionRef.current?.reload()
                        })
                    }}
                >
                    delete
                </Button>
            ]
        }
    ];

    return (
        <div>
            <ProTable
                actionRef={tableActionRef}
                columns={columns}
                scroll={{
                    x: 1200
                }}
                request={async (params, sorter, filter) => {
                    // Form search items will be passed in from Params and passed to the rear port interface.
                    const res = await getAdminProducts({
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
                    actions: [
                        <Button
                            key="primary"
                            type="primary"
                            size="small"
                            onClick={() => {
                                setEdidInfoModal(() => {
                                    return {
                                        open: true,
                                        info: undefined
                                    }
                                });
                            }}
                        >
                            新增商品
                        </Button>
                    ]
                }}
                rowKey="id"
                search={false}
                bordered
            />
            <ModalForm<ProductInfo>
                title="Product information"
                open={edidInfoModal.open}
                form={form}
                initialValues={{
                    status: 1
                }}
                onOpenChange={(visible) => {
                    if (!visible) {
                        form.resetFields();
                    }
                    setEdidInfoModal((info) => {
                        return {
                            ...info,
                            open: visible
                        }
                    })
                }}
                onFinish={async (values) => {
                    console.log(values);
                    if(!values.integral && !values.day){
                        message.error('Please fill in the points or days')
                        return false
                    }
                    const data = { ...values }
                    if(values.integral){
                        data.day = 0
                    }else if (values.day) {
                        data.integral = 0
                    }
                    if (edidInfoModal.info?.id) {
                        console.log('Enter the editor ')
                        const res = await putAdminProduct({
                            ...data,
                            id: edidInfoModal.info?.id,
                        });
                        if (res.code) {
                            message.error('Edit failure')
                            return false;
                        }
                        tableActionRef.current?.reload?.();
                    } else {
                        const res = await postAdminProduct(data);
                        if (res.code) {
                            message.error('New failure')
                            return false
                        }
                        tableActionRef.current?.reloadAndRest?.();
                        message.success('Submitted successfully');
                    }
                    return true;
                }}
                size="large"
                modalProps={{
                    cancelText: 'Cancel',
                    okText: 'submit'
                }}
            >
                <ProFormGroup>
                    <ProFormText
                        name="title"
                        label="title"
                        placeholder="title"
                        rules={[{ required: true, message: 'Please enter the product title ' }]}
                    />
                    <ProFormText
                        name="badge"
                        label="Subscript"
                        placeholder="Subscript"
                        rules={[{ required: true, message: 'Please enter the corner label' }]}
                    />
                    <ProFormRadio.Group
                        name="status"
                        label="state"
                        radioType="button"
                        options={[
                            {
                                label: 'Get off the shelves',
                                value: 0,
                            },
                            {
                                label: 'Put on the shelves',
                                value: 1,
                            },
                        ]}
                    />
                </ProFormGroup>

                <ProFormGroup>
                    <ProFormDigit
                        label="Price (score)"
                        name="price"
                        min={1}
                        max={1000000}
                        rules={[{ required: true, message: 'Please enter the price of the product, the unit is divided into' }]}
                    />
                    <ProFormDigit
                        label="Original price (score)"
                        name="original_price"
                        min={0}
                        max={1000000}
                    />
                </ProFormGroup>
                <ProFormGroup>
                    <ProFormDigit
                        width="sm"
                        label="积分"
                        name="integral"
                        min={0}
                        max={1000000}
                    />
                    <ProFormDigit
                        width="sm"
                        label="Number of membership days"
                        name="day"
                        min={0}
                        max={1000000}
                    />
                </ProFormGroup>
                <p>Points and days can only be filled in one (such as filling in both to get the points first)</p>
            </ModalForm>
        </div>
    )
}

export default ProductPage;
