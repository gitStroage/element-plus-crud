# element-plus-crud 本地验证计划

> 发布前的完整本地验证清单。每项必须实际执行并记录结果。

---

## 一、代码质量检查

### 1.1 TypeScript 类型检查

```bash
# 标准 tsc 检查（验证 .d.ts 和模块声明）
npx tsc --noEmit

# Vue SFC 类型检查（验证 .vue 文件类型推导）
npx vue-tsc --noEmit
```

**预期结果：** 两项均无错误输出，退出码 0。

**检查要点：**
- `env.d.ts` 中的 `*.vue` 和 `*.css` 模块声明是否生效
- 所有 `import type` 是否正确使用
- `src/` 和 `playground/` 的文件都被 tsconfig 覆盖

### 1.2 ESLint 检查

```bash
pnpm lint
```

**预期结果：** 无 error，无 warning。

**检查要点：**
- 无 `any` 类型滥用（除必要的 `Record<string, any>`）
- 无未使用的变量或导入
- Vue SFC 规范符合 eslint-plugin-vue 推荐

### 1.3 代码格式化

```bash
pnpm format
git diff
```

**预期结果：** `git diff` 无变更（说明代码已经格式化）。

---

## 二、单元测试

### 2.1 全量测试

```bash
pnpm test:run
```

**预期结果：**
- 11 个测试文件全部通过
- 111 个测试用例全部通过
- 无 skip/todo 标记

### 2.2 测试覆盖率

```bash
pnpm test:run --coverage
```

**预期结果：**
- 语句覆盖率 >= 80%
- 分支覆盖率 >= 70%
- 函数覆盖率 >= 80%

**检查要点：**
- composables（5 个）均有独立测试
- components（6 个）均有独立测试
- 关键路径覆盖：增删改查、分页、搜索、弹窗

### 2.3 测试文件完整性

逐一确认以下测试文件存在且有实际断言：

| 测试文件 | 覆盖目标 |
|----------|----------|
| `tests/composables/useCrud.test.ts` | CRUD 核心逻辑 |
| `tests/composables/useTable.test.ts` | 表格状态管理 |
| `tests/composables/useSearch.test.ts` | 搜索逻辑 |
| `tests/composables/useDialog.test.ts` | 弹窗状态管理 |
| `tests/composables/usePagination.test.ts` | 分页逻辑 |
| `tests/components/ElCrud.test.ts` | 主组件集成 |
| `tests/components/CrudTable.test.ts` | 表格组件 |
| `tests/components/CrudSearch.test.ts` | 搜索组件 |
| `tests/components/CrudDialog.test.ts` | 弹窗组件 |
| `tests/components/CrudPagination.test.ts` | 分页组件 |
| `tests/components/CrudToolbar.test.ts` | 工具栏组件 |

---

## 三、构建验证

### 3.1 生产构建

```bash
pnpm build
```

**预期结果：**
- 无警告输出
- 构建成功，退出码 0

### 3.2 产出文件检查

```bash
ls -la dist/
```

**必须存在的文件：**

| 文件 | 用途 |
|------|------|
| `dist/index.js` | ES Module 格式 |
| `dist/index.cjs` | CommonJS 格式 |
| `dist/index.d.ts` | TypeScript 类型声明 |
| `dist/index.d.ts.map` | 类型声明 source map |
| `dist/components/*.d.ts` | 组件类型声明 |
| `dist/composables/*.d.ts` | 组合式函数类型声明 |
| `dist/types/*.d.ts` | 类型定义声明 |
| `dist/utils/*.d.ts` | 工具函数类型声明 |

**不应存在的文件：**
- `dist/style.css`（库本身无 CSS）
- `dist/node_modules/`

### 3.3 包体积检查

```bash
# 检查打包后实际大小
pnpm build && du -sh dist/
```

**预期结果：**
- `index.js` < 80 KB
- `index.cjs` < 50 KB
- 总 dist 目录 < 200 KB

### 3.4 外部依赖验证

确认构建产物中不包含以下依赖的代码（它们应被 external）：

```bash
# 检查 vue 和 element-plus 是否被正确排除
grep -c "from 'vue'" dist/index.js        # 应为 0
grep -c "from 'element-plus'" dist/index.js # 应为 0
grep -c "require('vue')" dist/index.cjs     # 应为 0
```

---

## 四、npm 发布模拟

### 4.1 打包预览

```bash
pnpm pack --dry-run
```

**预期结果：**
- 只包含 `dist/` 目录下的文件
- 包含 `package.json`、`README.md`、`LICENSE`
- 不包含 `src/`、`tests/`、`playground/`、`node_modules/`

### 4.2 实际打包测试

```bash
pnpm pack
# 会生成 element-plus-crud-0.1.0.tgz
```

**检查要点：**
- `.tgz` 文件大小合理（< 100 KB）
- 解压后目录结构正确

### 4.3 本地安装测试

```bash
# 在一个临时目录中测试
mkdir /tmp/test-ep-crud && cd /tmp/test-ep-crud
npm init -y
npm install /path/to/element-plus-crud-0.1.0.tgz
npm install vue@^3.4 element-plus@^2.6
```

**验证项：**
- 安装无报错
- `node_modules/element-plus-crud/dist/` 存在
- `node_modules/element-plus-crud/package.json` 中 `exports` 正确

---

## 五、功能集成验证

### 5.1 Playground 验证

```bash
cd element-plus-crud
pnpm dev
```

**手动验证清单：**
- [ ] 页面正常加载，无控制台错误
- [ ] 表格正常渲染数据
- [ ] 搜索功能正常（输入关键字后回车/点击搜索）
- [ ] 搜索重置功能正常
- [ ] 分页功能正常（切换页码、切换每页条数）
- [ ] 新增弹窗正常打开
- [ ] 表单校验正常（必填字段为空时提示）
- [ ] 新增提交后列表刷新
- [ ] 编辑弹窗正常打开并回填数据
- [ ] 编辑提交后列表刷新
- [ ] 删除确认弹窗正常
- [ ] 删除后列表刷新
- [ ] 批量删除功能正常（选中多行后删除）
- [ ] 表格排序功能正常

### 5.2 新项目集成测试

```bash
# 创建一个全新的 Vite + Vue 3 项目
npm create vite@latest test-integration -- --template vue-ts
cd test-integration
npm install
npm install /path/to/element-plus-crud-0.1.0.tgz
npm install element-plus @element-plus/icons-vue
```

在 `src/App.vue` 中测试：

```vue
<template>
  <ElCrud :columns="columns" :api="api" />
</template>

<script setup lang="ts">
import { ElCrud } from 'element-plus-crud'
import type { CrudColumns, CrudApi } from 'element-plus-crud'

const columns: CrudColumns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名' },
]

const api: CrudApi = {
  list: async () => ({ list: [{ id: 1, name: '测试' }], total: 1 }),
}
</script>
```

**验证项：**
- [ ] `import { ElCrud }` 无类型错误
- [ ] `import type { CrudColumns, CrudApi }` 无类型错误
- [ ] 组件正常渲染
- [ ] 无控制台警告或错误

### 5.3 组合式函数集成测试

在上述项目中继续测试：

```vue
<script setup lang="ts">
import { useCrud } from 'element-plus-crud'
</script>
```

**验证项：**
- [ ] `useCrud` 可正常导入
- [ ] 返回值类型正确推导

---

## 六、跨环境兼容性

### 6.1 Node.js 版本矩阵

| Node 版本 | 测试命令 | 预期 |
|-----------|---------|------|
| 18.x | `pnpm test:run && pnpm build` | 全部通过 |
| 20.x | `pnpm test:run && pnpm build` | 全部通过 |
| 22.x | `pnpm test:run && pnpm build` | 全部通过 |

### 6.2 包管理器兼容

| 包管理器 | 安装命令 | 预期 |
|----------|---------|------|
| npm | `npm install element-plus-crud` | 正常安装 |
| pnpm | `pnpm add element-plus-crud` | 正常安装 |
| yarn | `yarn add element-plus-crud` | 正常安装 |

### 6.3 Vue 版本兼容

| Vue 版本 | 预期 |
|----------|------|
| 3.4.x | 正常工作 |
| 3.5.x | 正常工作 |

---

## 七、文档完整性

### 7.1 README 检查

- [ ] 安装命令正确
- [ ] 快速开始示例可运行
- [ ] API 文档与实际 props/events/methods 一致
- [ ] Badge 链接有效（npm、CI、License）
- [ ] 示例代码中的 import 路径正确

### 7.2 CHANGELOG 检查

- [ ] 版本号与 package.json 一致
- [ ] 日期正确
- [ ] 变更内容完整

### 7.3 LICENSE 检查

- [ ] 文件存在
- [ ] 年份和作者正确
- [ ] MIT 协议文本完整

---

## 八、Git 仓库状态

### 8.1 提交前检查

```bash
git status          # 无未跟踪的关键文件
git diff --stat     # 确认变更范围合理
git log --oneline -5  # 确认提交历史整洁
```

### 8.2 .gitignore 验证

确认以下内容被忽略：
- `node_modules/`
- `dist/`
- `*.tgz`
- `.DS_Store`
- `*.local`

### 8.3 分支状态

```bash
git branch -a       # 确认当前分支
git log main..HEAD  # 确认与 main 的差异
```

---

## 九、CI 配置验证

### 9.1 CI 流程确认

`.github/workflows/ci.yml` 应包含：

| 步骤 | 命令 |
|------|------|
| 安装依赖 | `pnpm install` |
| Lint | `pnpm lint` |
| 类型检查 | `pnpm type-check` |
| 测试 | `pnpm test:run` |
| 构建 | `pnpm build` |

### 9.2 本地模拟 CI

```bash
# 按 CI 流程顺序执行
pnpm install && pnpm lint && pnpm type-check && pnpm test:run && pnpm build
```

**预期结果：** 全部通过，无错误。

---

## 十、发布检查清单

### 10.1 发布前最终确认

- [ ] 所有上述检查项通过
- [ ] `package.json` 中 `version` 正确
- [ ] `package.json` 中 `author` 正确
- [ ] `package.json` 中 `repository` 指向正确的 GitHub 仓库
- [ ] `CHANGELOG.md` 已更新
- [ ] README 中的示例与当前 API 一致

### 10.2 发布命令

```bash
# 1. 最终构建
pnpm build

# 2. 登录 npm（如未登录）
npm login

# 3. 发布（会自动触发 prepublishOnly -> pnpm build）
npm publish

# 4. 打 Git tag
git tag v0.1.0
git push origin v0.1.0
```

### 10.3 发布后验证

```bash
# 等待 npm 同步（约 1-2 分钟）
npm view element-plus-crud

# 在新项目中安装验证
npm install element-plus-crud@0.1.0
```

---

## 执行记录模板

| 检查项 | 执行日期 | 结果 | 备注 |
|--------|---------|------|------|
| tsc --noEmit | 2026-06-03 | pass | |
| vue-tsc --noEmit | 2026-06-03 | pass | |
| pnpm lint | | 待执行 | |
| pnpm test:run | 2026-06-03 | 111/111 pass | 11 文件，0 失败 |
| pnpm build | 2026-06-03 | pass | 无警告，index.js 59KB / index.cjs 40KB |
| dist 文件完整性 | 2026-06-03 | pass | 8 项均存在 |
| npm pack --dry-run | 2026-06-03 | pass | 47 文件，包体积 37.2 KB |
| 本地安装测试 | | 待执行 | |
| Playground 功能验证 | | 待执行 | 手动测试 |
| 新项目集成测试 | | 待执行 | |
| 本地模拟 CI | | 待执行 | |
