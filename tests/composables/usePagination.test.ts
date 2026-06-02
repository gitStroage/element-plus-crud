import { describe, it, expect } from 'vitest'
import { usePagination } from '../../src/composables/usePagination'

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { currentPage, pageSize, total } = usePagination()

    expect(currentPage.value).toBe(1)
    expect(pageSize.value).toBe(10)
    expect(total.value).toBe(0)
  })

  it('accepts custom config', () => {
    const { currentPage, pageSize } = usePagination({
      currentPage: 2,
      pageSize: 20,
    })

    expect(currentPage.value).toBe(2)
    expect(pageSize.value).toBe(20)
  })

  it('computes total pages', () => {
    const { totalPages, setTotal, setPageSize } = usePagination()

    setPageSize(10)
    setTotal(50)
    expect(totalPages.value).toBe(5)

    setTotal(55)
    expect(totalPages.value).toBe(6)
  })

  it('computes hasPrev and hasNext', () => {
    const { hasPrev, hasNext, setPage, setTotal, setPageSize } = usePagination()

    setPageSize(10)
    setTotal(30)

    setPage(1)
    expect(hasPrev.value).toBe(false)
    expect(hasNext.value).toBe(true)

    setPage(2)
    expect(hasPrev.value).toBe(true)
    expect(hasNext.value).toBe(true)

    setPage(3)
    expect(hasPrev.value).toBe(true)
    expect(hasNext.value).toBe(false)
  })

  it('navigates pages', () => {
    const { currentPage, nextPage, prevPage, setTotal, setPageSize } = usePagination()

    setPageSize(10)
    setTotal(30)

    nextPage()
    expect(currentPage.value).toBe(2)

    nextPage()
    expect(currentPage.value).toBe(3)

    // 已经是最后一页
    nextPage()
    expect(currentPage.value).toBe(3)

    prevPage()
    expect(currentPage.value).toBe(2)

    prevPage()
    expect(currentPage.value).toBe(1)

    // 已经是第一页
    prevPage()
    expect(currentPage.value).toBe(1)
  })

  it('resets to first page on size change', () => {
    const { currentPage, setPageSize, setPage } = usePagination()

    setPage(3)
    setPageSize(20)

    expect(currentPage.value).toBe(1)
  })

  it('gets pagination params', () => {
    const { getParams, setPage, setPageSize } = usePagination()

    setPageSize(20)
    setPage(2)

    expect(getParams()).toEqual({ page: 2, pageSize: 20 })
  })

  it('resets pagination', () => {
    const { currentPage, reset, setPage } = usePagination()

    setPage(5)
    reset()

    expect(currentPage.value).toBe(1)
  })
})
