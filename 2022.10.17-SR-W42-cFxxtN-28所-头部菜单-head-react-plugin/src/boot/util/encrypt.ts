import { PUBLIC_KEY } from '.'
import JSEncrypt from 'jsencrypt'

export const EncryptPassword = (text: string) => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(
    '-----BEGIN PUBLIC KEY-----' +
    PUBLIC_KEY +
    '-----END PUBLIC KEY-----'
  )
  const encrypted = encrypt.encrypt(text)
  return encrypted.toString()
}


