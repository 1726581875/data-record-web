import fetch from '@/config/fetch'

/**
 * 登录接口
 */
export const login = data => fetch('/sysUser/login', data, 'POST');

/**
 * 注册接口
 */
export const register = data => fetch('/sysUser/register', data, 'POST');

/**
 * 登出接口
 */
export const loginOut = data => fetch('/sysUser/loginOut', data, 'POST');

export const getVerifyCode = data => fetch('/sysUser/getVerifyCode', data, 'GET');



