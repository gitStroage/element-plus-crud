import { describe, it, expect } from 'vitest'
import { useDialog } from '../../src/composables/useDialog'

describe('useDialog', () => {
  it('initializes with closed state', () => {
    const { visible, mode, data, loading } = useDialog()

    expect(visible.value).toBe(false)
    expect(mode.value).toBe('create')
    expect(data.value).toEqual({})
    expect(loading.value).toBe(false)
  })

  it('opens in create mode', () => {
    const { visible, mode, data, open } = useDialog()

    open('create', { name: '测试' })

    expect(visible.value).toBe(true)
    expect(mode.value).toBe('create')
    expect(data.value).toEqual({ name: '测试' })
  })

  it('opens in edit mode', () => {
    const { visible, mode, open } = useDialog()
    const rowData = { id: 1, name: '张三' }

    open('edit', rowData)

    expect(visible.value).toBe(true)
    expect(mode.value).toBe('edit')
  })

  it('opens in view mode', () => {
    const { visible, mode, open } = useDialog()

    open('view')

    expect(visible.value).toBe(true)
    expect(mode.value).toBe('view')
  })

  it('closes dialog', () => {
    const { visible, data, loading, open, close } = useDialog()

    open('create', { name: '测试' })
    close()

    expect(visible.value).toBe(false)
    expect(data.value).toEqual({})
    expect(loading.value).toBe(false)
  })

  it('computes mode flags correctly', () => {
    const { isCreate, isEdit, isView, open } = useDialog()

    open('create')
    expect(isCreate.value).toBe(true)
    expect(isEdit.value).toBe(false)
    expect(isView.value).toBe(false)

    open('edit')
    expect(isCreate.value).toBe(false)
    expect(isEdit.value).toBe(true)
    expect(isView.value).toBe(false)

    open('view')
    expect(isCreate.value).toBe(false)
    expect(isEdit.value).toBe(false)
    expect(isView.value).toBe(true)
  })

  it('sets loading state', () => {
    const { loading, setLoading } = useDialog()

    setLoading(true)
    expect(loading.value).toBe(true)

    setLoading(false)
    expect(loading.value).toBe(false)
  })

  it('sets data', () => {
    const { data, setData } = useDialog()

    setData({ id: 1, name: '测试' })
    expect(data.value).toEqual({ id: 1, name: '测试' })
  })
})
