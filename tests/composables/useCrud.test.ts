import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCrud } from '../../src/composables/useCrud'
import type { CrudApi, CrudColumns, SearchConfig, DialogConfig } from '../../src/types'

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
  ElMessageBox: {
    confirm: vi.fn().mockResolvedValue('confirm'),
  },
}))

describe('useCrud', () => {
  const columns: CrudColumns = [
    { prop: 'id', label: 'ID' },
    { prop: 'name', label: '姓名' },
    { prop: 'status', label: '状态' },
  ]

  const mockListData = {
    list: [
      { id: 1, name: '张三', status: 1 },
      { id: 2, name: '李四', status: 0 },
    ],
    total: 2,
  }

  const api: CrudApi = {
    list: vi.fn().mockResolvedValue(mockListData),
    create: vi.fn().mockResolvedValue({ id: 3, name: '王五', status: 1 }),
    update: vi.fn().mockResolvedValue({ id: 1, name: '张三更新', status: 1 }),
    delete: vi.fn().mockResolvedValue(undefined),
    batchDelete: vi.fn().mockResolvedValue(undefined),
  }

  const searchConfig: SearchConfig = {
    fields: [
      { prop: 'name', label: '姓名', type: 'input' },
    ],
  }

  const dialogConfig: DialogConfig = {
    fields: [
      { prop: 'name', label: '姓名', type: 'input', required: true },
      { prop: 'status', label: '状态', type: 'select' },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with correct defaults', () => {
    const crud = useCrud({
      columns,
      api,
      search: searchConfig,
      dialog: dialogConfig,
      immediate: false,
    })

    expect(crud.tableData.value).toEqual([])
    expect(crud.loading.value).toBe(false)
    expect(crud.selectedRows.value).toEqual([])
    expect(crud.total.value).toBe(0)
    expect(crud.currentPage.value).toBe(1)
    expect(crud.pageSize.value).toBe(10)
  })

  it('fetches list data', async () => {
    const crud = useCrud({
      columns,
      api,
      immediate: false,
    })

    await crud.fetchList()

    expect(api.list).toHaveBeenCalled()
    expect(crud.tableData.value).toEqual(mockListData.list)
    expect(crud.total.value).toBe(2)
  })

  it('handles search', async () => {
    const crud = useCrud({
      columns,
      api,
      search: searchConfig,
      immediate: false,
    })

    await crud.handleSearch({ name: '张三' })

    expect(api.list).toHaveBeenCalled()
    expect(crud.searchParams.value.name).toBe('张三')
  })

  it('handles reset search', async () => {
    const crud = useCrud({
      columns,
      api,
      search: searchConfig,
      immediate: false,
    })

    // 先搜索
    await crud.handleSearch({ name: '张三' })

    // 重置
    crud.handleResetSearch()

    expect(crud.searchParams.value).toEqual({})
  })

  it('handles page change', async () => {
    const crud = useCrud({
      columns,
      api,
      immediate: false,
    })

    crud.handlePageChange(2)

    expect(crud.currentPage.value).toBe(2)
    expect(api.list).toHaveBeenCalled()
  })

  it('handles size change', async () => {
    const crud = useCrud({
      columns,
      api,
      immediate: false,
    })

    crud.handleSizeChange(20)

    expect(crud.pageSize.value).toBe(20)
    expect(crud.currentPage.value).toBe(1)
    expect(api.list).toHaveBeenCalled()
  })

  it('opens create dialog', () => {
    const crud = useCrud({
      columns,
      api,
      dialog: dialogConfig,
      immediate: false,
    })

    crud.openCreateDialog()

    expect(crud.dialogVisible.value).toBe(true)
    expect(crud.dialogMode.value).toBe('create')
    expect(crud.isCreateMode.value).toBe(true)
  })

  it('opens edit dialog', () => {
    const crud = useCrud({
      columns,
      api,
      dialog: dialogConfig,
      immediate: false,
    })

    const row = { id: 1, name: '张三', status: 1 }
    crud.openEditDialog(row)

    expect(crud.dialogVisible.value).toBe(true)
    expect(crud.dialogMode.value).toBe('edit')
    expect(crud.isEditMode.value).toBe(true)
    expect(crud.dialogData.value.id).toBe(1)
    expect(crud.dialogData.value.name).toBe('张三')
  })

  it('opens view dialog', () => {
    const crud = useCrud({
      columns,
      api,
      dialog: dialogConfig,
      immediate: false,
    })

    const row = { id: 1, name: '张三', status: 1 }
    crud.openViewDialog(row)

    expect(crud.dialogVisible.value).toBe(true)
    expect(crud.dialogMode.value).toBe('view')
    expect(crud.isViewMode.value).toBe(true)
  })

  it('closes dialog', () => {
    const crud = useCrud({
      columns,
      api,
      dialog: dialogConfig,
      immediate: false,
    })

    crud.openCreateDialog()
    expect(crud.dialogVisible.value).toBe(true)

    crud.closeDialog()
    expect(crud.dialogVisible.value).toBe(false)
  })

  it('handles create submit', async () => {
    const crud = useCrud({
      columns,
      api,
      dialog: dialogConfig,
      immediate: false,
    })

    crud.openCreateDialog()

    // 确保是创建模式
    expect(crud.dialogMode.value).toBe('create')

    await crud.handleSubmit({ name: '王五', status: 1 })

    expect(api.create).toHaveBeenCalledWith({ name: '王五', status: 1 })
  })

  it('handles update submit', async () => {
    const crud = useCrud({
      columns,
      api,
      dialog: dialogConfig,
      immediate: false,
    })

    crud.openEditDialog({ id: 1, name: '张三', status: 1 })

    // 确保是编辑模式
    expect(crud.dialogMode.value).toBe('edit')

    await crud.handleSubmit({ name: '张三更新', status: 1 })

    expect(api.update).toHaveBeenCalledWith(1, { name: '张三更新', status: 1 })
  })

  it('handles delete', async () => {
    const crud = useCrud({
      columns,
      api,
      immediate: false,
    })

    await crud.handleDelete({ id: 1, name: '张三' })

    expect(api.delete).toHaveBeenCalledWith(1)
  })

  it('handles batch delete', async () => {
    const crud = useCrud({
      columns,
      api,
      immediate: false,
    })

    // 模拟选中行
    crud.selectedRows.value = [
      { id: 1, name: '张三' },
      { id: 2, name: '李四' },
    ]

    await crud.handleBatchDelete()

    expect(api.batchDelete).toHaveBeenCalledWith([1, 2])
  })

  it('handles refresh', async () => {
    const crud = useCrud({
      columns,
      api,
      immediate: false,
    })

    await crud.handleRefresh()

    expect(api.list).toHaveBeenCalled()
  })

  it('gets table data', async () => {
    const crud = useCrud({
      columns,
      api,
      immediate: false,
    })

    await crud.fetchList()

    const data = crud.getTableData()
    expect(data).toEqual(mockListData.list)
  })

  it('gets selection rows', () => {
    const crud = useCrud({
      columns,
      api,
      immediate: false,
    })

    crud.selectedRows.value = [{ id: 1 }]

    const rows = crud.getSelectionRows()
    expect(rows).toEqual([{ id: 1 }])
  })

  it('clears selection', () => {
    const crud = useCrud({
      columns,
      api,
      immediate: false,
    })

    crud.selectedRows.value = [{ id: 1 }, { id: 2 }]
    crud.clearSelection()

    expect(crud.selectedRows.value).toEqual([])
  })

  it('handles sort change', async () => {
    const crud = useCrud({
      columns,
      api,
      immediate: false,
    })

    await crud.handleSortChange({ prop: 'name', order: 'ascending' })

    expect(api.list).toHaveBeenCalled()
  })

  it('loads data when fetchList is called', async () => {
    const crud = useCrud({
      columns,
      api,
      immediate: false,
    })

    await crud.fetchList()

    expect(api.list).toHaveBeenCalled()
    expect(crud.tableData.value).toEqual(mockListData.list)
  })
})
