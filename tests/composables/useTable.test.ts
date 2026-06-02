import { describe, it, expect } from 'vitest'
import { useTable } from '../../src/composables/useTable'
import type { CrudColumns } from '../../src/types'

describe('useTable', () => {
  const columns: CrudColumns = [
    { prop: 'id', label: 'ID' },
    { prop: 'name', label: '姓名' },
    { prop: 'email', label: '邮箱', hidden: true },
  ]

  it('initializes with empty state', () => {
    const { tableData, loading, selectedRows } = useTable(columns)

    expect(tableData.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(selectedRows.value).toEqual([])
  })

  it('filters hidden columns', () => {
    const { visibleColumns } = useTable(columns)

    expect(visibleColumns.value).toHaveLength(2)
    expect(visibleColumns.value.find((col) => col.prop === 'email')).toBeUndefined()
  })

  it('sets table data', () => {
    const { tableData, setData } = useTable(columns)
    const data = [{ id: 1, name: '张三' }]

    setData(data)
    expect(tableData.value).toEqual(data)
  })

  it('sets loading state', () => {
    const { loading, setLoading } = useTable(columns)

    setLoading(true)
    expect(loading.value).toBe(true)

    setLoading(false)
    expect(loading.value).toBe(false)
  })

  it('manages selection', () => {
    const { selectedRows, setSelection, clearSelection } = useTable(columns)
    const rows = [{ id: 1 }, { id: 2 }]

    setSelection(rows)
    expect(selectedRows.value).toEqual(rows)

    clearSelection()
    expect(selectedRows.value).toEqual([])
  })

  it('manages sort params', () => {
    const { setSort, getSortParams } = useTable(columns)

    setSort('name', 'ascending')
    expect(getSortParams()).toEqual({ orderBy: 'name', order: 'asc' })

    setSort('name', 'descending')
    expect(getSortParams()).toEqual({ orderBy: 'name', order: 'desc' })

    setSort('', '')
    expect(getSortParams()).toEqual({})
  })
})
