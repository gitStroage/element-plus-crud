<template>
  <div style="padding: 20px">
    <h1>Element Plus CRUD 高级示例</h1>
    <p>展示自定义渲染、格式化函数、列固定等高级功能。</p>

    <el-crud
      ref="crudRef"
      :columns="columns"
      :api="api"
      :search="searchConfig"
      :dialog="dialogConfig"
      :toolbar="toolbarConfig"
      :pagination="{ pageSize: 5, pageSizes: [5, 10, 20] }"
    >
      <!-- 自定义头像列 -->
      <template #column-avatar="{ row }">
        <el-avatar :src="row.avatar" size="small">
          {{ row.name?.charAt(0) }}
        </el-avatar>
      </template>

      <!-- 自定义操作列 -->
      <template #column-actions="{ row }">
        <el-button link type="primary" size="small" @click="handleView(row)">
          查看
        </el-button>
        <el-button link type="warning" size="small" @click="handleLog(row)">
          日志
        </el-button>
      </template>
    </el-crud>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { CrudColumns, CrudApi, SearchConfig, DialogConfig, ToolbarConfig } from 'element-plus-crud'

const crudRef = ref()

// 表格列配置 - 高级用法
const columns: CrudColumns = [
  { prop: 'id', label: 'ID', width: 60, fixed: 'left', sortable: true },
  { prop: 'avatar', label: '头像', width: 80 },
  { prop: 'name', label: '姓名', width: 100, fixed: 'left' },
  { prop: 'email', label: '邮箱', minWidth: 200 },
  { prop: 'department', label: '部门', width: 120 },
  { prop: 'role', label: '角色', width: 100 },
  {
    prop: 'salary',
    label: '薪资',
    width: 120,
    type: 'number',
    formatter: (value: number) => `¥${value.toLocaleString()}`,
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    type: 'tag',
    tagMap: {
      active: { label: '在职', type: 'success' },
      leave: { label: '休假', type: 'warning' },
      resigned: { label: '离职', type: 'danger' },
    },
  },
  {
    prop: 'joinDate',
    label: '入职日期',
    width: 120,
    type: 'datetime',
    formatter: (value: string) => value?.split('T')[0],
  },
  { prop: 'actions', label: '操作', width: 150, fixed: 'right' },
]

// 搜索配置
const searchConfig: SearchConfig = {
  fields: [
    { prop: 'name', label: '姓名', type: 'input' },
    { prop: 'department', label: '部门', type: 'select', options: [
      { label: '技术部', value: '技术部' },
      { label: '产品部', value: '产品部' },
      { label: '设计部', value: '设计部' },
      { label: '市场部', value: '市场部' },
    ]},
    { prop: 'status', label: '状态', type: 'select', options: [
      { label: '在职', value: 'active' },
      { label: '休假', value: 'leave' },
      { label: '离职', value: 'resigned' },
    ]},
    { prop: 'joinDate', label: '入职日期', type: 'date-range-picker' },
  ],
  showMore: true,
  moreCount: 2,
}

// 弹窗表单配置
const dialogConfig: DialogConfig = {
  fields: [
    { prop: 'name', label: '姓名', type: 'input', required: true },
    { prop: 'email', label: '邮箱', type: 'input', required: true },
    { prop: 'department', label: '部门', type: 'select', required: true, options: [
      { label: '技术部', value: '技术部' },
      { label: '产品部', value: '产品部' },
      { label: '设计部', value: '设计部' },
      { label: '市场部', value: '市场部' },
    ]},
    { prop: 'role', label: '角色', type: 'input' },
    { prop: 'salary', label: '薪资', type: 'input' },
    { prop: 'status', label: '状态', type: 'select', defaultValue: 'active', options: [
      { label: '在职', value: 'active' },
      { label: '休假', value: 'leave' },
      { label: '离职', value: 'resigned' },
    ]},
    { prop: 'joinDate', label: '入职日期', type: 'date-picker' },
    { prop: 'remark', label: '备注', type: 'textarea', rows: 3 },
  ],
  width: '700px',
  createTitle: '新增员工',
  editTitle: '编辑员工',
  viewTitle: '员工详情',
}

// 工具栏配置
const toolbarConfig: ToolbarConfig = {
  showCreate: true,
  showBatchDelete: true,
  showRefresh: true,
}

// 模拟数据
let mockData = [
  { id: 1, avatar: '', name: '张三', email: 'zhangsan@example.com', department: '技术部', role: '前端工程师', salary: 15000, status: 'active', joinDate: '2023-01-15T00:00:00Z', remark: '' },
  { id: 2, avatar: '', name: '李四', email: 'lisi@example.com', department: '技术部', role: '后端工程师', salary: 18000, status: 'active', joinDate: '2022-06-01T00:00:00Z', remark: '' },
  { id: 3, avatar: '', name: '王五', email: 'wangwu@example.com', department: '产品部', role: '产品经理', salary: 20000, status: 'leave', joinDate: '2021-03-10T00:00:00Z', remark: '年假中' },
  { id: 4, avatar: '', name: '赵六', email: 'zhaoliu@example.com', department: '设计部', role: 'UI设计师', salary: 14000, status: 'active', joinDate: '2023-08-20T00:00:00Z', remark: '' },
  { id: 5, avatar: '', name: '钱七', email: 'qianqi@example.com', department: '市场部', role: '市场专员', salary: 12000, status: 'resigned', joinDate: '2020-11-05T00:00:00Z', remark: '已离职' },
]

// API 配置
const api: CrudApi = {
  list: async (params) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    let data = [...mockData]
    if (params.name) data = data.filter((item) => item.name.includes(params.name))
    if (params.department) data = data.filter((item) => item.department === params.department)
    if (params.status) data = data.filter((item) => item.status === params.status)
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    return { list: data.slice(start, end), total: data.length }
  },
  create: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newItem = { ...data, id: Math.max(...mockData.map((d) => d.id)) + 1 }
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
  batchDelete: async (ids) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    mockData = mockData.filter((item) => !ids.includes(item.id))
  },
}

function handleView(row: any) {
  crudRef.value?.openEditDialog(row)
}

function handleLog(row: any) {
  ElMessage.info(`查看 ${row.name} 的操作日志`)
}
</script>
