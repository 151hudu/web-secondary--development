
export const PUBLIC_KEY = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANNmSJW87EE2Z3KDW5Kod8cL + 7lUBgfKLm86CGfMQxvc8w + JnOE7GV72DVyg2kCMGho5g9AR64BmrGobbG4xMZECAwEAAQ =='

export const pluginLog: typeof console.log = (...data: unknown[]) => {
  console.log('[plugin-boot]', ...data)
}