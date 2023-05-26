import {
  ActionType,
  ProColumns,
} from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Tag, message, Button, Modal, Radio, DatePicker, InputNumber, Space, Spin, Input } from 'antd'
import { useRef, useState } from 'react'
import { delAdminCarmi, getAdminCarmi, addAdminCarmis, getAdminCarmiCheck } from '@/request/adminApi'
import { CarmiInfo } from '@/types/admin'
import { formatTime } from '@/utils'
import styles from './index.module.less'

function CarmiPage() {
  const tableActionRef = useRef<ActionType>()

  const [generateModal, setGenerateModal] = useState({
    open: false,
    type: 'integral',
    end_time: '',
    quantity: 1,
    reward: 10,
    loading: false,
    result: ''
  })

  const columns: ProColumns<CarmiInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 180
    },
    {
      title: 'Dense',
      dataIndex: 'key'
    },
    {
      title: 'award',
      dataIndex: 'value',
      render: (_, data) => {
        return (
          <a>
            {data.value}
            {data.type === 'integral' ? '积分' : '天'}
          </a>
        )
      }
    },
    {
      title: 'state',
      dataIndex: 'status',
      render: (_, data) => {
        const color = data.status === 1 ? 'red' : data.status === 2 ? 'orange' : 'green'
        return (
          <Tag color={color}>
            {data.status === 1 ? 'Used' : data.status === 2 ? 'expired' : 'Unused'}
          </Tag>
        )
      }
    },
    {
      title: 'Validity period',
      dataIndex: 'end_time'
    },
    {
      title: 'user',
      dataIndex: 'user_id'
    },
    {
      title: 'IP',
      dataIndex: 'ip'
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
      width: 100,
      valueType: 'option',
      fixed: 'right',
      render: (_, data) => [
        <Button
          key="del"
          type="text"
          danger
          onClick={() => {
            delAdminCarmi({
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

  return (
    <div>
      <ProTable
        actionRef={tableActionRef}
        columns={columns}
        params={{}}
        pagination={{}}
        scroll={{
          x: 1800
        }}
        request={async (params, sorter, filter) => {
          const res = await getAdminCarmi({
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
              key="check"
              type="primary"
              size="small"
              onClick={() => {
                getAdminCarmiCheck().then(()=>{
                  message.success('The submission is successful, please check later')
                })
              }}
            >
              Asynchronous inspection Katmi
            </Button>,
            <Button
              key="produce"
              type="primary"
              size="small"
              onClick={() => {
                setGenerateModal((g) => ({ ...g, open: true }))
              }}
            >
              Batch generation
            </Button>
          ]
        }}
        rowKey="id"
        search={false}
        bordered
      />

      <Modal
        title="卡密生成"
        open={generateModal.open}
        footer={null}
        onCancel={() => {
          setGenerateModal({
            open: false,
            type: 'integral',
            end_time: '',
            quantity: 1,
            loading: false,
            reward: 10,
            result: ''
          })
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space size="large" wrap>
            <div className={styles.formCard}>
              <p className={styles.formCard_title}>Reward type</p>
              <Radio.Group
                size="large"
                onChange={(e) => {
                  setGenerateModal(g => ({ ...g, type: e.target.value }))
                }}
                defaultValue={generateModal.type}
                value={generateModal.type}
              >
                <Radio.Button value="integral">integral</Radio.Button>
                <Radio.Button value="day">Time (God)</Radio.Button>
              </Radio.Group>
            </div>
            <div className={styles.formCard}>
              <p className={styles.formCard_title}>Quantity</p>
              <InputNumber
                size="large"
                min={1}
                max={99999}
                onChange={(e) => {
                  if (e) {
                    setGenerateModal(g => ({ ...g, reward: e }))
                  }
                }}
                value={generateModal.reward}
              />
            </div>
            <div className={styles.formCard}>
              <p className={styles.formCard_title}>Validity deadline</p>
              <DatePicker
                size="large"
                format="YYYY-MM-DD"
                disabledDate={(current) => {
                  const date = new Date()
                  date.setHours(0, 0, 0, 0)
                  return current && current.toDate().getTime() < date.getTime();
                }}
                onChange={(e) => {
                  if (e) {
                    const dateString = formatTime('yyyy-MM-dd', e?.toDate())
                    setGenerateModal(g => ({ ...g, end_time: dateString }))
                  } else {
                    setGenerateModal(g => ({ ...g, end_time: '' }))
                  }
                }}
              />
            </div>
          </Space>
          <div className={styles.formCard}>
            <p className={styles.formCard_title}>Quantity</p>
            <InputNumber
              style={{
                width: '100%'
              }}
              size="large"
              min={1}
              max={50}
              onChange={(e) => {
                if (e) {
                  setGenerateModal(g => ({ ...g, quantity: e }))
                }
              }}
              value={generateModal.quantity}
            />
          </div>
          <div className={styles.generate}
            style={{
              height: generateModal.result || generateModal.loading ? 120 : 0
            }}
          >
            {
              (generateModal.result && !generateModal.loading) && (
                <Input.TextArea
                  value={generateModal.result}
                  disabled
                  placeholder="Controlled autosize"
                  autoSize={{
                    minRows: 5,
                    maxRows: 5,
                  }}
                />
              )
            }
            {generateModal.loading && <Spin />}
          </div>

          <Button
            loading={generateModal.loading}
            onClick={() => {
              setGenerateModal(g => ({ ...g, loading: true }))
              addAdminCarmis({
                type: generateModal.type,
                end_time: generateModal.end_time,
                quantity: generateModal.quantity,
                reward: generateModal.reward
              }).then((res) => {
                if (res.code) return;
                const keys = res.data.map(info => `${info.key}`).join('\n')
                setGenerateModal(g => ({ ...g, loading: false, result: keys }))
                tableActionRef.current?.reloadAndRest?.()
              }).finally(() => {
                setGenerateModal(g => ({ ...g, loading: false }))
              })
            }}
            type="primary"
            block
            size="large"
          >
            Generate immediately
          </Button>
        </Space>
      </Modal>

    </div>
  )
}

export default CarmiPage
