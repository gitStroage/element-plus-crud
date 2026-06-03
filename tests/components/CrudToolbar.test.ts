import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import CrudToolbar from '../../src/components/CrudToolbar.vue'
import type { ToolbarConfig } from '../../src/types'

describe('CrudToolbar', () => {
  const config: ToolbarConfig = {
    showCreate: true,
    showBatchDelete: true,
    showRefresh: true,
    showDensity: true,
    showColumnSetting: true,
    createText: '新增',
    batchDeleteText: '批量删除',
  }

  it('renders correctly', () => {
    const wrapper = shallowMount(CrudToolbar, {
      props: { config },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct default props', () => {
    const wrapper = shallowMount(CrudToolbar, {
      props: { config },
    })
    expect(wrapper.props('selectedCount')).toBe(0)
  })

  it('accepts selectedCount prop', () => {
    const wrapper = shallowMount(CrudToolbar, {
      props: { config, selectedCount: 5 },
    })
    expect(wrapper.props('selectedCount')).toBe(5)
  })

  it('emits create event', async () => {
    const wrapper = shallowMount(CrudToolbar, {
      props: { config },
    })
    await wrapper.vm.$emit('create')
    expect(wrapper.emitted('create')).toBeTruthy()
  })

  it('emits batch-delete event', async () => {
    const wrapper = shallowMount(CrudToolbar, {
      props: { config },
    })
    await wrapper.vm.$emit('batch-delete')
    expect(wrapper.emitted('batch-delete')).toBeTruthy()
  })

  it('emits refresh event', async () => {
    const wrapper = shallowMount(CrudToolbar, {
      props: { config },
    })
    await wrapper.vm.$emit('refresh')
    expect(wrapper.emitted('refresh')).toBeTruthy()
  })

  it('emits density-change event', async () => {
    const wrapper = shallowMount(CrudToolbar, {
      props: { config },
    })
    await wrapper.vm.$emit('density-change', 'small')
    expect(wrapper.emitted('density-change')).toBeTruthy()
    expect(wrapper.emitted('density-change')![0]).toEqual(['small'])
  })

  it('handles hidden buttons', () => {
    const hiddenConfig: ToolbarConfig = {
      showCreate: false,
      showBatchDelete: false,
      showRefresh: false,
      showDensity: false,
      showColumnSetting: false,
    }

    const wrapper = shallowMount(CrudToolbar, {
      props: { config: hiddenConfig },
    })

    expect(wrapper.vm.config.showCreate).toBe(false)
    expect(wrapper.vm.config.showBatchDelete).toBe(false)
    expect(wrapper.vm.config.showRefresh).toBe(false)
    expect(wrapper.vm.config.showDensity).toBe(false)
    expect(wrapper.vm.config.showColumnSetting).toBe(false)
  })

  it('uses custom button text', () => {
    const customConfig: ToolbarConfig = {
      createText: '新建',
      batchDeleteText: '删除选中',
    }

    const wrapper = shallowMount(CrudToolbar, {
      props: { config: customConfig },
    })

    expect(wrapper.vm.config.createText).toBe('新建')
    expect(wrapper.vm.config.batchDeleteText).toBe('删除选中')
  })
})
