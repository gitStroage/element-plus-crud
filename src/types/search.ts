/**
 * 搜索字段类型
 */
export type SearchFieldType = 'input' | 'select' | 'date-picker' | 'date-range-picker' | 'time-picker' | 'time-select' | 'switch' | 'checkbox' | 'radio'

/**
 * 选项配置
 */
export interface OptionItem {
  /** 选项标签 */
  label: string
  /** 选项值 */
  value: string | number | boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 子选项 */
  children?: OptionItem[]
}

/**
 * 搜索字段配置
 */
export interface SearchField {
  /** 字段名 */
  prop: string
  /** 字段标签 */
  label: string
  /** 字段类型 */
  type?: SearchFieldType
  /** 占位符 */
  placeholder?: string
  /** 默认值 */
  defaultValue?: any
  /** 选项列表（select、checkbox、radio 使用） */
  options?: OptionItem[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 样式类名 */
  className?: string
  /** 组件属性透传 */
  componentProps?: Record<string, any>
}

/**
 * 搜索配置
 */
export interface SearchConfig {
  /** 搜索字段列表 */
  fields: SearchField[]
  /** 是否显示更多按钮 */
  showMore?: boolean
  /** 更多按钮显示数量 */
  moreCount?: number
  /** 搜索按钮文本 */
  searchText?: string
  /** 重置按钮文本 */
  resetText?: string
  /** 是否显示搜索按钮 */
  showSearch?: boolean
  /** 是否显示重置按钮 */
  showReset?: boolean
  /** 标签宽度 */
  labelWidth?: string
  /** 标签位置 */
  labelPosition?: 'left' | 'right' | 'top'
}
