import { useLayoutEffect } from 'react'
import { ModalForm, ProFormSelect, ProFormSlider, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import FormItemCard from '../FormItemCard'
import { ChatGptConfig } from '@/types'

type Props = {
  open: boolean
  onCancel: () => void
  onChange: (config: ChatGptConfig) => void
  models: Array<{
    label: string
    value: string
  }>
  data: ChatGptConfig
}

function ConfigModal(props: Props) {
  const [chatGptConfigform] = Form.useForm<ChatGptConfig>()
  const onCancel = () => {
    props.onCancel()
    chatGptConfigform.resetFields()
  }

  useLayoutEffect(() => {
    if (props.open && chatGptConfigform) {
      chatGptConfigform.setFieldsValue({
        ...props.data
      })
    }
  }, [props.open, chatGptConfigform])

  return (
    <ModalForm<ChatGptConfig>
      title="Chat 配置"
      open={props.open}
      form={chatGptConfigform}
      onOpenChange={(visible) => {
        if (visible) return
        onCancel()
      }}
      onFinish={async (values) => {
        props.onChange(values)
        return true
      }}
      size="middle"
      width={600}
      modalProps={{
        cancelText: '取消',
        okText: '提交',
        maskClosable: false,
        destroyOnClose: true
      }}
    >
      <FormItemCard title="GPTModel" describe="According to the model configuration given in Openai">
        <ProFormSelect
          name="model"
          style={{ minWidth: '180px' }}
          options={[...props.models]}
          fieldProps={{
            clearIcon: false
          }}
        />
      </FormItemCard>
      {/* {(
        <>
          <FormItemCard title="actingAPI" describe="The proxy address can be any trio agent（ChatGpt）">
            <ProFormText
              allowClear={false}
              name="api"
              placeholder="Please enter the proxy address"
              rules={[{ required: true, message: 'Please fill in the agent API address' }]}
            />
          </FormItemCard>
          <FormItemCard title="API Key" describe="Using your ownOpenApiKey Or other agents.">
            <ProFormText allowClear={false} name="api_key" placeholder="Please enter the key key" />
          </FormItemCard>
        </>
      )} */}
      {/* <FormItemCard title="The number of historical messages "description =" the number of historical messages that requests carried each time">
        <ProFormSlider name="limit_message" max={10} min={0} step={1} />
      </FormItemCard> */}
      <FormItemCard title="Random" describe="The larger the value, the more random reply, the value greater than 1 may cause garbled code">
        <ProFormSlider name="temperature" max={2} min={-2} step={0.1} />
      </FormItemCard>
      <FormItemCard title="Topic" describe="The larger the value, the more likely it is to expand to a new topic">
        <ProFormSlider name="presence_penalty" max={2} min={-2} step={0.1} />
      </FormItemCard>
      <FormItemCard title="Repetitiveness" describe="The frequency of repeated words and phrases in the text, the larger the more, the less flowing">
        <ProFormSlider name="frequency_penalty" max={2} min={-2} step={0.1} />
      </FormItemCard>
      <FormItemCard title="Single reply restriction" describe="The maximum token number used for single interaction">
        <ProFormSlider name="max_tokens" max={3666} min={100} step={1} />
      </FormItemCard>
    </ModalForm>
  )
}

export default ConfigModal
