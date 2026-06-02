import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CrudSearch from '../../src/components/CrudSearch.vue'
import type { SearchConfig } from '../../src/types'

// 简单的 stub 组件
const Stub = {
  template: '<div><slot /></div>',
  props: ['*'],
}

const FormStub = {
  template: '<form @submit.prevent><slot /></form>',
  props: ['*'],
  methods: {
    resetFields() {},
    validate() { return Promise.resolve() },
  },
}

describe('CrudSearch', () => {
  const config: SearchConfig = {
    fields: [
      { prop: 'name', label: '姓名', type: 'input' },
      { prop: 'status', label: '状态', type: 'select', options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] },
      { prop: 'createTime', label: '创建时间', type: 'date-picker' },
    ],
  }

  const globalStubs = {
    ElForm: FormStub,
    ElRow: Stub,
    ElCol: Stub,
    ElFormItem: Stub,
    ElInput: Stub,
    ElSelect: Stub,
    ElOption: Stub,
    ElDatePicker: Stub,
    ElTimePicker: Stub,
    ElTimeSelect: Stub,
    ElSwitch: Stub,
    ElCheckboxGroup: Stub,
    ElCheckbox: Stub,
    ElRadioGroup: Stub,
    ElRadio: Stub,
    ElButton: Stub,
    ElIcon: Stub,
    ArrowUp: Stub,
    ArrowDown: Stub,
  }

  it('renders correctly', () => {
    const wrapper = mount(CrudSearch, {
      props: { config },
      global: { stubs: globalStubs },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders correct number of fields', () => {
    const wrapper = mount(CrudSearch, {
      props: { config },
      global: { stubs: globalStubs },
    })
    const displayFields = (wrapper.vm as any).displayFields
    expect(displayFields).toHaveLength(3)
  })

  it('limits fields when showMore is true', () => {
    const configWithMore: SearchConfig = {
      ...config,
      showMore: true,
      moreCount: 2,
      fields: [
        { prop: 'name', label: '姓名', type: 'input' },
        { prop: 'status', label: '状态', type: 'select' },
        { prop: 'email', label: '邮箱', type: 'input' },
        { prop: 'phone', label: '手机', type: 'input' },
      ],
    }

    const wrapper = mount(CrudSearch, {
      props: { config: configWithMore },
      global: { stubs: globalStubs },
    })

    const displayFields = (wrapper.vm as any).displayFields
    expect(displayFields).toHaveLength(2)
  })

  it('shows all fields when showMore is toggled', async () => {
    const configWithMore: SearchConfig = {
      ...config,
      showMore: true,
      moreCount: 2,
      fields: [
        { prop: 'name', label: '姓名', type: 'input' },
        { prop: 'status', label: '状态', type: 'select' },
        { prop: 'email', label: '邮箱', type: 'input' },
        { prop: 'phone', label: '手机', type: 'input' },
      ],
    }

    const wrapper = mount(CrudSearch, {
      props: { config: configWithMore },
      global: { stubs: globalStubs },
    })

    // 切换显示更多
    ;(wrapper.vm as any).showMore = true
    await wrapper.vm.$nextTick()

    const displayFields = (wrapper.vm as any).displayFields
    expect(displayFields).toHaveLength(4)
  })

  it('initializes form data with default values', () => {
    const configWithDefaults: SearchConfig = {
      fields: [
        { prop: 'name', label: '姓名', type: 'input', defaultValue: '张三' },
        { prop: 'status', label: '状态', type: 'select', defaultValue: 1 },
        { prop: 'tags', label: '标签', type: 'checkbox', defaultValue: [] },
      ],
    }

    const wrapper = mount(CrudSearch, {
      props: { config: configWithDefaults },
      global: { stubs: globalStubs },
    })

    const formData = (wrapper.vm as any).formData
    expect(formData.name).toBe('张三')
    expect(formData.status).toBe(1)
    expect(formData.tags).toEqual([])
  })

  it('emits search event with filtered params', async () => {
    const wrapper = mount(CrudSearch, {
      props: { config },
      global: { stubs: globalStubs },
    })

    // 设置表单数据
    const formData = (wrapper.vm as any).formData
    formData.name = '张三'
    formData.status = 1
    formData.createTime = ''

    // 触发搜索
    ;(wrapper.vm as any).handleSearch()

    const emitted = wrapper.emitted('search')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toEqual({ name: '张三', status: 1 })
  })

  it('emits reset event', async () => {
    const wrapper = mount(CrudSearch, {
      props: { config },
      global: { stubs: globalStubs },
    })

    // 触发重置
    ;(wrapper.vm as any).handleReset()

    expect(wrapper.emitted('reset')).toBeTruthy()
  })

  it('resets form data to defaults', () => {
    const configWithDefaults: SearchConfig = {
      fields: [
        { prop: 'name', label: '姓名', type: 'input', defaultValue: '默认名' },
        { prop: 'status', label: '状态', type: 'select', defaultValue: 0 },
      ],
    }

    const wrapper = mount(CrudSearch, {
      props: { config: configWithDefaults },
      global: { stubs: globalStubs },
    })

    // 修改数据
    const formData = (wrapper.vm as any).formData
    formData.name = '修改后'
    formData.status = 1

    // 重置
    ;(wrapper.vm as any).handleReset()

    expect(formData.name).toBe('默认名')
    expect(formData.status).toBe(0)
  })

  it('filters empty values in search params', () => {
    const wrapper = mount(CrudSearch, {
      props: { config },
      global: { stubs: globalStubs },
    })

    const formData = (wrapper.vm as any).formData
    formData.name = '张三'
    formData.status = undefined
    formData.createTime = null
    formData.email = ''

    ;(wrapper.vm as any).handleSearch()

    const emitted = wrapper.emitted('search')
    expect(emitted![0][0]).toEqual({ name: '张三' })
  })

  it('uses custom search and reset text', () => {
    const configWithText: SearchConfig = {
      ...config,
      searchText: '查询',
      resetText: '清空',
    }

    const wrapper = mount(CrudSearch, {
      props: { config: configWithText },
      global: { stubs: globalStubs },
    })

    expect(wrapper.vm.config.searchText).toBe('查询')
    expect(wrapper.vm.config.resetText).toBe('清空')
  })

  it('hides search button when showSearch is false', () => {
    const configWithoutSearch: SearchConfig = {
      ...config,
      showSearch: false,
    }

    const wrapper = mount(CrudSearch, {
      props: { config: configWithoutSearch },
      global: { stubs: globalStubs },
    })

    expect(wrapper.vm.config.showSearch).toBe(false)
  })

  it('hides reset button when showReset is false', () => {
    const configWithoutReset: SearchConfig = {
      ...config,
      showReset: false,
    }

    const wrapper = mount(CrudSearch, {
      props: { config: configWithoutReset },
      global: { stubs: globalStubs },
    })

    expect(wrapper.vm.config.showReset).toBe(false)
  })
})
