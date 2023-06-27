// 创建用户相关的小仓库
import { defineStore } from 'pinia'

// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'

import type { UserState } from './types/type'

// 引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'

// 引入路由(常量路由)
import { constRoute, asyncRoute, anyRoute } from '@/router/routes'
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'

// 用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 创建用户小仓库
const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户的唯一标识
      menuRoutes: constRoute, // 仓库存储生成菜单需要数组(路由)
      username: '',
      avatar: '',
      buttons: [], // 存储当前用户是否包含某一个按钮
    }
  },
  // 异步|逻辑的地方
  actions: {
    // 用户登录的方法
    async userLogin(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data)
      console.log(result)
      if (result.code == 200) {
        // pinia仓库存储token
        this.token = result.data as string
        // 本地持久化存储
        SET_TOKEN(result.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息方法
    async userInfo() {
      // 获取用户信息进行存储仓库当中[用户头像,名字]
      const result: userInfoResponseData = await reqUserInfo()
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons

        // 计算当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )
        // 菜单需要的数据
        ;(this.menuRoutes = [...constRoute, ...userAsyncRoute, anyRoute]),
          // 目前路由器对象管理的只有常量路由:用户计算完毕异步路由,任意录音动态追加
          [...userAsyncRoute, anyRoute].forEach((route: any) => {
            router.addRoute(route)
          })
        // 打印当前用户的全部路由
        console.log(router.getRoutes())

        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      const result: any = await reqLogout()
      console.log(result)
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // atguigu123
  },
  // 计算属性,简化数据
  getters: {},
})

// 对外暴露获取小仓库的方法
export default useUserStore
