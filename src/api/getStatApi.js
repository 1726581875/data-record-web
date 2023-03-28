import fetch from '@/config/fetch'

/**
 * 获取binlog增删查改类型数量统计
 */
export const getCRUDStat = data => fetch('/eventRecord/getCRUDStat', data, 'POST');



