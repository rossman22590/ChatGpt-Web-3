import {
  getAdminPayment,
  delAdminPayment,
  addAdminPayment,
  putAdminPayment
} from '@/request/adminApi'
import { AlipayInfo, PaymentInfo, YipayInfo } from '@/types/admin'
import {
  ActionType,
  BetaSchemaForm,
  ModalForm,
  ProColumns,
  ProFormCheckbox,
  ProFormColumnsType,
  ProFormDependency,
  ProFormGroup,
  ProFormSegmented,
  ProFormText
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Button, Form, Space, Tag, message } from 'antd'
import { useRef, useState } from 'react'

type MIXInfo = PaymentInfo & AlipayInfo & YipayInfo

function PaymentPage() {
  const tableActionRef = useRef<ActionType>()
  const [form] = Form.useForm<MIXInfo>()
  const [edidInfoModal, setEdidInfoModal] = useState<{
    open: boolean
    info: PaymentInfo | undefined
  }>({
    open: false,
    info: undefined
  })

  const columns: ProColumns<PaymentInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180
    },
    {
      title: 'Channel name',
      dataIndex: 'name'
    },
    {
      title: 'Channel code',
      dataIndex: 'channel',
      render: (_, data) => <Tag>{data.channel}</Tag>
    },
    {
      title: 'Available channel',
      dataIndex: 'types',
      render: (_, data) => {
        const typesDom = data.types.split(',').map((type) => {
          return <Tag key={type}>{type}</Tag>
        })
        return <Space>{typesDom}</Space>
      }
    },
    {
      title: 'State value',
      dataIndex: 'status',
      render: (_, data) => (
        <Tag color={data.status ? 'green' : 'red'}>{data.status ? 'online' : 'Go down'}</Tag>
      )
    },
    {
      title: 'Creation time',
      dataIndex: 'create_time'
    },
    {
      title: 'Update time',
      dataIndex: 'update_time'
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
              const json = JSON.parse(data.params)
              const types = data.types.split(',')
              form?.setFieldsValue({
                ...data,
                ...json,
                types
              })
              return {
                open: true,
                info: {
                  ...data,
                  ...json,
                  types
                }
              }
            })
          }}
        >
          edit
        </Button>,
        <Button
          key="del"
          type="text"
          danger
          onClick={() => {
            delAdminPayment({
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
  ]

  const payKeyColumns: { [key: string]: Array<ProFormColumnsType> } = {
    alipay: [
      {
        title: 'Alipay in person to pay configuration',
        valueType: 'group',
        columns: [
          {
            title: 'applicationID appId',
            dataIndex: 'appId',
            width: 'lg',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: 'This is required'
                }
              ]
            }
          },
          {
            title: 'Encryption keyType',
            dataIndex: 'keyType',
            valueType: 'select',
            width: 's',
            request: async () => [
              {
                label: 'PKCS8',
                value: 'PKCS8'
              },
              {
                label: 'PKCS1',
                value: 'PKCS1'
              }
            ],
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: 'This is required'
                }
              ]
            }
          }
        ]
      },
      {
        title: 'Application private key privateKey',
        dataIndex: 'privateKey',
        valueType: 'textarea',
        fieldProps: {
          autoSize: {
            minRows: 2,
            maxRows: 5
          }
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: 'This is required'
            }
          ]
        }
      },
      {
        title: 'Alipay key alipayPublicKey',
        dataIndex: 'alipayPublicKey',
        valueType: 'textarea',
        fieldProps: {
          autoSize: {
            minRows: 2,
            maxRows: 5
          }
        },
        formItemProps: {
          rules: [
            {
              required: true,
              message: 'This is required'
            }
          ]
        }
      }
    ],
    yipay: [
      {
        title: 'Easy payment configuration',
        valueType: 'group',
        columns: [
          {
            title: 'MerchantID',
            dataIndex: 'pid',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: 'This is required'
                }
              ]
            },
            width: 'md'
          },
          {
            title: 'Merchant key',
            dataIndex: 'key',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: 'This is required'
                }
              ]
            },
            width: 'md'
          },
          {
            title: 'interface address',
            dataIndex: 'api',
            width: 'lg',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: 'This is required'
                }
              ]
            }
          },
          {
            title: 'Jump notification address return_url',
            dataIndex: 'return_url',
            width: 'sm'
          }
        ]
      }
    ]
  }

  function changeUpdateData(obj: MIXInfo) {
    const data = {
      name: obj.name,
      status: obj.status,
      channel: obj.channel,
      types: (obj.types as unknown as Array<string>).join(',')
    }
    if (obj.channel === 'alipay') {
      return {
        ...data,
        params: JSON.stringify({
          appId: obj?.appId,
          keyType: obj?.keyType,
          alipayPublicKey: obj?.alipayPublicKey,
          privateKey: obj?.privateKey
        })
      }
    } else if (obj.channel === 'yipay') {
      return {
        ...data,
        params: JSON.stringify({
          pid: obj?.pid,
          key: obj?.key,
          api: obj?.api,
          return_url: obj?.return_url
        })
      }
    } else {
      return false
    }
  }

  return (
    <div>
      <ProTable
        actionRef={tableActionRef}
        columns={columns}
        scroll={{
          x: 1400
        }}
        request={async (params, sorter, filter) => {
          // Form search items will be passed in from Params and passed to the rear port interface.
          const res = await getAdminPayment({
            page: params.current || 1,
            page_size: params.pageSize || 10
          })
          return Promise.resolve({
            data: res.data.rows,
            total: res.data.count,
            success: true
          })
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
                })
              }}
            >
              New payment channel
            </Button>
          ]
        }}
        rowKey="id"
        search={false}
        bordered
      />

      <ModalForm<MIXInfo>
        title="Payment channel"
        open={edidInfoModal.open}
        form={form}
        initialValues={{
          status: 1,
          channel: 'alipay'
        }}
        onOpenChange={(visible) => {
          if (!visible) {
            form.resetFields()
          }
          setEdidInfoModal((info) => {
            return {
              ...info,
              open: visible
            }
          })
        }}
        onFinish={async (values) => {
          const data = changeUpdateData(values)
          if (!data) return false

          if (edidInfoModal.info?.id) {
            const res = await putAdminPayment({
              ...data,
              id: edidInfoModal.info?.id
            } as PaymentInfo)
            if (res.code) {
              message.error('Edit failure')
              return false
            }
            tableActionRef.current?.reload?.()
          } else {
            const res = await addAdminPayment(data as PaymentInfo)
            if (res.code) {
              message.error('New failure')
              return false
            }
            tableActionRef.current?.reloadAndRest?.()
            message.success('Submitted successfully')
          }
          return true
        }}
        size="large"
        modalProps={{
          cancelText: 'Cancel',
          okText: 'submit'
        }}
      >
        <ProFormText
          name="name"
          label="Channel name"
          rules={[{ required: true, message: 'Please enter the channel name' }]}
        />
        <ProFormGroup>
          <ProFormCheckbox.Group
            name="types"
            label="Available channel"
            options={[
              {
                label: 'Alipay',
                value: 'alipay'
              },
              {
                label: 'WeChat',
                value: 'wxpay'
              },
              {
                label: 'QQ',
                value: 'qqpay'
              }
            ]}
            rules={[{ required: true, message: 'Please select available channels' }]}
            tooltip="用于微信支付和支付支付的选择"
          />
          <ProFormSegmented
            name="status"
            label="state"
            request={async () => [
              {
                label: 'online',
                value: 1
              },
              {
                label: 'Go down',
                value: 0
              }
            ]}
            rules={[{ required: true, message: 'Please select status' }]}
          />
          <ProFormSegmented
            name="channel"
            label="Pay official"
            request={async () => [
              {
                label: 'Alipay-Pay in person ',
                value: 'alipay'
              },
              {
                label: 'Easy payment',
                value: 'yipay'
              }
            ]}
            rules={[{ required: true, message: 'Please select status' }]}
          />
        </ProFormGroup>
        <ProFormDependency name={['channel']}>
          {({ channel }) => {
            return <BetaSchemaForm layoutType="Embed" columns={payKeyColumns[channel]} />
          }}
        </ProFormDependency>
      </ModalForm>
    </div>
  )
}

export default PaymentPage
