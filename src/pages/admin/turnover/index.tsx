import { delAdminTurnover, getAdminTurnovers, putAdminTurnover } from '@/request/adminApi';
import { TurnoverInfo } from '@/types/admin';
import { ActionType, ModalForm, ProColumns, ProFormGroup, ProFormText } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { useRef, useState } from 'react';

function TurnoverPage() {

    const tableActionRef = useRef<ActionType>();
    const [form] = Form.useForm<TurnoverInfo>();
    const [edidInfoModal, setEdidInfoModal] = useState<{
        open: boolean,
        info: TurnoverInfo | undefined
    }>({
        open: false,
        info: undefined
    });

    const columns: ProColumns<TurnoverInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 180,
        },
        {
            title: 'userID',
            width: 180,
            dataIndex: 'user_id',
        },
        {
            title: 'operate',
            dataIndex: 'describe',
        },
        {
            title: 'value',
            dataIndex: 'value',
            render: (_, data) => <a>{data.value}</a>
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
            valueType: 'option',
            fixed: 'right',
            width: 160,
            render: (_, data) => [
                <Button key="edit" type="link" onClick={() => {
                    setEdidInfoModal({
                        open: true,
                        info: data
                    })
                    form.setFieldsValue({
                        ...data
                    })
                }}
                >
                    edit
                </Button>,
                <Button key="del" type="text" danger onClick={() => {
                    delAdminTurnover({
                        id: data.id
                    }).then((res) => {
                        if (res.code) return
                        message.success('successfully deleted')
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
                scroll={{
                    x: 1200
                }}
                request={async (params, sorter, filter) => {
                    //Form search items will be passed in from Params and passed to the rear port interface.
                    const res = await getAdminTurnovers({
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

            <ModalForm<TurnoverInfo>
                title="User Consumption Record"
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
                    const res = await putAdminTurnover({
                        ...edidInfoModal.info,
                        ...values,
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
                <ProFormText
                    width="lg"
                    name="user_id"
                    label="User ID "
                    placeholder="User ID"
                    disabled
                />
                <ProFormGroup>
                    <ProFormText
                        width="lg"
                        name="describe"
                        label="describe"
                        placeholder="Description"
                        rules={[{ required: true, message: 'Please enter the operation description!' }]}
                    />
                    <ProFormText
                        name="value"
                        label="value"
                        placeholder="Operation corresponding value!"
                        rules={[{ required: true, message: 'Please enter the corresponding value!' }]}
                    />
                </ProFormGroup>

            </ModalForm>
        </div>
    )
}

export default TurnoverPage;
