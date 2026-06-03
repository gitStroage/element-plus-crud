import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useTable } from "./useTable";
import { useSearch } from "./useSearch";
import { useDialog } from "./useDialog";
import { usePagination } from "./usePagination";
import type {
  CrudApi,
  CrudColumns,
  SearchConfig,
  DialogConfig,
  PaginationConfig,
  ToolbarConfig,
} from "../types";

export interface UseCrudOptions {
  /** 表格列配置 */
  columns: CrudColumns;
  /** API 接口配置 */
  api: CrudApi;
  /** 搜索配置 */
  search?: SearchConfig;
  /** 弹窗表单配置 */
  dialog?: DialogConfig;
  /** 分页配置 */
  pagination?: PaginationConfig;
  /** 工具栏配置 */
  toolbar?: ToolbarConfig;
  /** 主键字段名 */
  keyField?: string;
  /** 是否立即加载数据 */
  immediate?: boolean;
}

export function useCrud(options: UseCrudOptions) {
  const {
    columns,
    api,
    search: searchConfig,
    pagination: paginationConfig,
    keyField = "id",
    immediate = true,
  } = options;

  // 初始化各个模块
  const table = useTable(columns);
  const search = useSearch(searchConfig);
  const dialog = useDialog();
  const pagination = usePagination(paginationConfig);

  // 排序参数
  const sortParams = ref<Record<string, any>>({});

  // 获取列表数据
  async function fetchList() {
    if (!api.list) return;

    table.setLoading(true);
    try {
      const params = {
        ...pagination.getParams(),
        ...search.getParams(),
        ...sortParams.value,
      };

      const result = await api.list(params);
      table.setData(result.list || []);
      pagination.setTotal(result.total || 0);
    } catch (error) {
      console.error("Failed to fetch list:", error);
      ElMessage.error("获取数据失败");
    } finally {
      table.setLoading(false);
    }
  }

  // 搜索
  function handleSearch(params?: Record<string, any>) {
    if (params) {
      search.setParams(params);
    }
    pagination.reset();
    fetchList();
  }

  // 重置搜索
  function handleResetSearch() {
    search.resetParams();
    pagination.reset();
    fetchList();
  }

  // 排序变化
  function handleSortChange({ prop, order }: { prop: string; order: string }) {
    if (prop) {
      sortParams.value = {
        orderBy: prop,
        order: order === "ascending" ? "asc" : "desc",
      };
    } else {
      sortParams.value = {};
    }
    fetchList();
  }

  // 分页变化
  function handlePageChange(page: number) {
    pagination.setPage(page);
    fetchList();
  }

  // 每页条数变化
  function handleSizeChange(size: number) {
    pagination.setPageSize(size);
    fetchList();
  }

  // 打开新增弹窗
  function openCreateDialog(defaultData: Record<string, any> = {}) {
    dialog.open("create", defaultData);
  }

  // 打开编辑弹窗
  function openEditDialog(row: Record<string, any>) {
    dialog.open("edit", { ...row });
  }

  // 打开查看弹窗
  function openViewDialog(row: Record<string, any>) {
    dialog.open("view", { ...row });
  }

  // 关闭弹窗
  function closeDialog() {
    dialog.close();
  }

  // 提交表单
  async function handleSubmit(data: Record<string, any>) {
    dialog.setLoading(true);
    try {
      if (dialog.mode.value === "create" && api.create) {
        await api.create(data);
        ElMessage.success("新增成功");
      } else if (dialog.mode.value === "edit" && api.update) {
        const id = dialog.data.value[keyField];
        await api.update(id, data);
        ElMessage.success("更新成功");
      }

      dialog.close();
      fetchList();
    } catch (error) {
      console.error("Submit failed:", error);
      ElMessage.error("操作失败");
    } finally {
      dialog.setLoading(false);
    }
  }

  // 删除
  async function handleDelete(row: Record<string, any>) {
    try {
      await ElMessageBox.confirm("确定要删除这条数据吗？", "提示", {
        type: "warning",
      });

      if (api.delete) {
        const id = row[keyField];
        await api.delete(id);
        ElMessage.success("删除成功");
        fetchList();
      }
    } catch {
      // 取消操作
    }
  }

  // 批量删除
  async function handleBatchDelete() {
    const selectedRows = table.selectedRows.value;
    if (selectedRows.length === 0) {
      ElMessage.warning("请选择要删除的数据");
      return;
    }

    try {
      await ElMessageBox.confirm(
        `确定要删除选中的 ${selectedRows.length} 条数据吗？`,
        "提示",
        { type: "warning" },
      );

      const ids = selectedRows.map((row) => row[keyField]);

      if (api.batchDelete) {
        await api.batchDelete(ids);
      } else if (api.delete) {
        await Promise.all(ids.map((id) => api.delete!(id)));
      }

      ElMessage.success("删除成功");
      table.clearSelection();
      fetchList();
    } catch {
      // 取消操作
    }
  }

  // 刷新
  function handleRefresh() {
    fetchList();
  }

  // 初始化
  onMounted(() => {
    if (immediate) {
      fetchList();
    }
  });

  return {
    // 表格相关
    tableData: table.tableData,
    loading: table.loading,
    selectedRows: table.selectedRows,
    visibleColumns: table.visibleColumns,

    // 搜索相关
    searchParams: search.searchParams,
    showSearchMore: search.showMore,

    // 弹窗相关
    dialogVisible: dialog.visible,
    dialogMode: dialog.mode,
    dialogData: dialog.data,
    dialogLoading: dialog.loading,
    isCreateMode: dialog.isCreate,
    isEditMode: dialog.isEdit,
    isViewMode: dialog.isView,

    // 分页相关
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    total: pagination.total,

    // 方法
    fetchList,
    handleSearch,
    handleResetSearch,
    handleSortChange,
    handlePageChange,
    handleSizeChange,
    openCreateDialog,
    openEditDialog,
    openViewDialog,
    closeDialog,
    handleSubmit,
    handleDelete,
    handleBatchDelete,
    handleRefresh,

    // 工具方法
    getTableData: () => table.tableData.value,
    getSelectionRows: () => table.selectedRows.value,
    clearSelection: () => table.clearSelection(),
  };
}
