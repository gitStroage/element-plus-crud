import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CrudTable from '../../src/components/CrudTable.vue'
import type { CrudColumns } from '../../src/types'

// 简单的 stub 组件
const Stub = {
  template: '<div><slot /></div>',
  props: ['*'],
}

describe('CrudTable', () => {
  const columns: CrudColumns = [
    { prop: 'id', label: 'ID', width: 80 },
    { prop: 'name', label: '姓名' },
    { prop: 'email', label: '邮箱' },
  ]

  const data = [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
  ]

  const globalStubs = {
    ElTable: Stub,
    ElTableColumn: Stub,
    ElTag: Stub,
    ElImage: Stub,
    ElLink: Stub,
    ElButton: Stub,
    ElEmpty: Stub,
    ElIcon: Stub,
  }

  it('renders correctly', () => {
    const wrapper = mount(CrudTable, {
      props: { columns, data },
      global: { stubs: globalStubs },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('filters hidden columns', () => {
    const columnsWithHidden: CrudColumns = [
      { prop: 'id', label: 'ID' },
      { prop: 'name', label: '姓名' },
      { prop: 'secret', label: '隐藏列', hidden: true },
    ]

    const wrapper = mount(CrudTable, {
      props: { columns: columnsWithHidden, data: [] },
      global: { stubs: globalStubs },
    })

    const visibleColumns = (wrapper.vm as any).visibleColumns
    expect(visibleColumns).toHaveLength(2)
  })

  it('has correct default props', () => {
    const wrapper = mount(CrudTable, {
      props: { columns, data: [] },
      global: { stubs: globalStubs },
    })

    expect(wrapper.props('loading')).toBe(false)
    expect(wrapper.props('stripe')).toBe(true)
    expect(wrapper.props('border')).toBe(true)
    expect(wrapper.props('size')).toBe('default')
    expect(wrapper.props('keyField')).toBe('id')
    expect(wrapper.props('showIndex')).toBe(false)
    expect(wrapper.props('showActions')).toBe(true)
  })

  it('accepts custom keyField', () => {
    const wrapper = mount(CrudTable, {
      props: { columns, data: [], keyField: 'userId' },
      global: { stubs: globalStubs },
    })
    expect(wrapper.props('keyField')).toBe('userId')
  })

  it('accepts different sizes', () => {
    const wrapper = mount(CrudTable, {
      props: { columns, data: [], size: 'large' },
      global: { stubs: globalStubs },
    })
    expect(wrapper.props('size')).toBe('large')
  })
})
