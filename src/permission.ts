// 路由鉴权 鉴权:项目当中路由能不能被访问的权限设置 (某一个路由什么条件下可以发访问 什么情况下不能访问)
import router from '@/router'
import setting from './setting'
// 引入进度条progress
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 获取用户相关的小仓库内部token数据,去判断用户是否登陆成功
import useUserStore from './store/modules/user'
import pinia from './store'
const userStore = useUserStore(pinia)

// 全局守卫:项目当中任意路由切换都会触发的钩子
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title}-${to.meta.title}`
  nprogress.start()
  // 获取token,判断用户登录还是未登录
  const token = userStore.token
  // 获取用户名字
  const username = userStore.username
  // 用户登录判断
  if (token) {
    //  登录成功,访问login,不能访问指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 登录成功访问其余六个路由(login除外)
      if (username) {
        next()
      } else {
        // 如果没有用户信息 在守卫中发请求获取到用户信息再放行
        try {
          await userStore.userInfo()

          next({ ...to })
        } catch (error) {
          // token过期 用户手动修改本地存储
          // 退出登录->用户相关的数据被清空
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 用户未登录判断
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置首位
router.afterEach((to: any, from: any) => {
  nprogress.done()
})
