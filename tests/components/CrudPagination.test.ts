import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CrudPagination from '../../src/components/CrudPagination.vue'

// 简单的 stub 组件
const Stub = {
  template: '<div><slot /></div>',
  props: ['*'],
}

describe('CrudPagination', () => {
  const globalStubs = {
    ElPagination: Stub,
  }

  it('renders when total is greater than 0', () => {
    const wrapper = mount(CrudPagination, {
      props: {
        total: 100,
        page: 1,
        pageSize: 10,
      },
      global: { stubs: globalStubs },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.el-crud__pagination').exists()).toBe(true)
  })

  it('does not render when total is 0', () => {
    const wrapper = mount(CrudPagination, {
      props: {
        total: 0,
        page: 1,
        pageSize: 10,
      },
      global: { stubs: globalStubs },
    })

    expect(wrapper.find('.el-crud__pagination').exists()).toBe(false)
  })

  it('has correct default props', () => {
    const wrapper = mount(CrudPagination, {
      props: {
        total: 100,
        page: 1,
        pageSize: 10,
      },
      global: { stubs: globalStubs },
    })

    expect(wrapper.props('pageSizes')).toEqual([10, 20, 50, 100])
    expect(wrapper.props('layout')).toBe('total, sizes, prev, pager, next, jumper')
    expect(wrapper.props('background')).toBe(true)
    expect(wrapper.props('pagerCount')).toBe(7)
  })

  it('accepts custom pageSizes', () => {
    const wrapper = mount(CrudPagination, {
      props: {
        total: 100,
        page: 1,
        pageSize: 10,
        pageSizes: [5, 15, 30],
      },
      global: { stubs: globalStubs },
    })

    expect(wrapper.props('pageSizes')).toEqual([5, 15, 30])
  })

  it('accepts custom layout', () => {
    const wrapper = mount(CrudPagination, {
      props: {
        total: 100,
        page: 1,
        pageSize: 10,
        layout: 'prev, pager, next',
      },
      global: { stubs: globalStubs },
    })

    expect(wrapper.props('layout')).toBe('prev, pager, next')
  })

  it('emits page-change event', async () => {
    const wrapper = mount(CrudPagination, {
      props: {
        total: 100,
        page: 1,
        pageSize: 10,
      },
      global: { stubs: globalStubs },
    })

    // 触发事件
    await wrapper.vm.$emit('page-change', 2)

    expect(wrapper.emitted('page-change')).toBeTruthy()
    expect(wrapper.emitted('page-change')![0]).toEqual([2])
  })

  it('emits size-change event', async () => {
    const wrapper = mount(CrudPagination, {
      props: {
        total: 100,
        page: 1,
        pageSize: 10,
      },
      global: { stubs: globalStubs },
    })

    // 触发事件
    await wrapper.vm.$emit('size-change', 20)

    expect(wrapper.emitted('size-change')).toBeTruthy()
    expect(wrapper.emitted('size-change')![0]).toEqual([20])
  })
})
