<template>
  <div>
    <el-card>
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button
        type="primary"
        size="default"
        icon="plus"
        @click="addTrademark"
      >
        添加品牌
      </el-button>
      <el-table style="margin: 10px 0" border :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称">
          <template #="{ row, $index }">
            <pre style="color: aqua">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              :title="`您确定要删除${row.tmName}吗?`"
              width="250px"
              @confirm="removeTrademark(row.id)"
            >
              <template #reference>
                <el-button type="" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件 
        
      
      -->
      <el-pagination
        @current-change="getHasTrademark"
        :pager-count="9"
        @size-change="sizeChange"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        layout="prev,pager,next,jumper,->,sizes,total"
        :background="true"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 对话框组件:在添加品牌与修改已有品牌的业务时使用的结构 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            placeholder="请您输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO " label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽 footer-->
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 引入组合式API函数ref
import { ElMessage, UploadProps } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/produck/trademark'
import type {
  Records,
  TrademarkResponseData,
  Trademark,
} from '@/api/produck/trademark/type'

// 当前页码
const pageNo = ref<number>(1)
// 每一页展示多少多条数据
const limit = ref<number>(3)
// 存储已有品牌数据总数
const total = ref<number>(0)
// 存储已有品牌的数据
const trademarkArr = ref<Records>([])
// 控制对话框显示与隐藏
const dialogFormVisible = ref<boolean>(false)
// 定义收集新增品牌数据
const trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
})

// 获取已有品牌的接口封装为一个函数:获取数据直接调用即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TrademarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    // 存储已有品牌总个数
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}

// 组件挂载完毕钩子,发一次请求,获取第一页,一页三个已有品牌数据
onMounted(() => {
  getHasTrademark()
})

// 分页器当前页码发生变化的时候会触发
// 对于当前页码发生变化自定义事件,组件pagination父子间回传了数据(当前的页码)
// const changePageNo = () => {
//   getHasTrademark()
// }

// 当下拉菜单发生变化的时候触发此方法
// 这个自定义事件,分页器组件会将下拉菜单选中数据返回
const sizeChange = () => {
  // 当前每一页的数据量发生变化的时候,当前页码归1
  getHasTrademark()
}

// 添加品牌按钮回调
const addTrademark = () => {
  // 对话框显示
  dialogFormVisible.value = true
  // 清空收集数据
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  // 第一种ts的?语法
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

// 修改已有品牌按钮的回调
// row即为当前已有的品牌
const updateTrademark = (row: Trademark) => {
  // 清空校验规则提示信息
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  // 对话框显示
  dialogFormVisible.value = true
  // ES6语法合并对象
  Object.assign(trademarkParams, row)
  // trademarkParams.id = row.id
  // // 展示已有品牌的数据
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
}
// 对话框底部取消按钮
const cancel = () => {
  dialogFormVisible.value = false
}

// 对话框底部确定按钮
const confirm = async () => {
  // 发送请求之前,要对于整个表单进行校验
  // 调用这个方法进行全部表单校验,如果校验全部通过,再执行后面的语法
  await formRef.value.validate()
  const result: any = await reqAddOrUpdateTrademark(trademarkParams)
  // 添加品牌成功
  if (result.code == 200) {
    // 关闭对话框
    dialogFormVisible.value = false
    // 弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 再次发请求获取已有全部的品牌数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    // 添加品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
    // 关闭对话框
    dialogFormVisible.value = false
  }
}

// 上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 钩子是在上传成功之前触发,上传文件之前可以约束文件类型与大小
  if (
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif' ||
    rawFile.type == 'image/png'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件不得超过4M!',
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式必须为PNG|JPG|GIF!',
    })
    return false
  }
}

// 图片上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  // response:即为当前这次上传图片post请求服务器返回的数据
  // 收集上传图片的地址,添加一个新的品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  // 图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}

// 获取el-form组件实例
const formRef = ref()

// 品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  // 是当表单元素触发blur的时候,会触发此方法
  // 自定义校验规则
  if (value.trim().length >= 2) {
    callBack()
  } else {
    // 校验规则未通过返回的错误提示信息
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}
// 品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  // 如果图片上传
  if (value) {
    callBack()
  } else {
    // 校验规则未通过返回的错误提示信息
    callBack(new Error('LOGO图片务必上传'))
  }
}

// 表单校验项规则
const rules = {
  tmName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorTmName,
    },
  ],
  logoUrl: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorLogoUrl,
    },
  ],
}

// 气泡确认框确定按钮的回调
const removeTrademark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    // 删除成功提示信息
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    // 再次获取已有的品牌数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
