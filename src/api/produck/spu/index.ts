// SPU管理模块的接口
import request from '@/utils/request'

import type {
  HasSpuResponseData,
  AllTrademark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type'
enum API {
  // 获取已有的SPU模块
  HASSPU_URL = '/admin/product/',
  // 获取全部品牌的数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个spu下的全部的售卖商品的图片数据
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某一个spu下全部的已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性(颜色,版本,尺码)
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  // 追加一个新的spu
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有的spu
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 追加一个新增的sku地址
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看某一个已有的spu下全部售卖的商品
  SKUINFO_URL = '/admin/product/findBySpuId/',
  // 删除已有的SPU
  REMOVESPU_URL = '/admin/product/deleteSku/',
}
// 获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: string | number,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

// 获取全部的SPU的品牌的数据
export const reqAllTrademark = () =>
  request.get<any, AllTrademark>(API.ALLTRADEMARK_URL)

// 获取某一个已有的SPU下全部商品的图片地址
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)

// 获取某一个已有的SPU拥有多少个销售属性
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

// 获取整个项目全部spu的销售属性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 删除已有的 spu
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVESPU_URL + spuId)

// 追加一个新的spu 更新已有的spu接口 data:即为新增的spu|或者已有的spu对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 如果spu对象拥有id,更新已有的spu
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

// 添加sku的请求方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

// 获取sku数据
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
