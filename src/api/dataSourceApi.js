import fetch from '@/config/fetch'

/**
 * 获取租户数据源
 */
export const getDataSourceList = data => fetch('/dataSource/getList', data, 'POST');

/**
 * 获取租户数据源对应的表信息
 */
export const getTenantTableList = data => fetch('/dataSource/getTenantTables', data, 'POST');

/**
 * 获取数据库信息列表
 */
export const getSchemaList = data => fetch('/mysqlSchema/getList', data, 'POST');



