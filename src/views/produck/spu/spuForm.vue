<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <el-input
          placeholder="请你输入SPU名称"
          v-model="SpuParams.spuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select v-model="SpuParams.tmId">
          <el-option
            :label="item.tmName"
            v-for="item in AllTrademark"
            :key="item.id"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="请你输入SPU描述"
          v-model="SpuParams.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图标">
        <!-- 
            v-model:file-list-> 展示默认图片
            action-> 上传图片的接口地址
            list-type:文件列表展示方式
         -->
        <el-upload
          v-model:file-list="imgList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="handlerUpload"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" style="width: 100%; height: 100%" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <!-- 展示销售属性的下拉菜单 -->
        <el-select
          v-model="saleAttrAndValueName"
          :placeholder="
            unSelectSaleAttr.length
              ? `还未选择${unSelectSaleAttr.length}个`
              : '无'
          "
        >
          <el-option
            :value="`${item.id}:${item.name}`"
            v-for="item in unSelectSaleAttr"
            :key="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
        <el-button
          style="margin-left: 10px"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="saleAttrAndValueName ? false : true"
          @click="addSaleAttr"
        >
          添加属性
        </el-button>
        <!-- table展示销售属性与属性值的地方 -->
        <el-table style="margin: 10px 0" border :data="saleAttr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="销售属性名称"
            width="120px"
            prop="saleAttrName"
          ></el-table-column>
          <el-table-column label="销售属性值">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 0 5px"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                v-for="item in row.spuSaleAttrValueList"
                :key="row.id"
                class="mx-1"
                closable
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <el-input
                @blur="toLook(row)"
                v-model="row.saleAttrValue"
                v-if="row.flag == true"
                placeholder="请输入属性值"
                size="small"
                style="width: 100px"
              ></el-input>
              <el-button
                v-else
                @click="toEdit(row)"
                type="primary"
                size="small"
                icon="Plus"
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="saleAttr.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saleAttr.length > 0 ? false : true"
          type="primary"
          size="default"
          @click="save"
        >
          保存
        </el-button>
        <el-button type="danger" size="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  SpuData,
  AllTrademark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
  SaleAttrValue,
} from '@/api/produck/spu/type'
import {
  reqAllTrademark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/produck/spu'
import { ElMessage } from 'element-plus'
let $emit = defineEmits(['changeScene'])
// 点击取消按钮:通知父组件切换场景为1,展示已有spu数据
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

// 存储已有的spu数据
let AllTrademark = ref<Trademark[]>([])
// 商品图片
let imgList = ref<SpuImg[]>([])
// 已有的spu销售属性
let saleAttr = ref<SaleAttr[]>([])
// 全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
// 存储已有的spu对象
let SpuParams = ref<SpuData>({
  category3Id: '', // 收集三级分类id
  spuName: '', // SPU的名字
  description: '', // spu的描述
  tmId: '', // 品牌的id
  spuImageList: [],
  spuSaleAttrList: [],
})
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 存储预览图片地址
let dialogImageUrl = ref<string>('')
// 将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrAndValueName = ref<string>('')

// 子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  // 存储已有的spu对象,将来在模板中显示
  SpuParams.value = spu
  // spu:即为父组件传递过来的已有的spu对象[不完整]
  // 获取全部品牌的数据
  let result: AllTrademark = await reqAllTrademark()
  // 获取已有的SPU下全部商品的图片地址
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  // 获取已有的SPU拥有多少个销售属性
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  // 获取整个项目全部spu的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  console.log(result, result1)

  // 存储全部品牌的数据
  AllTrademark.value = result.data
  // spu对应商品图片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // 存储已有的spu的销售属性
  saleAttr.value = result2.data
  // 存储全部销售属性
  allSaleAttr.value = result3.data
}

// 照片墙点击预览按钮时触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  // 对话框弹出
  dialogVisible.value = true
}
// 照片墙删除文件钩子
const handleRemove = () => {}
// 照片墙上传成功之前的钩子约束文件的大小与类型
const handlerUpload = (file: any) => {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小需为3M以内!',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件类型需为PNG|JPG|GIF',
    })
    return false
  }
}

// 计算当前spu还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  // 全部销售属性:颜色,版本,尺码
  // 已有的销售属性:颜色,版本
  let unSelectAttr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectAttr
})

// 添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrAndValueName.value.split(':')
  // 准备一个新的销售属性对象,将来带给服务器即可
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到数组当中
  saleAttr.value.push(newSaleAttr)
  // 清空收集的数据
  saleAttrAndValueName.value = ''
}

// 属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
  // 点击按钮 => 变为编辑模式
  row.flag = true
  row.saleAttrValue = ''
}

// 表单元素失去焦点的事件回调
const toLook = (row: SaleAttr) => {
  // 收集整理属性的id与属性值名字
  const { baseSaleAttrId, saleAttrValue } = row
  // 整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }

  // 非法情况判断
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空!',
    })
    return
  }
  // 判断属性值是否在数组当中存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复',
    })
    return
  }
  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}

// 保存按钮的回调
const save = async () => {
  // 整理参数 1.照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name, // 图片的名字
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 2.整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    // 通知父组件切换场景为0
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

// 添加一个新的spu初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据
  Object.assign(SpuParams.value, {
    category3Id: '', // 收集三级分类id
    spuName: '', // SPU的名字
    description: '', // spu的描述
    tmId: '', // 品牌的id
    spuImageList: [],
    spuSaleAttrList: [],
  })
  // 清空照片
  imgList.value = []
  // 清空销售属性
  saleAttr.value = []
  saleAttrAndValueName.value = ''

  // 存储三级分类的id
  SpuParams.value.category3Id = c3Id
  // 获取全屏品牌的数据
  let result: AllTrademark = await reqAllTrademark()
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr()
  // 存储数据
  AllTrademark.value = result.data
  allSaleAttr.value = result1.data
}
// 对外暴露子组件方法
defineExpose({ initHasSpuData, initAddSpu })
</script>
