import { ref } from 'vue'
import type { SearchConfig } from '../types'

export function useSearch(config?: SearchConfig) {
  const searchParams = ref<Record<string, any>>({})
  const showMore = ref(false)

  // 初始化搜索参数
  function initParams() {
    if (!config?.fields) return

    config.fields.forEach((field) => {
      searchParams.value[field.prop] = field.defaultValue ?? getDefaultValue(field.type)
    })
  }

  // 获取默认值
  function getDefaultValue(type?: string) {
    switch (type) {
      case 'checkbox':
        return []
      case 'switch':
        return false
      default:
        return undefined
    }
  }

  // 设置搜索参数
  function setParams(params: Record<string, any>) {
    searchParams.value = { ...params }
  }

  // 更新单个参数
  function setParam(key: string, value: any) {
    searchParams.value[key] = value
  }

  // 获取搜索参数（过滤空值）
  function getParams() {
    const params: Record<string, any> = {}
    Object.keys(searchParams.value).forEach((key) => {
      const value = searchParams.value[key]
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value
      }
    })
    return params
  }

  // 重置搜索参数
  function resetParams() {
    initParams()
  }

  // 切换更多显示
  function toggleMore() {
    showMore.value = !showMore.value
  }

  return {
    searchParams,
    showMore,
    initParams,
    setParams,
    setParam,
    getParams,
    resetParams,
    toggleMore,
  }
}
