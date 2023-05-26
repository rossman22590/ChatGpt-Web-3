export interface RequestLoginParams {
  account: string
  code: string | number
}

export interface UserInfo {
  account: string
  nickname: string
  avatar: string
  role: string
  status: number
  ip: string
  created_at: string
  integral: number
  subscribe: string
  is_signin: number
}

export interface ResponseLoginData {
  user_info: UserInfo
  token?: string
}

export interface ChatGptConfig {
  // api
  // api: string
  // api-key
  // api_key?: string
  // Model
  model: string
  // Output random 0 - 2
  temperature?: number
  // Punishment -2 - 2
  presence_penalty?: number
  // Punishment frequency -2 - 2
  frequency_penalty?: number
  // Bring historical messages
  // limit_message?: number
  // Single reply restriction
  max_tokens?: number
}

export interface PromptInfo {
  key: string
  value: string
}

export interface RequestChatOptions {
  prompt: string
  options?: Omit<ChatGptConfig, 'api' | 'api_key'>
  parentMessageId?: string
}

// Request Openai or other agents
export interface RequestOpenChatOptions {
  model: string
  messages: Array<{
    role: 'assistant' | 'user' | string
    content: string
  }>
  // Output random 0 - 2
  temperature?: number
  // Punishment -2 - 2
  presence_penalty?: number
  // Punishment frequency -2 - 2
  frequency_penalty?: number
  // Single reply restriction
  max_tokens?: number
  stream?: boolean
}

export interface ChatsInfo {
  path: string
  id: string
  name: string
  data: Array<ChatGpt>
}

export interface ChatResultInfo {
  id: string
  role: string
  text: string
  dateTime: string
  segment: string
}

// Dialogue record
export interface ChatGpt {
  id: string | number
  text: string
  dateTime: string
  status: 'pass' | 'loading' | 'error'
  role: 'assistant' | 'user' | string
  requestOptions: RequestChatOptions
}

export interface RequestImagesGenerations {
  prompt: string
  n?: number
  size?: string
  response_format?: string
}

export interface ImagesInfo extends RequestImagesGenerations {
  id: string
  dateTime: string
  url: string
}

// Three -party subscription information
export interface SubscriptionInfo {
  hard_limit_usd: number
  has_payment_method: boolean
}

export interface RequesPrepay {
  pay_type: 'alipay' | 'wxpay' | 'qqpay' | string
  product_id: number
  quantity: number
}

export interface ProductInfo {
  id: number
  title: string
  price: number
  original_price: number
  badge: string
  day: number
  integral: number
  status: number
  create_time: string
  update_time: string
}

export interface TurnoverInfo {
  id: string
  user_id: string
  value: string
  describe: string
  create_time: string
  update_time: string
}


export interface PayTypeInfo {
	icon: string,
	key: string,
	title: string
}
