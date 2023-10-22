import fetch from '@/config/fetch'


export const getAllBakTables = data => fetch('/bakTable/getAllBakTables', data, 'GET');

export const getBakTableDataList = data => fetch('/bakTable/getDataList', data, 'GET');



