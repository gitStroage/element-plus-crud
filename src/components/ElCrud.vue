<template>
  <div class="el-crud">
    <!-- 搜索区域 -->
    <CrudSearch
      v-if="searchConfig"
      :config="searchConfig"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 工具栏 -->
    <CrudToolbar
      :config="toolbarConfig"
      :selected-count="selectedRows.length"
      @create="handleCreate"
      @batch-delete="handleBatchDelete"
      @refresh="handleRefresh"
    />

    <!-- 表格 -->
    <CrudTable
      ref="tableRef"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :height="height"
      :stripe="stripe"
      :border="border"
      :size="size"
      :key-field="keyField"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- 透传插槽 -->
      <template
        v-for="(_, name) in $slots"
        #[name]="slotData"
      >
        <slot
          :name="name"
          v-bind="slotData"
        />
      </template>
    </CrudTable>

    <!-- 分页 -->
    <CrudPagination
      :total="total"
      :page="currentPage"
      :page-size="currentPageSize"
      :page-sizes="paginationConfig.pageSizes"
      :layout="paginationConfig.layout"
      :background="paginationConfig.background"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <!-- 弹窗表单 -->
    <CrudDialog
      v-if="dialogConfig"
      ref="dialogRef"
      :config="dialogConfig"
      :mode="dialogMode"
      :data="dialogData"
      :loading="dialogLoading"
      @submit="handleDialogSubmit"
      @close="handleDialogClose"
    >
      <!-- 透传表单插槽 -->
      <template
        v-for="(_, name) in $slots"
        #[name]="slotData"
      >
        <slot
          :name="name"
          v-bind="slotData"
        />
      </template>
    </CrudDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import CrudTable from "./CrudTable.vue";
import CrudSearch from "./CrudSearch.vue";
import CrudDialog from "./CrudDialog.vue";
import CrudPagination from "./CrudPagination.vue";
import CrudToolbar from "./CrudToolbar.vue";
import type {
  CrudProps,
  CrudEmits,
  CrudExposed,
  PaginationConfig,
  ToolbarConfig,
  DialogMode,
} from "../types";

defineOptions({
  name: "ElCrud",
});

const props = withDefaults(defineProps<CrudProps>(), {
  keyField: "id",
  immediate: true,
  stripe: true,
  border: true,
  size: "default",
});

const emit = defineEmits<CrudEmits>();

// 表格数据
const tableRef = ref<InstanceType<typeof CrudTable>>();
const tableData = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const currentPageSize = ref(10);
const selectedRows = ref<any[]>([]);
const sortParams = ref<Record<string, any>>({});
const searchParams = ref<Record<string, any>>({});

// 弹窗数据
const dialogRef = ref<InstanceType<typeof CrudDialog>>();
const dialogMode = ref<DialogMode>("create");
const dialogData = ref<Record<string, any>>({});
const dialogLoading = ref(false);

// 配置计算
const searchConfig = computed(() => props.search);
const dialogConfig = computed(() => props.dialog);

const paginationConfig = computed<PaginationConfig>(() => ({
  pageSizes: [10, 20, 50, 100],
  pageSize: 10,
  currentPage: 1,
  layout: "total, sizes, prev, pager, next, jumper",
  background: true,
  ...props.pagination,
}));

const toolbarConfig = computed<ToolbarConfig>(() => ({
  showCreate: true,
  showBatchDelete: true,
  showRefresh: true,
  showDensity: true,
  showColumnSetting: true,
  createText: "新增",
  batchDeleteText: "批量删除",
  ...props.toolbar,
}));

// 初始化分页
onMounted(() => {
  currentPageSize.value = paginationConfig.value.pageSize || 10;
  if (props.immediate) {
    fetchList();
  }
});

// 获取列表数据
async function fetchList() {
  if (!props.api.list) return;

  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      pageSize: currentPageSize.value,
      ...searchParams.value,
      ...sortParams.value,
    };

    const result = await props.api.list(params);
    tableData.value = result.list || [];
    total.value = result.total || 0;
  } catch (error) {
    console.error("Failed to fetch list:", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
}

// 搜索
function handleSearch(params?: Record<string, any>) {
  if (params) {
    searchParams.value = params;
  }
  currentPage.value = 1;
  emit("search", searchParams.value);
  fetchList();
}

// 重置搜索
function handleReset() {
  searchParams.value = {};
  currentPage.value = 1;
  emit("reset");
  fetchList();
}

// 新增
function handleCreate() {
  dialogMode.value = "create";
  dialogData.value = {};
  dialogRef.value?.open();
}

// 批量删除
async function handleBatchDelete() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条数据吗？`,
      "提示",
      { type: "warning" },
    );

    const ids = selectedRows.value.map((row) => row[props.keyField]);

    if (props.api.batchDelete) {
      await props.api.batchDelete(ids);
    } else if (props.api.delete) {
      await Promise.all(ids.map((id) => props.api.delete!(id)));
    }

    ElMessage.success("删除成功");
    emit("batch-delete", ids);
    fetchList();
  } catch {
    // 取消操作
  }
}

// 刷新
function handleRefresh() {
  fetchList();
}

// 行点击
function handleRowClick(row: any, column: any, event: Event) {
  emit("row-click", row, column, event);
}

// 选择变化
function handleSelectionChange(rows: any[]) {
  selectedRows.value = rows;
  emit("selection-change", rows);
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
  currentPage.value = page;
  emit("page-change", page);
  fetchList();
}

// 每页条数变化
function handleSizeChange(size: number) {
  currentPageSize.value = size;
  currentPage.value = 1;
  emit("size-change", size);
  fetchList();
}

// 弹窗提交
async function handleDialogSubmit(data: Record<string, any>) {
  dialogLoading.value = true;
  try {
    if (dialogMode.value === "create" && props.api.create) {
      await props.api.create(data);
      ElMessage.success("新增成功");
      emit("create", data);
    } else if (dialogMode.value === "edit" && props.api.update) {
      const id = dialogData.value[props.keyField];
      await props.api.update(id, data);
      ElMessage.success("更新成功");
      emit("update", id, data);
    }

    dialogRef.value?.close();
    fetchList();
  } catch (error) {
    console.error("Submit failed:", error);
    ElMessage.error("操作失败");
  } finally {
    dialogLoading.value = false;
  }
}

// 弹窗关闭
function handleDialogClose() {
  dialogData.value = {};
}

// 暴露方法
defineExpose<CrudExposed>({
  refresh: fetchList,
  search: handleSearch,
  resetSearch: handleReset,
  getSelectionRows: () => selectedRows.value,
  openCreateDialog: (defaultData = {}) => {
    dialogMode.value = "create";
    dialogData.value = defaultData;
    dialogRef.value?.open();
  },
  openEditDialog: (row: any) => {
    dialogMode.value = "edit";
    dialogData.value = { ...row };
    dialogRef.value?.open();
  },
  closeDialog: () => {
    dialogRef.value?.close();
  },
  getTableData: () => tableData.value,
  setTableData: (data: any[]) => {
    tableData.value = data;
  },
  pageSize: currentPageSize,
});
</script>
