import { ref, computed } from "vue";
import type { CrudColumns } from "../types";

export function useTable(columns: CrudColumns) {
  const tableData = ref<any[]>([]);
  const loading = ref(false);
  const selectedRows = ref<any[]>([]);
  const sortParams = ref<Record<string, any>>({});

  // 过滤隐藏的列
  const visibleColumns = computed(() => {
    return columns.filter((col) => !col.hidden);
  });

  // 设置表格数据
  function setData(data: any[]) {
    tableData.value = data;
  }

  // 设置加载状态
  function setLoading(value: boolean) {
    loading.value = value;
  }

  // 设置选中行
  function setSelection(rows: any[]) {
    selectedRows.value = rows;
  }

  // 清空选中
  function clearSelection() {
    selectedRows.value = [];
  }

  // 设置排序参数
  function setSort(prop: string, order: string) {
    if (prop) {
      sortParams.value = {
        orderBy: prop,
        order: order === "ascending" ? "asc" : "desc",
      };
    } else {
      sortParams.value = {};
    }
  }

  // 获取排序参数
  function getSortParams() {
    return { ...sortParams.value };
  }

  return {
    tableData,
    loading,
    selectedRows,
    visibleColumns,
    setData,
    setLoading,
    setSelection,
    clearSelection,
    setSort,
    getSortParams,
  };
}
