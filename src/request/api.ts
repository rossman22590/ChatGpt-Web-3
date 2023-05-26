import {
  ProductInfo,
  RequesPrepay,
  RequestChatOptions,
  RequestImagesGenerations,
  RequestLoginParams,
  ResponseLoginData,
  SubscriptionInfo,
  TurnoverInfo,
  UserInfo
} from '@/types'
import request from '.'
import { formatTime } from '@/utils'
import { TableData } from '@/types/admin'

// get verification code
export function getCode(params: { source: string }) {
  return request.get('/api/send_sms', params)
}

// Log in
export function postLogin(params: RequestLoginParams) {
  return request.post<ResponseLoginData>('/api/login', params)
}

// Get user information
export function getUserInfo() {
  return request.get<UserInfo>('/api/user/info')
}

// Request dialogue
export function postChatCompletions(
  params: RequestChatOptions,
  config?: {
    headers?: { [key: string]: any }
    options?: { [key: string]: any }
  }
) {
  return request.postStreams<Response>('/api/chat/completions', params, config)
}

// Request painting
export function postImagesGenerations(
  params: RequestImagesGenerations,
  headers?: { [key: string]: any },
  options?: { [key: string]: any }
) {
  return request.post<Array<{ url: string }>>(
    '/api/images/generations',
    { ...params },
    headers,
    options
  )
}

// List of products
export function getProduct() {
  return request.get< {
	products: Array<ProductInfo>,
	pay_types: Array<string>
  }>('/api/product')
}

// Get user consumption record
export function getUserTurnover(params: { page: number; pageSize: number }) {
  return request.get<{ count: number; rows: Array<TurnoverInfo> }>('/api/turnover', params)
}

// Submit Order
export function postPayPrecreate(params: RequesPrepay) {
  return request.post<{
    order_id: string
    pay_url: string
    pay_key: string
    qrcode?: string
  }>('/api/pay/precreate', params)
}

// Densely recharge
export function postUseCarmi(params: { carmi: string }) {
  return request.post('/api/use_carmi', params)
}

// Sign in
export function postSignin() {
  return request.post('/api/signin')
}
