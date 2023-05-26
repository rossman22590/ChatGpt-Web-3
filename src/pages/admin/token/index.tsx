import { getAdminTokens, delAdminToken, putAdminToken, postAdminToken, postAdminTokenCheck } from '@/request/adminApi';
import { TokenInfo } from '@/types/admin';
import { ActionType, ModalForm, ProColumns, ProFormGroup, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Form, Tag, message } from 'antd';
import { useRef, useState } from 'react';

const modelsAll = [
	{
		label: 'gpt-4',
		value: 'gpt-4'
	},
	{
		label: 'gpt-4-0314',
		value: 'gpt-4-0314'
	},
	{
		label: 'gpt-4-32k',
		value: 'gpt-4-32k'
	},
	{
		label: 'gpt-4-32k-0314',
		value: 'gpt-4-32k-0314'
	},
	{
		label: 'gpt-3.5-turbo',
		value: 'gpt-3.5-turbo'
	},
	{
		label: 'gpt-3.5-turbo-0301',
		value: 'gpt-3.5-turbo-0301'
	},
	{
		label: 'text-davinci-003',
		value: 'text-davinci-003'
	},
	{
		label: 'text-davinci-002',
		value: 'text-davinci-002'
	},
	{
		label: 'code-davinci-002',
		value: 'code-davinci-002'
	},
	{
		label: 'DALL·E Painting',
		value: 'dall-e'
	}
]

function TokenPage() {

    const tableActionRef = useRef<ActionType>();
    const [form] = Form.useForm<TokenInfo & {
		models: Array<string>
	}>();
    const [edidInfoModal, setEdidInfoModal] = useState<{
        open: boolean,
        info: TokenInfo | undefined
    }>({
        open: false,
        info: undefined
    });
    const columns: ProColumns<TokenInfo>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 180,
        },
        {
            title: 'KEY',
            dataIndex: 'key',
            width: 200,
        },
        {
            title: 'HOST',
            dataIndex: 'host',
            render: (_, data) => {
                return <a href={data.host} target="_blank" rel="noreferrer">{data.host}</a>
            }
        },
		{
            title: 'Available model',
            dataIndex: 'models',
			render: (_, data)=>{
				if(!data.models) return '-'
				const modelTag = data.models.split(',').map((model)=>{
					return <Tag key={model}>{model}</Tag>
				})
				return <>{modelTag}</>
			}
        },
        {
            title: 'Remark',
            dataIndex: 'remarks',
        },
        {
            title: 'State value',
            dataIndex: 'status',
            render: (_, data) => <Tag color={data.status ? 'green' : 'red'}>{data.status ? '正常' : '异常'}</Tag>
        },
        {
            title: 'Quota',
            dataIndex: 'limit',
            render: (_, data) => {
                return (
                    <div>
                        <p>Total quota:{data.limit}</p>
                        <p>Used:{data.usage / 100}</p>
                        <p>There is still left:{data.limit - (data.usage / 100)}</p>
                    </div>
                )
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
            width: 160,
            valueType: 'option',
            fixed: 'right',
            render: (_, data) => [
                <Button
                    key="edit"
                    type="link"
                    onClick={() => {
                        setEdidInfoModal(() => {
							const models = data.models ? data.models.split(',') : []
                            form?.setFieldsValue({
                                ...data,
								models
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
                        delAdminToken({
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
                    const res = await getAdminTokens({
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
                                postAdminTokenCheck({ all: true }).then(()=>{
                                    message.success('Submitted refresh, please check later')
                                });
                            }}
                        >
                            Asynchronous refresh limit
                        </Button>,
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
                            Increase Token
                        </Button>
                    ]
                }}
                rowKey="id"
                search={false}
                bordered
            />
            <ModalForm<TokenInfo & {
				models: Array<string>
			}>
                title="Token information"
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
					const models = values.models.join(',')
                    if (edidInfoModal.info?.id) {
                        console.log('Edit')
                        const res = await putAdminToken({
                            ...values,
							models,
                            id: edidInfoModal.info?.id,
                        });
                        if (res.code) {
                            message.error('Edit failure')
                            return false;
                        }
                        tableActionRef.current?.reload?.();
                    } else {
                        const res = await postAdminToken({
							...values,
							models
						});
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
                <ProFormText
                    name="host"
                    label="Host"
                    placeholder="Host"
                    rules={[{ required: true, message: 'please enter Host', pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*[^\/]$/i }]}
                />
                <ProFormText
                    name="key"
                    label="Key"
                    placeholder="Key"
                    rules={[{ required: true, message: 'please enter Key' }]}
                />
				<ProFormSelect
					name="models"
					label="Applicable model"
					request={async ()=> modelsAll}
					fieldProps={{
						mode: 'multiple',
					}}
					placeholder="Please select the AI model that the current token can be used for"
					rules={[
						{
							required: true,
							message: 'Please select the AI model that the current Token can be used!',
							type: 'array',
						},
					]}
				/>
                <ProFormGroup>
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
                    <ProFormText
                        name="remarks"
                        label="Remark"
                        placeholder="Remark"
                    />
                </ProFormGroup>
            </ModalForm>
        </div>
    )
}

export default TokenPage;
