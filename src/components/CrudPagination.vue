<template>
  <div v-if="total > 0" class="el-crud__pagination">
    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      :background="background"
      :pager-count="pagerCount"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'CrudPagination',
})

interface Props {
  total: number
  page: number
  pageSize: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
  pagerCount?: number
}

withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
  pagerCount: 7,
})

const emit = defineEmits<{
  'page-change': [page: number]
  'size-change': [size: number]
}>()

function handlePageChange(page: number) {
  emit('page-change', page)
}

function handleSizeChange(size: number) {
  emit('size-change', size)
}
</script>
