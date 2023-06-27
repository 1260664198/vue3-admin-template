<template>
  <div>
    <el-card>
      <el-table border style="margin: 10px 0" :data="skuArr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="名称"
          show-overflow-tooltip
          width="150px"
          prop="skuName"
        ></el-table-column>
        <el-table-column
          label="描述"
          show-overflow-tooltip
          width="150px"
          prop="skuDesc"
        ></el-table-column>
        <el-table-column label="图片" width="150px">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column
          label="重量"
          width="150px"
          prop="weight"
        ></el-table-column>
        <el-table-column
          label="价格"
          width="150px"
          prop="price"
        ></el-table-column>
        <el-table-column label="操作" width="250px" fixed="right">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
              @click="updateSale(row)"
            ></el-button>
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              @click="updateSku"
            ></el-button>
            <el-button
              type="info"
              size="small"
              icon="InfoFilled"
              @click="findSku(row)"
            ></el-button>
            <el-popconfirm
              :title="`您确定要删除${row.skuName}吗?`"
              width="200px"
              @confirm="removeSku(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout="prev, pager, next, ->, sizes, total"
        :total="400"
        @current-change="getHasSku"
        @size-change="handler"
      />
      <!-- 抽屉组件-展示商品的详情 -->
      <el-drawer v-model="drawer">
        <!-- 标题部分 -->
        <template #header>
          <h4>查看商品的详情</h4>
        </template>
        <template #default>
          <el-row style="margin: 10px 0">
            <el-col :span="6">名称</el-col>
            <el-col :span="18">{{ skuInfo.skuName }}</el-col>
          </el-row>
          <el-row style="margin: 10px 0">
            <el-col :span="6">描述</el-col>
            <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
          </el-row>
          <el-row style="margin: 10px 0">
            <el-col :span="6">价格</el-col>
            <el-col :span="18">{{ skuInfo.price }}</el-col>
          </el-row>
          <el-row style="margin: 10px 0">
            <el-col :span="6">平台属性</el-col>
            <el-col :span="18">
              <el-tag
                style="margin: 5px"
                v-for="item in skuInfo.skuAttrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </el-col>
          </el-row>
          <el-row style="margin: 10px 0">
            <el-col :span="6">销售属性</el-col>
            <el-col :span="18">
              <el-tag
                style="margin: 5px"
                v-for="item in skuInfo.skuSaleAttrValueList"
                :key="item.id"
              >
                {{ item.saleAttrValueName }}
              </el-tag>
            </el-col>
          </el-row>
          <el-row style="margin: 10px 0">
            <el-col :span="6">商品图片</el-col>
            <el-col :span="18">
              <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item
                  v-for="item in skuInfo.skuImageList"
                  :key="item.id"
                >
                  <img
                    :src="item.imgUrl"
                    justify="center"
                    style="width: 100%; height: 100%"
                  />
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </el-row>
        </template>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 引入请求
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSale,
  reqSkuInfo,
  reqRemoveSku,
} from '@/api/produck/sku'
import type {
  SkuResponseData,
  SkuData,
  SkuInfoData,
} from '@/api/produck/sku/type'
import { ElMessage } from 'element-plus'
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
// 控制抽屉显示或隐藏
let drawer = ref<boolean>(false)
let skuInfo = ref<any>({})
// 组件挂载完毕
onMounted(() => {
  getHasSku()
})

const getHasSku = async (pager = 1) => {
  // 当前分页器的页码
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

// 分页器下拉菜单发生变化时触发
const handler = (pageSizes: number) => {
  getHasSku()
}

// 商品的上架与下架操作
const updateSale = async (row: SkuData) => {
  // 如果当前商品的isSale == 1,说明当前商品是上架状态->更新为下架
  // 否则else情况与上面情况相反
  if (row.isSale == 1) {
    // 下架操作
    await reqCancelSale(row.id as number)
    // 提示信息
    ElMessage({
      type: 'success',
      message: '下架成功',
    })
    // 发请求获取当前更新完毕的全部已有的sku
    getHasSku(pageNo.value)
  } else {
    await reqSaleSku(row.id as number)
    // 提示信息
    ElMessage({
      type: 'success',
      message: '上架成功',
    })
    // 发请求获取当前更新完毕的全部已有的sku
    getHasSku(pageNo.value)
  }
}

// 更新已有的sku
const updateSku = () => {
  ElMessage({
    type: 'success',
    message: '程序员正在努力研发中!😁',
  })
}

// 查看商品详情按钮的回调
const findSku = async (row: SkuData) => {
  // 点击展示抽屉
  drawer.value = true
  // 获取已有商品详情数据
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  if (result.code == 200) {
    // 存储已有的sku
    skuInfo.value = result.data
  }
}

// 删除某一个已有的商品
const removeSku = async (id: number) => {
  let result: any = await reqRemoveSku(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 获取已有的全部商品
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
