# element-plus-crud

[![npm version](https://img.shields.io/npm/v/element-plus-crud.svg)](https://www.npmjs.com/package/element-plus-crud)
[![npm downloads](https://img.shields.io/npm/dm/element-plus-crud.svg)](https://www.npmjs.com/package/element-plus-crud)
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
  { prop: 'status', label: '状态', type: 'tag', tagMap: { 1: { label: '启用', type: 'success' }, 0: { label: '禁用', type: 'danger' } } },
  { prop: 'createTime', label: '创建时间', type: 'datetime' },
]

const searchConfig: SearchConfig = {
  fields: [
    { prop: 'name', label: '姓名', type: 'input' },
    { prop: 'status', label: '状态', type: 'select', options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] },
  ],
}

const dialogConfig: DialogConfig = {
  fields: [
    { prop: 'name', label: '姓名', type: 'input', required: true },
    { prop: 'email', label: '邮箱', type: 'input', required: true },
    { prop: 'status', label: '状态', type: 'select', options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] },
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

## 配置说明

### 列配置 (Column)

| 属性 | 类型 | 说明 |
|------|------|------|
| prop | string | 字段名 |
| label | string | 列标题 |
| type | string | 列类型：text, number, tag, datetime, image, link |
| width | number | 列宽度 |
| sortable | boolean | 是否可排序 |
| formatter | function | 自定义格式化 |
| hidden | boolean | 是否隐藏 |
| fixed | string | 固定列：left, right |

### 搜索配置 (Search)

| 属性 | 类型 | 说明 |
|------|------|------|
| fields | SearchField[] | 搜索字段配置 |
| showMore | boolean | 是否显示更多按钮 |
| moreCount | number | 更多按钮显示数量 |

### 弹窗配置 (Dialog)

| 属性 | 类型 | 说明 |
|------|------|------|
| fields | FormField[] | 表单字段配置 |
| rules | object | 校验规则 |
| labelWidth | string | 标签宽度 |
| width | string | 弹窗宽度 |

## 自定义插槽

```vue
<el-crud :columns="columns" :api="api">
  <!-- 自定义状态列 -->
  <template #column-status="{ row }">
    <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
      {{ row.status }}
    </el-tag>
  </template>

  <!-- 自定义操作列 -->
  <template #actions="{ row }">
    <el-button size="small" @click="handleEdit(row)">编辑</el-button>
    <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
  </template>
</el-crud>
```

## API

### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| columns | CrudColumns | 是 | 列配置 |
| api | CrudApi | 是 | API 接口配置 |
| search | SearchConfig | 否 | 搜索配置 |
| dialog | DialogConfig | 否 | 弹窗表单配置 |
| pagination | PaginationConfig | 否 | 分页配置 |
| toolbar | ToolbarConfig | 否 | 工具栏配置 |
| keyField | string | 否 | 主键字段名，默认 'id' |
| immediate | boolean | 否 | 是否立即加载数据，默认 true |

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| search | (params: object) | 搜索触发 |
| create | (data: object) | 新增触发 |
| update | (id: any, data: object) | 更新触发 |
| delete | (id: any) | 删除触发 |
| row-click | (row: object) | 行点击 |
| selection-change | (rows: object[]) | 选择变化 |

### Methods

| 方法名 | 参数 | 说明 |
|--------|------|------|
| refresh | () => void | 刷新表格数据 |
| search | (params: object) => void | 执行搜索 |
| resetSearch | () => void | 重置搜索 |
| getSelectionRows | () => object[] | 获取选中行 |

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

## 贡献指南

欢迎贡献！请阅读 [贡献指南](./CONTRIBUTING.md)。

## License

[MIT](./LICENSE)
