import fetch from '@/config/fetch'

/**
 * 获取事件记录列表
 */
export const getList = data => fetch('/eventRecord/getList', data, 'POST');

/**
 * 获取事件记录详情
 * @param data
 */
export const getById = data => fetch('/eventRecord/getById', data, 'GET');

export const getInsertRows = data => fetch('/eventRecord/getInsertRows', data, 'POST');

export const getDeleteRows = data => fetch('/eventRecord/getDeleteRows', data, 'POST');

export const getUpdateRows = data => fetch('/eventRecord/getUpdateRows', data, 'POST');


