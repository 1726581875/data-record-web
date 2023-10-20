import fetch from '@/config/fetch'


/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch('/admin/info');