import request from '../api/request'
import { EncryptPassword } from '../util/encrypt'

type Account = {
  account: string
  password: string
}

type LoginParam = {
  account: string
  username: string
  password: string
}

export const login = (account: Account) => {
  const params: LoginParam = {
    account: account.account,
    username: account.account,
    password: EncryptPassword(account.password)
  }
  return request.post('/system/authority/loginAccount4Application', params)
}

export const isLogin = async (): Promise<boolean> => {
  const { data } = await request.get('/system/authority/isLogin')
  return data
}