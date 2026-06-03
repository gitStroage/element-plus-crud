import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import ElCrud from '../../src/components/ElCrud.vue'
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

describe('ElCrud', () => {
  const columns: CrudColumns = [
    { prop: 'id', label: 'ID', width: 80 },
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

  it('renders correctly', () => {
    const wrapper = shallowMount(ElCrud, {
      props: { columns, api, immediate: false },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.el-crud').exists()).toBe(true)
  })

  it('has correct default props', () => {
    const wrapper = shallowMount(ElCrud, {
      props: { columns, api, immediate: false },
    })

    expect(wrapper.props('keyField')).toBe('id')
    expect(wrapper.props('immediate')).toBe(false)
    expect(wrapper.props('stripe')).toBe(true)
    expect(wrapper.props('border')).toBe(true)
    expect(wrapper.props('size')).toBe('default')
  })

  it('renders search component when search config is provided', () => {
    const wrapper = shallowMount(ElCrud, {
      props: { columns, api, search: searchConfig, immediate: false },
    })

    expect(wrapper.findComponent({ name: 'CrudSearch' }).exists()).toBe(true)
  })

  it('does not render search component when search config is not provided', () => {
    const wrapper = shallowMount(ElCrud, {
      props: { columns, api, immediate: false },
    })

    expect(wrapper.findComponent({ name: 'CrudSearch' }).exists()).toBe(false)
  })

  it('renders dialog component when dialog config is provided', () => {
    const wrapper = shallowMount(ElCrud, {
      props: { columns, api, dialog: dialogConfig, immediate: false },
    })

    expect(wrapper.findComponent({ name: 'CrudDialog' }).exists()).toBe(true)
  })

  it('fetches list data on mount when immediate is true', async () => {
    shallowMount(ElCrud, {
      props: { columns, api, immediate: true },
    })

    // 等待 onMounted
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(api.list).toHaveBeenCalled()
  })

  it('does not fetch list data on mount when immediate is false', () => {
    shallowMount(ElCrud, {
      props: { columns, api, immediate: false },
    })

    expect(api.list).not.toHaveBeenCalled()
  })

  it('exposes correct methods', () => {
    const wrapper = shallowMount(ElCrud, {
      props: { columns, api, immediate: false },
    })

    expect(typeof wrapper.vm.refresh).toBe('function')
    expect(typeof wrapper.vm.search).toBe('function')
    expect(typeof wrapper.vm.resetSearch).toBe('function')
    expect(typeof wrapper.vm.getSelectionRows).toBe('function')
    expect(typeof wrapper.vm.openCreateDialog).toBe('function')
    expect(typeof wrapper.vm.openEditDialog).toBe('function')
    expect(typeof wrapper.vm.closeDialog).toBe('function')
    expect(typeof wrapper.vm.getTableData).toBe('function')
    expect(typeof wrapper.vm.setTableData).toBe('function')
  })

  it('emits search event when search is triggered', async () => {
    const wrapper = shallowMount(ElCrud, {
      props: { columns, api, search: searchConfig, immediate: false },
    })

    await wrapper.vm.search({ name: '张三' })

    expect(wrapper.emitted('search')).toBeTruthy()
  })

  it('emits reset event when resetSearch is triggered', async () => {
    const wrapper = shallowMount(ElCrud, {
      props: { columns, api, search: searchConfig, immediate: false },
    })

    await wrapper.vm.resetSearch()

    expect(wrapper.emitted('reset')).toBeTruthy()
  })

  it('sets table data correctly', () => {
    const wrapper = shallowMount(ElCrud, {
      props: { columns, api, immediate: false },
    })

    const data = [{ id: 1, name: '测试' }]
    wrapper.vm.setTableData(data)

    expect(wrapper.vm.getTableData()).toEqual(data)
  })

  it('handles custom keyField', () => {
    const wrapper = shallowMount(ElCrud, {
      props: { columns, api, keyField: 'userId', immediate: false },
    })

    expect(wrapper.props('keyField')).toBe('userId')
  })

  it('handles different sizes', () => {
    const wrapper = shallowMount(ElCrud, {
      props: { columns, api, size: 'large', immediate: false },
    })

    expect(wrapper.props('size')).toBe('large')
  })

  it('handles custom pagination config', () => {
    const wrapper = shallowMount(ElCrud, {
      props: {
        columns,
        api,
        immediate: false,
        pagination: {
          pageSizes: [5, 15, 30],
          pageSize: 15,
        },
      },
    })

    expect(wrapper.vm.pageSize).toBe(15)
  })

  it('handles custom toolbar config', () => {
    const wrapper = shallowMount(ElCrud, {
      props: {
        columns,
        api,
        immediate: false,
        toolbar: {
          showCreate: false,
          showBatchDelete: false,
          createText: '新建',
        },
      },
    })

    expect(wrapper.vm.toolbarConfig.showCreate).toBe(false)
    expect(wrapper.vm.toolbarConfig.showBatchDelete).toBe(false)
    expect(wrapper.vm.toolbarConfig.createText).toBe('新建')
  })
})
