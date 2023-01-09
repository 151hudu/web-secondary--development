import { pluginLog } from '.'
import { isLogin, login } from '../api/login'

export const detectLogin = async () => {
  const loginStatus = await isLogin()
  pluginLog('LOGIN_STATUS:', loginStatus)
  if(!loginStatus) {
    pluginLog('logining...')
    await login({
      account: process.env.REACT_APP_ACCOUNT ?? '',
      password: process.env.REACT_APP_PASSWORD ?? ''
    })
    pluginLog('LOGIN_STATUS:', loginStatus)
  }
}
