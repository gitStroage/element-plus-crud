<template>
  <div style="padding: 20px">
    <h1>Element Plus CRUD Playground</h1>
    <p>这是一个在线演示，展示 element-plus-crud 的功能。</p>

    <el-crud
      ref="crudRef"
      :columns="columns"
      :api="api"
      :search="searchConfig"
      :dialog="dialogConfig"
      :toolbar="toolbarConfig"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElCrud } from 'element-plus-crud'
import type { CrudColumns, CrudApi, SearchConfig, DialogConfig, ToolbarConfig } from 'element-plus-crud'

const crudRef = ref()

// 表格列配置
const columns: CrudColumns = [
  { prop: 'id', label: 'ID', width: 80, sortable: true },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'email', label: '邮箱', minWidth: 200 },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    type: 'tag',
    tagMap: {
      1: { label: '启用', type: 'success' },
      0: { label: '禁用', type: 'danger' },
    },
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    type: 'datetime',
  },
]

// 搜索配置
const searchConfig: SearchConfig = {
  fields: [
    { prop: 'name', label: '姓名', type: 'input' },
    { prop: 'status', label: '状态', type: 'select', options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ]},
  ],
}

// 弹窗表单配置
const dialogConfig: DialogConfig = {
  fields: [
    { prop: 'name', label: '姓名', type: 'input', required: true },
    { prop: 'email', label: '邮箱', type: 'input', required: true },
    { prop: 'status', label: '状态', type: 'select', defaultValue: 1, options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ]},
  ],
  width: '500px',
}

// 工具栏配置
const toolbarConfig: ToolbarConfig = {
  showCreate: true,
  showBatchDelete: true,
  showRefresh: true,
}

// 模拟数据
let mockData = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', status: 1, createTime: '2024-01-01T00:00:00Z' },
  { id: 2, name: '李四', email: 'lisi@example.com', status: 1, createTime: '2024-01-02T00:00:00Z' },
  { id: 3, name: '王五', email: 'wangwu@example.com', status: 0, createTime: '2024-01-03T00:00:00Z' },
]

// API 配置
const api: CrudApi = {
  list: async (params) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    let data = [...mockData]
    if (params.name) {
      data = data.filter((item) => item.name.includes(params.name))
    }
    if (params.status !== undefined) {
      data = data.filter((item) => item.status === params.status)
    }
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    return { list: data.slice(start, end), total: data.length }
  },
  create: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const newItem = { ...data, id: Math.max(...mockData.map((d) => d.id)) + 1, createTime: new Date().toISOString() } as typeof mockData[number]
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
</script>
