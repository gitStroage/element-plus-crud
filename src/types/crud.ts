import type { CrudColumns } from './column'
import type { SearchConfig } from './search'
import type { DialogConfig } from './dialog'

/**
 * API 接口配置
 */
export interface CrudApi<T = any> {
  /** 获取列表 */
  list: (params: CrudListParams) => Promise<CrudListResult<T>>
  /** 新增数据 */
  create?: (data: Partial<T>) => Promise<T>
  /** 更新数据 */
  update?: (id: any, data: Partial<T>) => Promise<T>
  /** 删除数据 */
  delete?: (id: any) => Promise<void>
  /** 批量删除 */
  batchDelete?: (ids: any[]) => Promise<void>
  /** 获取详情 */
  detail?: (id: any) => Promise<T>
}

/**
 * 列表请求参数
 */
export interface CrudListParams {
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 搜索参数 */
  [key: string]: any
}

/**
 * 列表返回结果
 */
export interface CrudListResult<T = any> {
  /** 数据列表 */
  list: T[]
  /** 总条数 */
  total: number
  /** 其他字段 */
  [key: string]: any
}

/**
 * 分页配置
 */
export interface PaginationConfig {
  /** 每页条数选项 */
  pageSizes?: number[]
  /** 默认每页条数 */
  pageSize?: number
  /** 默认当前页 */
  currentPage?: number
  /** 布局 */
  layout?: string
  /** 背景色 */
  background?: boolean
  /** 是否显示总数 */
  total?: boolean
  /** 是否显示每页条数选择器 */
  pagerCount?: number
}

/**
 * 工具栏配置
 */
export interface ToolbarConfig {
  /** 是否显示新增按钮 */
  showCreate?: boolean
  /** 是否显示批量删除按钮 */
  showBatchDelete?: boolean
  /** 是否显示刷新按钮 */
  showRefresh?: boolean
  /** 是否显示密度选择 */
  showDensity?: boolean
  /** 是否显示列设置 */
  showColumnSetting?: boolean
  /** 新增按钮文本 */
  createText?: string
  /** 批量删除按钮文本 */
  batchDeleteText?: string
}

/**
 * 主键字段名
 */
export type KeyField = string

/**
 * CRUD 组件 Props
 */
export interface CrudProps<T = any> {
  /** 表格列配置 */
  columns: CrudColumns<T>
  /** API 接口配置 */
  api: CrudApi<T>
  /** 搜索配置 */
  search?: SearchConfig
  /** 弹窗表单配置 */
  dialog?: DialogConfig
  /** 分页配置 */
  pagination?: PaginationConfig
  /** 工具栏配置 */
  toolbar?: ToolbarConfig
  /** 主键字段名，默认 'id' */
  keyField?: KeyField
  /** 是否立即加载数据 */
  immediate?: boolean
  /** 表格高度 */
  height?: number | string
  /** 是否显示斑马纹 */
  stripe?: boolean
  /** 是否显示边框 */
  border?: boolean
  /** 表格尺寸 */
  size?: 'large' | 'default' | 'small'
}

/**
 * CRUD 组件 Emits
 */
export interface CrudEmits {
  /** 搜索事件 */
  (e: 'search', params: Record<string, any>): void
  /** 重置搜索事件 */
  (e: 'reset'): void
  /** 新增事件 */
  (e: 'create', data: Record<string, any>): void
  /** 更新事件 */
  (e: 'update', id: any, data: Record<string, any>): void
  /** 删除事件 */
  (e: 'delete', id: any): void
  /** 批量删除事件 */
  (e: 'batch-delete', ids: any[]): void
  /** 行点击事件 */
  (e: 'row-click', row: any, column: any, event: Event): void
  /** 选择变化事件 */
  (e: 'selection-change', rows: any[]): void
  /** 分页变化事件 */
  (e: 'page-change', page: number): void
  /** 每页条数变化事件 */
  (e: 'size-change', size: number): void
}

/**
 * CRUD 组件暴露的方法
 */
export interface CrudExposed {
  /** 刷新表格数据 */
  refresh: () => Promise<void>
  /** 执行搜索 */
  search: (params?: Record<string, any>) => void
  /** 重置搜索 */
  resetSearch: () => void
  /** 获取选中行 */
  getSelectionRows: () => any[]
  /** 打开新增弹窗 */
  openCreateDialog: (defaultData?: Record<string, any>) => void
  /** 打开编辑弹窗 */
  openEditDialog: (row: any) => void
  /** 关闭弹窗 */
  closeDialog: () => void
  /** 获取表格数据 */
  getTableData: () => any[]
  /** 设置表格数据 */
  setTableData: (data: any[]) => void
}
