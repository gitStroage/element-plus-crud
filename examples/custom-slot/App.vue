<template>
  <div style="padding: 20px">
    <h1>Element Plus CRUD 自定义插槽示例</h1>
    <p>展示如何通过插槽自定义列渲染和表单字段。</p>

    <el-crud
      ref="crudRef"
      :columns="columns"
      :api="api"
      :search="searchConfig"
      :dialog="dialogConfig"
    >
      <!-- 自定义状态列 - 使用进度条 -->
      <template #column-progress="{ row }">
        <el-progress
          :percentage="row.progress"
          :status="row.progress >= 100 ? 'success' : undefined"
          :stroke-width="10"
          style="width: 120px"
        />
      </template>

      <!-- 自定义优先级列 - 使用图标 -->
      <template #column-priority="{ row }">
        <el-tag
          :type="priorityMap[row.priority]?.type"
          effect="dark"
          size="small"
        >
          {{ priorityMap[row.priority]?.label }}
        </el-tag>
      </template>

      <!-- 自定义操作列 -->
      <template #actions="{ row }">
        <el-button link type="primary" size="small">
          编辑
        </el-button>
        <el-button link type="success" size="small" :disabled="row.progress >= 100">
          完成
        </el-button>
        <el-button link type="danger" size="small">
          删除
        </el-button>
      </template>
    </el-crud>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CrudColumns, CrudApi, SearchConfig, DialogConfig } from 'element-plus-crud'

const crudRef = ref()

const priorityMap: Record<number, { label: string; type: string }> = {
  1: { label: '低', type: 'info' },
  2: { label: '中', type: 'warning' },
  3: { label: '高', type: 'danger' },
}

// 表格列配置
const columns: CrudColumns = [
  { prop: 'id', label: 'ID', width: 60 },
  { prop: 'title', label: '任务名称', minWidth: 200 },
  { prop: 'assignee', label: '负责人', width: 100 },
  { prop: 'priority', label: '优先级', width: 100 },
  { prop: 'progress', label: '进度', width: 180 },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    type: 'tag',
    tagMap: {
      todo: { label: '待办', type: 'info' },
      doing: { label: '进行中', type: 'warning' },
      done: { label: '已完成', type: 'success' },
    },
  },
  {
    prop: 'deadline',
    label: '截止日期',
    width: 120,
    type: 'datetime',
    formatter: (value: string) => value?.split('T')[0],
  },
]

// 搜索配置
const searchConfig: SearchConfig = {
  fields: [
    { prop: 'title', label: '任务名称', type: 'input' },
    { prop: 'status', label: '状态', type: 'select', options: [
      { label: '待办', value: 'todo' },
      { label: '进行中', value: 'doing' },
      { label: '已完成', value: 'done' },
    ]},
    { prop: 'priority', label: '优先级', type: 'select', options: [
      { label: '低', value: 1 },
      { label: '中', value: 2 },
      { label: '高', value: 3 },
    ]},
  ],
}

// 弹窗表单配置
const dialogConfig: DialogConfig = {
  fields: [
    { prop: 'title', label: '任务名称', type: 'input', required: true },
    { prop: 'assignee', label: '负责人', type: 'input', required: true },
    { prop: 'priority', label: '优先级', type: 'select', defaultValue: 2, options: [
      { label: '低', value: 1 },
      { label: '中', value: 2 },
      { label: '高', value: 3 },
    ]},
    { prop: 'status', label: '状态', type: 'select', defaultValue: 'todo', options: [
      { label: '待办', value: 'todo' },
      { label: '进行中', value: 'doing' },
      { label: '已完成', value: 'done' },
    ]},
    { prop: 'deadline', label: '截止日期', type: 'date-picker' },
    { prop: 'description', label: '任务描述', type: 'textarea', rows: 4 },
  ],
  width: '600px',
  createTitle: '新增任务',
  editTitle: '编辑任务',
}

// 模拟数据
let mockData = [
  { id: 1, title: '完成首页设计稿', assignee: '张三', priority: 3, progress: 80, status: 'doing', deadline: '2024-02-15T00:00:00Z', description: '' },
  { id: 2, title: '开发用户登录功能', assignee: '李四', priority: 2, progress: 100, status: 'done', deadline: '2024-02-10T00:00:00Z', description: '' },
  { id: 3, title: '编写单元测试', assignee: '王五', priority: 1, progress: 30, status: 'doing', deadline: '2024-02-20T00:00:00Z', description: '' },
  { id: 4, title: '部署生产环境', assignee: '赵六', priority: 3, progress: 0, status: 'todo', deadline: '2024-02-25T00:00:00Z', description: '' },
]

// API 配置
const api: CrudApi = {
  list: async (params) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    let data = [...mockData]
    if (params.title) data = data.filter((item) => item.title.includes(params.title))
    if (params.status) data = data.filter((item) => item.status === params.status)
    if (params.priority) data = data.filter((item) => item.priority === params.priority)
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    return { list: data.slice(start, end), total: data.length }
  },
  create: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newItem = { ...data, id: Math.max(...mockData.map((d) => d.id)) + 1, progress: 0 }
    mockData.push(newItem)
    return newItem
  },
  update: async (id, data) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = mockData.findIndex((item) => item.id === id)
    if (index !== -1) {
      mockData[index] = { ...mockData[index], ...data }
      return mockData[index]
    }
    throw new Error('Not found')
  },
  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    mockData = mockData.filter((item) => item.id !== id)
  },
}
</script>
