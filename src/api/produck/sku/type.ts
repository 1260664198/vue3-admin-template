export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 定义sku对象的ts类型
export interface Attr {
  id?: number
  attrId: string | number
  valueId: string | number
}

export interface saleAttr {
  id?: number
  saleAttrId: string | number
  saleAttrValueId: string | number
}

export interface SkuData {
  category3Id?: string | number
  skuId?: string | number
  tmId?: string | number
  skuName?: string
  price?: string | number
  weight?: string | number
  skuDesc?: string
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleAttr[]
  skuDefaultImg?: string
  isSale?: number // 控制商品的上架与下架
  id?: number
}

// 获取sku接口返回的数据ts类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 获取sku商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
