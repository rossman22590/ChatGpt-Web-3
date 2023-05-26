import UserHead from '@/components/UserHead';
import { delAdminUsers, getAdminUsers, putAdminUsers } from '@/request/adminApi';
import { UserInfo } from '@/types/admin';
import { ActionType, ModalForm, ProColumns, ProFormDatePicker, ProFormDigit, ProFormGroup, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Tag, Button, Space, message, Form } from 'antd';
import { useRef, useState } from 'react';

function UserPage() {

    const tableActionRef = useRef<ActionType>();
    const [form] = Form.useForm<UserInfo>();
    const [edidInfoModal, setEdidInfoModal] = useState<{
        open: boolean,
        info: UserInfo | undefined
    }>({
        open: false,
        info: undefined
    });
    const columns: ProColumns<UserInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 180,
        },
        {
            title: '账号',
            width: 200,
            dataIndex: 'account',
        },
        {
            title: 'integral',
            width: 100,
            dataIndex: 'integral',
            render: (_, data) => <a>{data.integral}分</a>
        },
        {
            title: 'subscription',
            dataIndex: 'subscribe',
            render: (_, data) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const todayTime = today.getTime()
                const userSubscribeTime = new Date(data.subscribe).getTime()
                return (
                    <Space wrap>
                        <Tag>{data.subscribe}</Tag>
                        {userSubscribeTime < todayTime && <Tag color="red">已过期</Tag>}
                    </Space>
                )
            }
        },
        {
            title: 'User Info',
            dataIndex: 'user_id',
            width: 160,
            render: (_, data) => {
                return (
                    <UserHead headimgurl={data.avatar} nickname={data.nickname} />
                )
            }
        },
        {
            title: 'ip',
            dataIndex: 'ip',
        },
        {
            title: 'state',
            dataIndex: 'status',
            width: 100,
            render: (_, data) => {
                return <Tag color="green">{data.status === 1 ? '正常' : '异常'}</Tag>
            }
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
            width: 150,
            valueType: 'option',
            fixed: 'right',
            render: (_, data) => [
                <Button key="del" type="link" onClick={() => {
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
                <Button key="del" type="text" danger onClick={() => {
                    delAdminUsers({
                        id: data.id
                    }).then((res) => {
                        if (res.code) return
                        message.success('删除成功')
                        tableActionRef.current?.reloadAndRest?.()
                    })
                }}
                >
                    delete
                </Button>
            ],
        },
    ];

    return (
        <div>
            <ProTable
                actionRef={tableActionRef}
                columns={columns}
                params={{

                }}
                pagination={{}}
                scroll={{
                    x: 1800
                }}
                request={async (params, sorter, filter) => {
                    // Form search items will be passed in from Params and passed to the rear port interface.
                    const res = await getAdminUsers({
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
                    actions: [],
                }}
                rowKey="id"
                search={false}
                bordered
            />
            <ModalForm<UserInfo>
                title="User Info"
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
                    if(!edidInfoModal.info?.id) return false
                    const res = await putAdminUsers({
                        ...values,
                        id: edidInfoModal.info?.id,
                    });
                    if (res.code) {
                        message.error('Edit failure')
                        return false;
                    }
                    tableActionRef.current?.reload?.();
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
                        width="md"
                        name="account"
                        label="user account"
                        rules={[{ required: true, message: 'Please enter the user account' }]}
                    />
                    <ProFormRadio.Group
                        name="role"
                        label="Role"
                        radioType="button"
                        options={[
                            {
                                label: 'user',
                                value: 'user',
                            },
                            {
                                label: 'administrator',
                                value: 'administrator',
                            },
                        ]}
                        rules={[{ required: true, message: 'Please enter the remaining points' }]}
                    />
                    <ProFormRadio.Group
                        name="status"
                        label="state"
                        radioType="button"
                        options={[
                            {
                                label: 'abnormal',
                                value: 0,
                            },
                            {
                                label: 'normal',
                                value: 1,
                            },
                        ]}
                        rules={[{ required: true, message: 'Please enter the remaining points' }]}
                    />
                </ProFormGroup>
                <ProFormGroup>
                    <ProFormText
                        name="nickname"
                        label="user name"
                        rules={[{ required: true, message: 'Please enter the user name' }]}
                    />
                    <ProFormText
                        width="lg"
                        name="avatar"
                        label="profile picture"
                        rules={[{ required: true, message: 'Please enter the user avatar' }]}
                    />
                </ProFormGroup>

                <ProFormGroup>
                    <ProFormDigit
                        label="Remaining points"
                        name="integral"
                        min={0}
                        max={1000000}
                        rules={[{ required: true, message: 'Please enter the remaining points' }]}
                    />
                    <ProFormDatePicker
                        width="md"
                        name="subscribe"
                        label="There will be deadline"
                        rules={[{ required: true, message: 'Please enter the remaining points' }]}
                    />
                </ProFormGroup>
            </ModalForm>
        </div>
    )
}

export default UserPage;
