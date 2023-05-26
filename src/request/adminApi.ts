import {
  CarmiInfo,
  ConfigInfo,
  MessageInfo,
  OrderInfo,
  Paging,
  PaymentInfo,
  ProductInfo,
  RequestAddCarmi,
  SigninInfo,
  TableData,
  TokenInfo,
  TurnoverInfo,
  UserInfo
} from '@/types/admin'
import request from '.'

// Get the card secret list
export function getAdminCarmi(params: Paging) {
  return request.get<TableData<Array<CarmiInfo>>>('/api/admin/carmi', params)
}

// Check the card
export function getAdminCarmiCheck() {
  return request.get<TableData<Array<CarmiInfo>>>('/api/admin/carmi/check')
}

// Delete Card Mi
export function delAdminCarmi(params: { id: string | number }) {
  return request.del(`/api/admin/carmi/${params.id}`)
}

// Batch production card
export function addAdminCarmis(params: RequestAddCarmi) {
  return request.post<Array<CarmiInfo>>('/api/admin/carmi', params)
}

// user list
export function getAdminUsers(params: Paging) {
  return request.get<TableData<Array<UserInfo>>>('/api/admin/user', params)
}
// delete users
export function delAdminUsers(params: { id: string | number }) {
  return request.del(`/api/admin/user/${params.id}`)
}
// Modify the user
export function putAdminUsers(params: UserInfo) {
  return request.put('/api/admin/user', params)
}

// User consumption list
export function getAdminTurnovers(params: Paging) {
  return request.get<TableData<Array<TurnoverInfo>>>('/api/admin/turnover', params)
}
// Delete user consumption records
export function delAdminTurnover(params: { id: string | number }) {
  return request.del(`/api/admin/turnover/${params.id}`)
}
// Modify user consumption records
export function putAdminTurnover(params: TurnoverInfo) {
  return request.put('/api/admin/turnover', params)
}

// User sign -in list
export function getAdminSignin(params: Paging) {
  return request.get<TableData<Array<SigninInfo>>>('/api/admin/signin', params)
}

// User conversation list
export function getAdminMessages(params: Paging) {
  return request.get<TableData<Array<MessageInfo>>>('/api/admin/messages', params)
}

// Product list
export function getAdminProducts(params: Paging) {
  return request.get<TableData<Array<ProductInfo>>>('/api/admin/products', params)
}
// Delete goods
export function delAdminProduct(params: { id: string | number }) {
  return request.del(`/api/admin/products/${params.id}`)
}
// New product
export function postAdminProduct(params: ProductInfo) {
  return request.post('/api/admin/products', params)
}
// Modify the product
export function putAdminProduct(params: ProductInfo) {
  return request.put('/api/admin/products', params)
}

// Get token
export function getAdminTokens(params: Paging) {
  return request.get<TableData<Array<TokenInfo>>>('/api/admin/token', params)
}

// Delete token
export function delAdminToken(params: { id: string | number }) {
  return request.del(`/api/admin/token/${params.id}`)
}

// New token
export function postAdminToken(params: TokenInfo) {
  return request.post('/api/admin/token', params)
}

// Edit token
export function putAdminToken(params: TokenInfo) {
  return request.put('/api/admin/token', params)
}
// Check token
export function postAdminTokenCheck(params: TokenInfo | { all: boolean }) {
  return request.post('/api/admin/token/check', params)
}

// Get configuration data
export function getAdminConfig() {
  return request.get<Array<ConfigInfo>>('/api/admin/config')
}

// Modify the configuration data
export function putAdminConfig(params: { [key: string]: any }) {
  return request.put<Array<ConfigInfo>>('/api/admin/config', params)
}

// Get payment channel
export function getAdminPayment(params: Paging) {
  return request.get<TableData<Array<PaymentInfo>>>('/api/admin/payment', params)
}

// Delete channel
export function delAdminPayment(params: { id: string | number }) {
  return request.del(`/api/admin/payment/${params.id}`)
}

// New channel
export function addAdminPayment(params: PaymentInfo) {
  return request.post('/api/admin/payment', params)
}
// Editing channel
export function putAdminPayment(params: PaymentInfo) {
  return request.put('/api/admin/payment', params)
}

// Get orders list
export function getAdminOrders(params: Paging) {
  return request.get<TableData<Array<OrderInfo>>>('/api/admin/orders', params)
}
