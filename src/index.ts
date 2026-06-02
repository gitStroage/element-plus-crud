import type { App } from 'vue'
import ElCrud from './components/ElCrud.vue'

// 导出组件
export { ElCrud }

// 导出类型
export type {
  CrudColumn,
  CrudColumns,
  CrudApi,
  CrudListParams,
  CrudListResult,
  CrudProps,
  CrudEmits,
  CrudExposed,
  SearchConfig,
  SearchField,
  SearchFieldType,
  DialogConfig,
  DialogMode,
  FormField,
  FormFieldType,
  PaginationConfig,
  ToolbarConfig,
  OptionItem,
  ColumnType,
  ColumnAlign,
  ColumnFixed,
  TagType,
  TagConfig,
  TagMap,
  DateTimeFormat,
  ImageConfig,
  LinkConfig,
  ColumnFormatter,
} from './types'

// 导出工具函数
export { formatDateTime, formatNumber, formatFileSize } from './utils'

// 插件安装函数
export function install(app: App) {
  app.component('ElCrud', ElCrud)
}

// 默认导出
export default {
  install,
  ElCrud,
}
