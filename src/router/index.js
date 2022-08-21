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
    path: '/manage',
    component: () => import('../views/manage.vue'),
    name: 'manage',
    children: [{
      path: '/eventRecordList',
      component: () => import('../views/eventRecord/EventRecordList.vue'),
      meta: ['数据管理', '事件列表']
    },{
      path: '/eventRecordDetail/:id',
      component: () => import('../views/eventRecord/EventRecordDetail.vue'),
      meta: ['数据管理', '事件详情'],
    },
      {
        path: '/columnList',
        component: () => import('../views/column/ColumnList.vue'),
        meta: ['数据管理', '字段列表']
      }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
