import { createApp } from 'vue'
import App from '@/App.vue'
// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置element-plus国际化
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 暗黑模式变量
import 'element-plus/theme-chalk/dark/css-vars.css'
// 获取应用实例对象
const app = createApp(App)
// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn,
})
// svg插件需要配置代码
import 'virtual:svg-icons-register'
// 引入自定义插件对象:注册整个项目全局组件
import globalComponent from '@/components'
console.log(globalComponent)
// 安装自定义插件
app.use(globalComponent)
// 引入模板的全局的样式
import '@/styles/index.scss'

// 引入路由
import router from './router'
// 注册路由
app.use(router)

// 引入pinia仓库
import pinia from './store'

app.use(pinia)

// 引入路由鉴权
import './permission'

// 引入自定义指令文件
import { isHasButton } from '@/directive/has'
isHasButton(app)

// 将应用挂载到挂载点上
app.mount('#app')
