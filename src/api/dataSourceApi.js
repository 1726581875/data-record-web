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
 * 新增数据源
 */
export const saveDataSource = data => fetch('/dataSource/save', data, 'POST');

/**
 * 新增数据源
 */
export const deleteDataSourceById = data => fetch('/dataSource/deleteById', data, 'DELETE');

/**
 * 数据迁移、同步
 * @param data
 * @returns {Promise<unknown>}
 */
export const dataMigration = data => fetch('/dataSource/dataMigration', data, 'POST');

export const getDataList = data => fetch('/data/getList', data, 'GET');

export const getDataSyncRecordList = data => fetch('/syncRecord/getList', data, 'POST');


export const ping = data => fetch('/command/ping', data, 'POST');

export const listenBinlog = data => fetch('/dataSource/listenBinlog', data, 'POST');

export const cancelListen = data => fetch('/dataSource/cancelListen', data, 'POST');



