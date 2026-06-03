import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import CrudTable from '../../src/components/CrudTable.vue'
import type { CrudColumns } from '../../src/types'

function mountCrudTable(props: Record<string, any> = {}) {
  const defaultColumns: CrudColumns = [
    { prop: 'id', label: 'ID', width: 80 },
    { prop: 'name', label: '姓名' },
    { prop: 'email', label: '邮箱' },
  ]

  return mount(CrudTable, {
    props: {
      columns: props.columns ?? defaultColumns,
      data: props.data ?? [],
      ...props,
    },
    global: {
      plugins: [ElementPlus],
    },
  })
}

describe('CrudTable', () => {
  it('renders correctly', () => {
    const wrapper = mountCrudTable()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.el-crud__table').exists()).toBe(true)
  })

  it('filters hidden columns', () => {
    const columnsWithHidden: CrudColumns = [
      { prop: 'id', label: 'ID' },
      { prop: 'name', label: '姓名' },
      { prop: 'secret', label: '隐藏列', hidden: true },
    ]

    const wrapper = mountCrudTable({ columns: columnsWithHidden, data: [] })

    const visibleColumns = (wrapper.vm as any).visibleColumns
    expect(visibleColumns).toHaveLength(2)
  })

  it('has correct default props', () => {
    const wrapper = mountCrudTable()

    expect(wrapper.props('loading')).toBe(false)
    expect(wrapper.props('stripe')).toBe(true)
    expect(wrapper.props('border')).toBe(true)
    expect(wrapper.props('size')).toBe('default')
    expect(wrapper.props('keyField')).toBe('id')
    expect(wrapper.props('showIndex')).toBe(false)
    expect(wrapper.props('showActions')).toBe(true)
  })

  it('accepts custom keyField', () => {
    const wrapper = mountCrudTable({ keyField: 'userId' })
    expect(wrapper.props('keyField')).toBe('userId')
  })

  it('accepts different sizes', () => {
    const wrapper = mountCrudTable({ size: 'large' })
    expect(wrapper.props('size')).toBe('large')
  })

  it('renders data rows', () => {
    const data = [
      { id: 1, name: '张三', email: 'zhangsan@example.com' },
      { id: 2, name: '李四', email: 'lisi@example.com' },
    ]
    const wrapper = mountCrudTable({ data })
    const rows = wrapper.findAll('.el-table__row')
    expect(rows.length).toBeGreaterThanOrEqual(2)
  })
})
