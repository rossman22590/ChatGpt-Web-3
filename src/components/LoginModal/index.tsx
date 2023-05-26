import { getCode } from '@/request/api'
import { userAsync } from '@/store/async'
import { RequestLoginParams } from '@/types'
import {
  HeartFilled,
  LockOutlined,
  MailOutlined,
  RedditCircleFilled,
  SlackCircleFilled,
  TwitterCircleFilled
} from '@ant-design/icons'
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-form'
import { Form, FormInstance, Modal, Space } from 'antd'

type Props = {
  open: boolean
  onCancel: () => void
}

export function LoginCard(props: {
  form: FormInstance<RequestLoginParams>
  onSuccess: () => void
}) {
  return (
    <LoginForm<RequestLoginParams>
      form={props.form}
      logo={import.meta.env.VITE_APP_LOGO}
      title=""
      subTitle="The cheapest artificial intelligence dialogue on the entire network"
      actions={(
        <Space>
          <HeartFilled />
          <RedditCircleFilled />
          <SlackCircleFilled />
          <TwitterCircleFilled />
        </Space>
      )}
      contentStyle={{
        width: 'auto',
        minWidth: '100px'
      }}
      onFinish={async (e) => {
        return new Promise((resolve, reject) => {
          userAsync
            .fetchLogin({ ...e })
            .then((res) => {
              if (res.code) {
                reject(false)
                return
              }
              props.onSuccess?.()
              resolve(true)
            })
            .catch(() => {
              reject(false)
            })
        })
      }}
    >
      <ProFormText
        fieldProps={{
          size: 'large',
          prefix: <MailOutlined />
        }}
        name="account"
        placeholder="Mail"
        rules={[
          {
            required: true,
            message: 'Please enter the email address',
            pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
          }
        ]}
      />
      <ProFormCaptcha
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined />
        }}
        captchaProps={{
          size: 'large'
        }}
        placeholder="Verification code"
        captchaTextRender={(timing, count) => {
          if (timing) {
            return `${count} ${'get verification code'}`
          }
          return 'get verification code'
        }}
        name="code"
        rules={[
          {
            required: true,
            message: 'please enter verification code!'
          }
        ]}
        onGetCaptcha={async () => {
          const account = props.form.getFieldValue('account')
          if (!account || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(account)) {
            props.form.setFields([
              {
                name: 'account',
                errors: ['please enter a valid email address']
              }
            ])
            return Promise.reject()
          }
          return new Promise((resolve, reject) =>
            getCode({ source: account })
              .then(() => resolve())
              .catch(reject)
          )
        }}
      />
      <div
        style={{
          marginBlockEnd: 24
        }}
      />
    </LoginForm>
  )
}

// Log in to register
function LoginModal(props: Props) {
  const [loginForm] = Form.useForm()

  const onCancel = () => {
    props.onCancel()
    loginForm.resetFields()
  }

  return (
    <Modal open={props.open} footer={null} destroyOnClose onCancel={onCancel}>
      <LoginCard form={loginForm} onSuccess={onCancel} />
    </Modal>
  )
}

export default LoginModal
