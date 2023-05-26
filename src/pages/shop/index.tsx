import { useEffect, useMemo, useState } from 'react'
import UserInfoCard from '@/components/UserInfoCard'
import styles from './index.module.less'
import Layout from '@/components/Layout'
import { shopStore, userStore } from '@/store'
import { Button, Input, Modal, Pagination, QRCode, Radio, Space, Table, message } from 'antd'
import GoodsList from '@/components/GoodsList'
import { CloseCircleFilled, SyncOutlined } from '@ant-design/icons'
import { shopAsync, userAsync } from '@/store/async'
import { getUserTurnover, postPayPrecreate, postUseCarmi, postSignin } from '@/request/api'
import { ProductInfo, TurnoverInfo } from '@/types'
import OpenAiLogo from '@/components/OpenAiLogo'
import { Link } from 'react-router-dom'

function GoodsPay() {
  const { goodsList, payTypes } = shopStore()
  const { token, user_info } = userStore()

  const [goods, setGoods] = useState<ProductInfo>()
  const [payType, setPayType] = useState('')

  const payInfo: {
    [key: string]: {
      icon: string
      message: string
      color: string
    }
  } = {
    wxpay: {
      icon: 'https://files.catbox.moe/b1joiq.png',
      message: 'Please use WeChat scan code to pay',
      color: '#24aa39'
    },
    alipay: {
      icon: 'https://files.catbox.moe/a8x6il.png',
      message: 'Please use Alipay to scan the code to pay',
      color: '#1678ff'
    },
    qqpay: {
      icon: 'https://files.catbox.moe/rimuzz.png',
      message: 'Please use QQ scan code to pay',
      color: '#10b8f6'
    }
  }

  const [turnover, setTurnover] = useState<{
    page: number
    pageSize: number
    loading: boolean
    rows: Array<TurnoverInfo>
    count: number
  }>({
    page: 1,
    pageSize: 10,
    loading: false,
    rows: [],
    count: 1
  })

  const [payModal, setPayModal] = useState<{
    open: boolean
    status: 'loading' | 'fail' | 'pay'
    order_id?: string
    pay_url?: string
    pay_key?: string
  }>({
    open: false,
    status: 'pay',
    order_id: '',
    pay_url: 'sdsgsdgsdg'
  })

  useEffect(() => {
    shopAsync.fetchProduct()
    onTurnoverLog(1)
  }, [])

  function onTurnoverLog(page: number) {
    setTurnover((l) => ({ ...l, page, loading: true }))
    getUserTurnover({
      page: page,
      pageSize: turnover.pageSize
    })
      .then((res) => {
        if (res.code) return
        setTurnover((l) => ({ ...l, page, ...res.data, loading: false }))
      })
      .finally(() => {
        setTurnover((l) => ({ ...l, page, loading: false }))
      })
  }

  async function onPay(item: ProductInfo, pay_type: string) {
    setPayModal((p) => ({ ...p, open: true }))
    const payres = await postPayPrecreate({
      pay_type,
      product_id: item.id,
      quantity: 1
    })
    if (payres.code) {
      setPayModal((p) => ({ ...p, status: 'fail' }))
      return
    }
    setPayModal((p) => ({ ...p, status: 'pay', ...payres.data }))
  }

  function onPayResult() {
    // Refresh record
    onTurnoverLog(1)
    // Refresh user information
    // fetchUserInfo()
    setPayModal((p) => ({ ...p, status: 'loading', open: false }))
  }

  const [carmiLoading, setCarmiLoading] = useState(false)

  function useCarmi(carmi: string) {
    if (!carmi) {
      message.warning('Please enter Card Mi')
      return
    }
    setCarmiLoading(true)
    postUseCarmi({ carmi })
      .then((res) => {
        if (res.code) return
        userAsync.fetchUserInfo()
        message.success(res.message)
        onTurnoverLog(1)
      })
      .finally(() => {
        setCarmiLoading(false)
      })
  }

  const [signinLoading, setSigninLoading] = useState(false)

  if (!token) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <OpenAiLogo rotate width="3em" height="3em" />
      </div>
    )
  }

  return (
    <div className={styles.goodsPay}>
      <Layout>
        <div className={styles.goodsPay_container}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* User Info */}
            <UserInfoCard info={user_info} />
            {/* Sign -in area */}
            <div className={styles.goodsPay_card}>
              <h4>Sign -in calendar</h4>
              <Button
                loading={signinLoading}
                type="primary"
                block
                disabled={!!user_info?.is_signin}
                onClick={() => {
                  setSigninLoading(true)
                  postSignin()
                    .then((res) => {
                      if (res.code) return
                      userAsync.fetchUserInfo()
                      message.success(res.message)
                      onTurnoverLog(1)
                    })
                    .finally(() => {
                      setSigninLoading(false)
                    })
                }}
              >
                {user_info?.is_signin ? 'Sign in today' : 'Sign in now'}
              </Button>
            </div>
            {/* Kami recharge area */}
            <div className={styles.goodsPay_card}>
              <h4>Densely recharge</h4>
              <Input.Search
                loading={carmiLoading}
                placeholder="Please enter the recharge card secret"
                allowClear
                enterButton="Recharge"
                size="large"
                bordered
                onSearch={useCarmi}
              />
            </div>
            {goodsList.length > 0 && (
              <div className={styles.goodsPay_card}>
                <h4>Online recharge</h4>
                <GoodsList
                  list={goodsList}
                  onChange={(item) => {
                    setGoods(item)
                  }}
                />
                <div className={styles.goodsPay_pay}>
                  <Radio.Group
                    onChange={(e) => {
                      setPayType(e.target.value)
                    }}
                  >
                    <Space size="middle" wrap>
                      {payTypes.map((type) => {
                        return (
                          <div
                            key={type.key}
                            className={styles.goodsPay_pay_type}
                            style={{
                              borderColor: type.key === payType ? '#1677ff' : '#999'
                            }}
                          >
                            <Radio value={type.key}>
                              <img src={type.icon} alt={type.title} />
                            </Radio>
                          </div>
                        )
                      })}
                    </Space>
                  </Radio.Group>
                  <Button
                    size="large"
                    style={{
                      marginLeft: 'auto'
                    }}
                    type="primary"
                    disabled={!(goods?.id && payType)}
                    onClick={() => {
                      if (goods && goods.id && payType) {
                        onPay(goods, payType)
                      } else {
                        message.warning('Please select the product and payment method')
                      }
                    }}
                  >
                    Immediately recharge
                  </Button>
                </div>
              </div>
            )}
            <div className={styles.goodsPay_card}>
              <h4
                onClick={() => {
                  onTurnoverLog(1)
                }}
              >
                Order record <SyncOutlined spin={turnover.loading} />
              </h4>
              <Table<TurnoverInfo>
                scroll={{
                  x: 800
                }}
                bordered
                loading={turnover.loading}
                dataSource={turnover.rows}
                pagination={{
                  hideOnSinglePage: true,
                  defaultPageSize: turnover.pageSize
                }}
                rowKey="id"
                columns={[
                  {
                    title: 'describe',
                    dataIndex: 'describe',
                    key: 'describe'
                  },
                  {
                    title: 'Quota',
                    key: 'value',
                    render: (data) => {
                      return <a key={data.value}>{data.value}</a>
                    }
                  },
                  {
                    title: 'date',
                    dataIndex: 'create_time',
                    key: 'create_time'
                  }
                ]}
              />
              <div className={styles.goodsPay_pagination}>
                <Pagination
                  size="small"
                  current={turnover.page}
                  defaultCurrent={turnover.page}
                  defaultPageSize={turnover.pageSize}
                  total={turnover.count}
                  onChange={(e) => {
                    onTurnoverLog(e)
                  }}
                />
              </div>
            </div>
          </Space>

          <Modal
            open={payModal.open}
            onCancel={() => {
              // closure
              setPayModal({
                open: false,
                status: 'loading'
              })
            }}
            footer={null}
            width={320}
          >
            <div className={styles.payModal}>
              {payModal.status === 'fail' && <CloseCircleFilled className={styles.payModal_icon} />}
              {payModal.status === 'loading' && <OpenAiLogo rotate width="3em" height="3em" />}
              {payModal.status === 'pay' && payType && (
                <img
                  className={styles.payModal_paylogo}
                  src={payInfo[payType].icon}
                  alt=""
                  srcSet=""
                />
              )}

              {payModal.status === 'pay' && payModal.pay_url && payType && (
                <Link to={payModal.pay_url} target="_blank">
                  <QRCode
                    value={payModal.pay_url}
                    color={payInfo[payType].color}
                    style={{
                      marginTop: 16
                    }}
                  />
                </Link>
              )}

              <div className={styles.payModal_message}>
                {payModal.status === 'fail' ? (
                  <p>Failure to create an order, please try again</p>
                ) : payModal.status === 'pay' && payInfo && goods ? (
                  <p>
                    <span>{(goods?.price / 100).toFixed(2)}元</span>
                    <br />
                    {payInfo[payType].message}
                  </p>
                ) : (
                  <p>In the creation of orders ...</p>
                )}
              </div>

              <div className={styles.payModal_button}>
                {payModal.status === 'pay' && (
                  <Space>
                    <Button
                      danger
                      onClick={() => {
                        onPayResult()
                      }}
                    >
                      Cancel payment
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        onPayResult()
                      }}
                    >
                      Payment is complete
                    </Button>
                  </Space>
                )}
              </div>
            </div>
          </Modal>
        </div>
      </Layout>
    </div>
  )
}

export default GoodsPay
