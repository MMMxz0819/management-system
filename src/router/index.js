import Vue from 'vue'
import VueRouter from 'vue-router'

//懒加载
const login = () => import('@/views/login/login.vue')
const home = () => import('@/views/home/home.vue')
const welcome = () => import('@/components/Home/welcome.vue')
const users = () => import('@/views/users/users.vue')
const rights = () => import('@/views/rights/rights.vue')
const roles = () => import('@/views/rights/roles.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: welcome,
    },
    {
      path: '/users',
      component: users,
    },
    {
      path: '/rights',
      component: rights,
    },
    {
      path: '/roles',
      component: roles,
    }]
  },


]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫 (to表示跳转路由，from表示当前路由，next为函数且表示放行)
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  //获取token，有token才可以进入权限页面
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()

})

export default router
