import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'manage',
    component: () => import('../views/manage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/manage',
    component: () => import('../views/manage.vue'),
    name: 'manage',
    children: [{
      path: '/eventRecordList',
      component: () => import('../views/eventRecord/EventRecordList.vue'),
      meta: ['数据管理', '事件列表']
    }, {
      path: '/eventRecordDetail/:dataSourceId/:id',
      component: () => import('../views/eventRecord/EventRecordDetail.vue'),
      meta: ['数据管理', '事件详情'],
    }, {
      path: '/schemaList',
      component: () => import('../views/schema/SchemaList.vue'),
      meta: ['数据管理', '数据库列表']
    }, {
      path: '/tableList',
      component: () => import('../views/table/TableList.vue'),
      meta: ['数据管理', '表列表']
    }, {
      path: '/columnList',
      component: () => import('../views/column/ColumnList.vue'),
      meta: ['数据管理', '字段列表']
    }, {
      path: '/dataSourceList',
      component: () => import('../views/dataSource/DataSourceList.vue'),
      meta: ['数据管理', '数据源管理']
    }, {
      path: '/tenantTableList/:id',
      component: () => import('../views/dataSource/TenantTableList.vue'),
      meta: ['数据管理', '租户table管理']
    }, {
      path: '/dataList/:tableName',
      component: () => import('../views/dataSource/data/DataList.vue'),
      meta: ['数据管理', '数据列表']
    }, {
      path: '/syncRecordList',
      component: () => import('../views/dataSource/DataSyncRecordList.vue'),
      meta: ['数据管理', '数据同步记录列表']
    }, {
      path: '/yanySqlBakTable',
      component: () => import('../views/yanySqlBakTable/BakTableList.vue'),
      meta: ['数据管理', 'yanySQL备份']
    }, {
      path: '/bakTableData/:tableName',
      component: () => import('../views/yanySqlBakTable/BakTableDataDetail.vue'),
      meta: ['数据管理', 'yanySQL备份表的数据详情']
    }, {
      path: '/charts',
      component: () => import('../views/charts/Charts.vue'),
      meta: ['图表统计', '图表统计']
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
