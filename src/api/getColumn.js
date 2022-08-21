import fetch from '@/config/fetch'

/**
 * 获取字段列表
 */
export const getList = data => fetch('/mysqlColumn/getList', data, 'POST');



