<template>
  <div>
    <el-table
      :data="permissionArr"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="code" label="权限值"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            @click="addPermission(row)"
            size="small"
            :disabled="row.level == 4 ? true : false"
          >
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            type="success"
            @click="updatePermission(row)"
            size="small"
            :disabled="row.level == 1 ? true : false"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`您确定要删除${row.name}吗?`"
            width="260px"
            @confirm="removeMenu(row.id)"
          >
            <template #reference>
              <el-button
                type="danger"
                size="small"
                :disabled="row.level == 1 ? true : false"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      :title="menuData.id ? '更新菜单' : '添加菜单'"
    >
      <el-form>
        <el-form-item label="名称">
          <el-input
            placeholder="请您输入菜单名称"
            v-model="menuData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input
            placeholder="请您输入权限数值"
            v-model="menuData.code"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
// 引入获取菜单请求API
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/menu'
import {
  PermissionResponseData,
  PermissionList,
  Permission,
  MenuParams,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

// 存储菜单的数据
let permissionArr = ref<PermissionList>([])

// 控制对话框显示与隐藏
let dialogVisible = ref<boolean>(false)

// 携带的参数
let menuData: MenuParams = reactive({
  id: 0,
  code: '',
  level: 0,
  name: '',
  pid: 0,
})

onMounted(() => {
  getHasPermission()
})
// 获取菜单数据的方法
const getHasPermission = async () => {
  let result: PermissionResponseData = await reqAllPermission()
  if (result.code == 200) {
    permissionArr.value = result.data
  }
}

// 添加菜单按钮的回调
const addPermission = (row: Permission) => {
  // 清空数据
  Object.assign(menuData, {
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  dialogVisible.value = true
  // 收集新增的菜单level数值
  menuData.level = row.level + 1
  // 给谁新增子菜单
  menuData.pid = row.id as number
}
// 编辑已有的菜单
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  // 点击修改按钮:收集已有的菜单的数据进行更新
  Object.assign(menuData, row)
}

// 确定按钮的回调
const save = async () => {
  // 发请求:新增子菜单|更新某一个已有的菜单的数据
  let result = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功',
    })
    // 再次获取全部最新的菜单的数据
    getHasPermission()
  }
}

// 删除按钮的回调
const removeMenu = async (id: number) => {
  let result: any = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasPermission()
  }
}
</script>

<style scoped></style>
