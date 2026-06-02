# element-plus-crud

[![npm version](https://img.shields.io/npm/v/element-plus-crud.svg)](https://www.npmjs.com/package/element-plus-crud)
[![npm downloads](https://img.shields.io/npm/dm/element-plus-crud.svg)](https://www.npmjs.com/package/element-plus-crud)
[![CI](https://github.com/gitStroage/element-plus-crud/actions/workflows/ci.yml/badge.svg)](https://github.com/gitStroage/element-plus-crud/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 一行配置，生成完整的 CRUD 页面。基于 Vue 3 + Element Plus。

English | 中文

## 特性

- **零模板代码** - 一个配置对象生成完整的表格 + 搜索 + 弹窗页面
- **TypeScript 支持** - 完整的类型定义，IDE 智能提示
- **高度可定制** - 支持自定义插槽、渲染函数、样式覆盖
- **开箱即用** - 内置分页、排序、筛选、表单校验
- **轻量级** - 无额外依赖，仅依赖 Element Plus
- **Tree-shaking** - 按需引入，打包体积小

## 安装

```bash
npm install element-plus-crud
# or
pnpm add element-plus-crud
```

## 快速开始

```vue
<template>
  <el-crud
    :columns="columns"
    :api="api"
    :search="searchConfig"
    :dialog="dialogConfig"
  />
</template>

<script setup lang="ts">
import { ElCrud } from 'element-plus-crud'
import type { CrudColumns, CrudApi, SearchConfig, DialogConfig } from 'element-plus-crud'

const columns: CrudColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名' },
  { prop: 'email', label: '邮箱' },
  {
    prop: 'status',
    label: '状态',
    type: 'tag',
    tagMap: {
      1: { label: '启用', type: 'success' },
      0: { label: '禁用', type: 'danger' },
    },
  },
  { prop: 'createTime', label: '创建时间', type: 'datetime' },
]

const searchConfig: SearchConfig = {
  fields: [
    { prop: 'name', label: '姓名', type: 'input' },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  ],
}

const dialogConfig: DialogConfig = {
  fields: [
    { prop: 'name', label: '姓名', type: 'input', required: true },
    { prop: 'email', label: '邮箱', type: 'input', required: true },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  ],
}

const api: CrudApi = {
  list: (params) => request.get('/api/users', { params }),
  create: (data) => request.post('/api/users', data),
  update: (id, data) => request.put(`/api/users/${id}`, data),
  delete: (id) => request.delete(`/api/users/${id}`),
}
</script>
```

## 列类型

| 类型 | 说明 | 配置 |
|------|------|------|
| text | 文本（默认） | - |
| number | 数字 | `formatter: (value) => string` |
| tag | 标签 | `tagMap: Record<any, { label: string, type: string }>` |
| datetime | 日期时间 | `format: string` |
| image | 图片 | `imageConfig: { width, height, preview }` |
| link | 链接 | `linkConfig: { target, href }` |

## 搜索字段类型

| 类型 | 说明 |
|------|------|
| input | 输入框 |
| select | 下拉选择 |
| date-picker | 日期选择 |
| date-range-picker | 日期范围 |
| time-picker | 时间选择 |
| time-select | 时间下拉 |
| switch | 开关 |
| checkbox | 复选框 |
| radio | 单选框 |

## 自定义插槽

```vue
<el-crud :columns="columns" :api="api">
  <!-- 自定义列渲染 -->
  <template #column-status="{ row }">
    <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
      {{ row.status }}
    </el-tag>
  </template>

  <!-- 自定义操作列 -->
  <template #column-actions="{ row }">
    <el-button size="small" @click="handleEdit(row)">编辑</el-button>
    <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
  </template>
</el-crud>
```

## 组合式函数

除了组件方式，还可以使用 `useCrud` 组合式函数：

```vue
<script setup lang="ts">
import { useCrud } from 'element-plus-crud'

const {
  tableData,
  loading,
  fetchList,
  handleSearch,
  openCreateDialog,
  openEditDialog,
} = useCrud({
  columns,
  api,
  search: searchConfig,
  dialog: dialogConfig,
})
</script>
```

## API

### Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| columns | CrudColumns | 是 | - | 列配置 |
| api | CrudApi | 是 | - | API 接口配置 |
| search | SearchConfig | 否 | - | 搜索配置 |
| dialog | DialogConfig | 否 | - | 弹窗表单配置 |
| pagination | PaginationConfig | 否 | - | 分页配置 |
| toolbar | ToolbarConfig | 否 | - | 工具栏配置 |
| keyField | string | 否 | 'id' | 主键字段名 |
| immediate | boolean | 否 | true | 是否立即加载数据 |
| stripe | boolean | 否 | true | 是否显示斑马纹 |
| border | boolean | 否 | true | 是否显示边框 |
| size | string | 否 | 'default' | 表格尺寸 |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| search | (params: Record<string, any>) | 搜索触发 |
| reset | - | 重置搜索触发 |
| create | (data: Record<string, any>) | 新增触发 |
| update | (id: any, data: Record<string, any>) | 更新触发 |
| batch-delete | (ids: any[]) | 批量删除触发 |
| row-click | (row, column, event) | 行点击 |
| selection-change | (rows: any[]) | 选择变化 |
| page-change | (page: number) | 页码变化 |
| size-change | (size: number) | 每页条数变化 |

### Methods

| 方法名 | 参数 | 说明 |
|--------|------|------|
| refresh | () => void | 刷新表格数据 |
| search | (params?) => void | 执行搜索 |
| resetSearch | () => void | 重置搜索 |
| getSelectionRows | () => any[] | 获取选中行 |
| openCreateDialog | (defaultData?) => void | 打开新增弹窗 |
| openEditDialog | (row) => void | 打开编辑弹窗 |
| closeDialog | () => void | 关闭弹窗 |
| getTableData | () => any[] | 获取表格数据 |
| setTableData | (data) => void | 设置表格数据 |

## 示例

- [基础示例](./examples/basic/App.vue) - 基本 CRUD 功能
- [高级示例](./examples/advanced/App.vue) - 自定义渲染、格式化函数、列固定
- [自定义插槽](./examples/custom-slot/App.vue) - 插槽自定义列和表单

## 在线演示

[在线 Playground](https://element-plus-crud.vercel.app)

## 对比

| 特性 | element-plus-crud | form-create | cool-admin |
|------|-------------------|-------------|------------|
| 轻量级 | ✅ | ❌ | ❌ |
| TypeScript | ✅ | 部分 | ✅ |
| Vue 3 原生 | ✅ | ✅ | ✅ |
| 学习成本 | 低 | 中 | 高 |
| 自定义插槽 | ✅ | ✅ | ✅ |
| 仅做 CRUD | ✅ | ❌ | ❌ |
| 按需引入 | ✅ | ✅ | ❌ |

## 贡献

欢迎贡献！请阅读 [贡献指南](./CONTRIBUTING.md)。

## License

[MIT](./LICENSE)
