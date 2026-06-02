<template>
  <el-table
    ref="tableRef"
    v-loading="loading"
    :data="data"
    :height="height"
    :stripe="stripe"
    :border="border"
    :size="size"
    :row-key="keyField"
    class="el-crud__table"
    @row-click="handleRowClick"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <!-- 多选列 -->
    <el-table-column type="selection" width="50" fixed="left" />

    <!-- 序号列 -->
    <el-table-column v-if="showIndex" type="index" width="60" label="#" fixed="left" />

    <!-- 动态列 -->
    <el-table-column
      v-for="column in visibleColumns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      :min-width="column.minWidth"
      :sortable="column.sortable"
      :fixed="column.fixed"
      :align="column.align || 'left'"
      :show-overflow-tooltip="column.showOverflowTooltip !== false"
      :class-name="column.className"
    >
      <!-- 自定义表头 -->
      <template v-if="column.headerSlotName" #header="scope">
        <slot :name="column.headerSlotName" v-bind="scope" />
      </template>

      <!-- 自定义内容 -->
      <template #default="scope">
        <!-- 自定义插槽 -->
        <slot v-if="column.slotName" :name="column.slotName" v-bind="scope" />

        <!-- 根据类型渲染 -->
        <template v-else-if="column.type === 'tag'">
          <el-tag
            :type="getTagType(column, scope.row[column.prop])"
            :color="getTagColor(column, scope.row[column.prop])"
            disable-transitions
          >
            {{ formatColumnValue(scope.row, column, scope.$index) }}
          </el-tag>
        </template>

        <template v-else-if="column.type === 'image'">
          <el-image
            :src="scope.row[column.prop]"
            :style="{
              width: (column.imageConfig?.width || 40) + 'px',
              height: (column.imageConfig?.height || 40) + 'px',
            }"
            :fit="column.imageConfig?.fit || 'cover'"
            :preview-src-list="column.imageConfig?.preview !== false ? [scope.row[column.prop]] : []"
            preview-teleported
          />
        </template>

        <template v-else-if="column.type === 'link'">
          <el-link
            :href="scope.row[column.prop]"
            :target="column.linkConfig?.target || '_blank'"
            type="primary"
          >
            {{ scope.row[column.linkConfig?.textField || column.prop] || scope.row[column.prop] }}
          </el-link>
        </template>

        <template v-else-if="column.type === 'datetime'">
          {{ formatColumnValue(scope.row, column, scope.$index) }}
        </template>

        <template v-else>
          {{ formatColumnValue(scope.row, column, scope.$index) }}
        </template>
      </template>
    </el-table-column>

    <!-- 操作列 -->
    <el-table-column v-if="showActions" label="操作" :width="actionsWidth" fixed="right" align="center">
      <template #default="scope">
        <slot name="actions" v-bind="scope">
          <el-button type="primary" link size="small" @click.stop="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" link size="small" @click.stop="handleDelete(scope.row)">
            删除
          </el-button>
        </slot>
      </template>
    </el-table-column>

    <!-- 空数据插槽 -->
    <template #empty>
      <slot name="empty">
        <el-empty description="暂无数据" />
      </slot>
    </template>
  </el-table>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CrudColumns } from '../types'
import { formatColumnValue, getTagType, getTagColor } from '../utils'

defineOptions({
  name: 'CrudTable',
})

interface Props {
  columns: CrudColumns
  data: any[]
  loading?: boolean
  height?: number | string
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  keyField?: string
  showIndex?: boolean
  showActions?: boolean
  actionsWidth?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  stripe: true,
  border: true,
  size: 'default',
  keyField: 'id',
  showIndex: false,
  showActions: true,
  actionsWidth: 150,
})

const emit = defineEmits<{
  'row-click': [row: any, column: any, event: Event]
  'selection-change': [rows: any[]]
  'sort-change': [params: { prop: string; order: string }]
  edit: [row: any]
  delete: [row: any]
}>()

// 过滤隐藏的列
const visibleColumns = computed(() => {
  return props.columns.filter((col) => !col.hidden)
})

// 行点击
function handleRowClick(row: any, column: any, event: Event) {
  emit('row-click', row, column, event)
}

// 选择变化
function handleSelectionChange(rows: any[]) {
  emit('selection-change', rows)
}

// 排序变化
function handleSortChange({ prop, order }: { prop: string; order: string | null }) {
  emit('sort-change', { prop, order: order || '' })
}

// 编辑
function handleEdit(row: any) {
  emit('edit', row)
}

// 删除
function handleDelete(row: any) {
  emit('delete', row)
}
</script>
