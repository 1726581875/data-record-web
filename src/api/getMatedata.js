import fetch from '@/config/fetch'

/**
 * 获取字段列表
 */
export const getColumnList = data => fetch('/mysqlColumn/getList', data, 'POST');

/**
 * 获取表信息列表
 */
export const getTableList = data => fetch('/mysqlTable/getList', data, 'POST');

/**
 * 获取数据库信息列表
 */
export const getSchemaList = data => fetch('/mysqlSchema/getList', data, 'POST');



