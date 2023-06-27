<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名:">
          <el-input
            placeholder="请您输入搜索的用户名"
            v-model="keyword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="default"
            :disabled="keyword ? false : true"
            @click="search"
          >
            搜索
          </el-button>
          <el-button type="danger" size="default" @click="reset">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-button type="primary" size="default" @click="addUser" icon="Plus">
        添加用户
      </el-button>
      <el-button
        type="danger"
        size="default"
        icon="Delete"
        :disabled="selectIdArr.length ? false : true"
        @click="deleteSelectUser"
      >
        批量删除
      </el-button>
      <!-- table展示用户信息 -->
      <el-table
        style="margin: 10px 0"
        border
        :data="userArr"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="#"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column
          label="用户名字"
          align="center"
          prop="username"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户名称"
          align="center"
          prop="name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="用户角色"
          align="center"
          prop="roleName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="User"
              @click="setRole(row)"
            >
              分配角色
            </el-button>
            <el-button
              type="success"
              size="small"
              icon="Edit"
              @click="updateUser(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`您确定要删除${row.username}吗?`"
              width="260px"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :background="true"
        :page-sizes="[5, 7, 9, 11]"
        layout="prev, pager, next, ->,sizes,total"
        :total="total"
        @current-change="getHasUser"
        @size-change="handleSizeChange"
      />
    </el-card>
    <!-- 抽屉结构:完成添加新的用户账户|更新已有的账号信息 -->
    <el-drawer v-model="drawer">
      <!-- 头部标题 -->
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <!-- 身体部分 -->
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input
              placeholder="请您输入用户姓名"
              v-model="userParams.username"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              placeholder="请您输入用户昵称"
              v-model="userParams.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input
              placeholder="请您输入用户密码"
              v-model="userParams.password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>

      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉结构:用于某一个已有的账号进行职位分配 -->
    <el-drawer v-model="drawer1">
      <!-- 头部标题 -->
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <!-- 身体部分 -->
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <!-- 显示职位的复选框 -->
            <el-checkbox-group
              v-model="userRole"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(item, index) in allRole"
                :key="index"
                :label="item"
              >
                {{ item.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>

      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user'
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import useLayoutSettingStore from '@/store/modules/setting'
// 获取模板setting仓库(重置按钮用)
let settingStore = useLayoutSettingStore()
// 默认页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(5)
// 用户总个数
let total = ref<number>(0)
// 存储全部用户的数组
let userArr = ref<Records>([])
// 抽屉效果显示或隐藏
let drawer = ref<boolean>(false)
// 控制分配角色抽屉显示与隐藏
let drawer1 = ref<boolean>(false)
// 存储全部职位的数据
let allRole = ref<AllRole>([])
// 当前用户已有的职位
let userRole = ref<AllRole>([])
// 收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
// 存储批量删除的用户的id
let selectIdArr = ref<User[]>([])
// 获取form表单组件实例
let formRef = ref<any>()
// 收集用户输入进来的关键字
let keyword = ref<string>('')
// 组件挂载完毕
onMounted(() => {
  getHasUser()
})

// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
  // 收集当前页码
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

// 分页器下拉菜单的自定义事件回调
const handleSizeChange = () => {
  getHasUser()
}

// 添加用户按钮的回调
const addUser = () => {
  // 显示抽屉
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

// 更新已有的用户按钮的回调
// row即为已有的用户账号信息
const updateUser = (row: User) => {
  drawer.value = true
  // 存储收集已有的账号信息
  Object.assign(userParams, row)
  // 清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

// 保存按钮的回调
const save = async () => {
  // 点击保存按钮时:表单全部通过校验方可发送请求
  await formRef.value.validate()
  // 保存按钮:添加新的用户|更新已有的用户账号信息
  let result: any = await reqAddOrUpdateUser(userParams)
  // 添加或更新成功
  if (result.code == 200) {
    // 关闭抽屉
    drawer.value = false
    // 提示信息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    // 获取最新的全部账号的信息
    // getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新一次
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}

// 点击取消按钮的回调
const cancel = () => {
  drawer.value = false
}

// 校验用户名字的回调函数
const validatorUsername = (rele: any, value: any, callBack: any) => {
  // 用户名字|昵称 长度至少为5位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名需大于或等于5位!'))
  }
}
// 昵称校验
const validatorname = (rele: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('昵称需大于或等于5位!'))
  }
}
// 昵称校验
const validatorpassword = (rele: any, value: any, callBack: any) => {
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('密码需大于或等于6位!'))
  }
}
// 表单校验的规则对象
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  // 用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  // 密码
  password: [{ required: true, trigger: 'blur', validator: validatorpassword }],
}

// 分配角色按钮的回调
const setRole = async (row: User) => {
  // 存储已有的用户信息
  Object.assign(userParams, row)
  // // 获取全部职位,当前帐号拥有的职位数据
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    // 存储全部的职位
    allRole.value = result.data.allRolesList
    // 存储当前用户已有的职位
    userRole.value = result.data.assignRoles
    drawer1.value = true
  }
}

// 收集顶部复选框全选数据
const checkAll = ref(false)
// 控制顶部全选复选框不确定的样式
const isIndeterminate = ref(true)
// 顶部的全部复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  // val:true(全选)false(未全选)
  userRole.value = val ? userRole.value : []
  isIndeterminate.value = false
}
// 顶部全部的复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
  // 代表:勾选上的项目个数与全部的职位个数相等,顶部的复选框勾选上
  checkAll.value = value.length === allRole.value.length
  isIndeterminate.value = value.length !== allRole.value.length
}

// 确定按钮的回调(分配职位)
const confirmClick = async () => {
  // 收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  // 分配用户的职位
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '分配职位成功!' })
    // 关闭抽屉
    drawer1.value = false
    // 获取更新完毕后的用户信息,更新完毕后留在当前页
    getHasUser(pageNo.value)
  }
}

// 删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

// table复选框勾选时触发的事件
const selectionChange = (value: any) => {
  selectIdArr.value = value
}

// 批量删除按钮的回调
const deleteSelectUser = async () => {
  // 整理批量删除的参数
  let idsList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  // 批量删除的请求
  let result: any = await reqSelectUser(idsList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

// 搜索按钮的回调
const search = () => {
  // 根据关键字获取想要的用户数据
  getHasUser()
  keyword.value = ''
}

// 重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
