import { ref, computed } from "vue";
import type { PaginationConfig } from "../types";

export function usePagination(config?: PaginationConfig) {
  const currentPage = ref(config?.currentPage || 1);
  const pageSize = ref(config?.pageSize || 10);
  const total = ref(0);

  // 计算总页数
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

  // 是否有上一页
  const hasPrev = computed(() => currentPage.value > 1);

  // 是否有下一页
  const hasNext = computed(() => currentPage.value < totalPages.value);

  // 设置当前页
  function setPage(page: number) {
    currentPage.value = page;
  }

  // 设置每页条数
  function setPageSize(size: number) {
    pageSize.value = size;
    // 重置到第一页
    currentPage.value = 1;
  }

  // 设置总条数
  function setTotal(value: number) {
    total.value = value;
  }

  // 下一页
  function nextPage() {
    if (hasNext.value) {
      currentPage.value++;
    }
  }

  // 上一页
  function prevPage() {
    if (hasPrev.value) {
      currentPage.value--;
    }
  }

  // 获取分页参数
  function getParams() {
    return {
      page: currentPage.value,
      pageSize: pageSize.value,
    };
  }

  // 重置分页
  function reset() {
    currentPage.value = 1;
  }

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    hasPrev,
    hasNext,
    setPage,
    setPageSize,
    setTotal,
    nextPage,
    prevPage,
    getParams,
    reset,
  };
}
