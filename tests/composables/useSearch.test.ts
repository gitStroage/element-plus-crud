import { describe, it, expect } from 'vitest'
import { useSearch } from '../../src/composables/useSearch'
import type { SearchConfig } from '../../src/types'

describe('useSearch', () => {
  const config: SearchConfig = {
    fields: [
      { prop: 'name', label: '姓名', type: 'input' },
      { prop: 'status', label: '状态', type: 'select', defaultValue: 1 },
      { prop: 'tags', label: '标签', type: 'checkbox', defaultValue: [] },
    ],
  }

  it('initializes with default values', () => {
    const { searchParams, initParams } = useSearch(config)
    initParams()

    expect(searchParams.value.name).toBeUndefined()
    expect(searchParams.value.status).toBe(1)
    expect(searchParams.value.tags).toEqual([])
  })

  it('sets params', () => {
    const { searchParams, setParams } = useSearch(config)

    setParams({ name: '张三', status: 2 })
    expect(searchParams.value.name).toBe('张三')
    expect(searchParams.value.status).toBe(2)
  })

  it('sets single param', () => {
    const { searchParams, setParam } = useSearch(config)

    setParam('name', '李四')
    expect(searchParams.value.name).toBe('李四')
  })

  it('gets params filtering empty values', () => {
    const { setParams, getParams } = useSearch(config)

    setParams({ name: '张三', status: undefined, email: '' })
    const params = getParams()

    expect(params.name).toBe('张三')
    expect(params.status).toBeUndefined()
    expect(params.email).toBeUndefined()
  })

  it('resets params', () => {
    const { searchParams, setParams, resetParams, initParams } = useSearch(config)

    initParams()
    setParams({ name: '张三' })
    resetParams()

    expect(searchParams.value.name).toBeUndefined()
  })

  it('toggles more visibility', () => {
    const { showMore, toggleMore } = useSearch(config)

    expect(showMore.value).toBe(false)

    toggleMore()
    expect(showMore.value).toBe(true)

    toggleMore()
    expect(showMore.value).toBe(false)
  })
})
