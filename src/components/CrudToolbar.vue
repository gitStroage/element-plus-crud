<template>
  <div class="el-crud__toolbar">
    <div class="el-crud__toolbar-left">
      <slot name="left">
        <el-button
          v-if="config.showCreate !== false"
          type="primary"
          @click="emit('create')"
        >
          <el-icon><Plus /></el-icon>
          {{ config.createText || '新增' }}
        </el-button>
        <el-button
          v-if="config.showBatchDelete !== false"
          type="danger"
          :disabled="selectedCount === 0"
          @click="emit('batch-delete')"
        >
          <el-icon><Delete /></el-icon>
          {{ config.batchDeleteText || '批量删除' }}
          <span v-if="selectedCount > 0">({{ selectedCount }})</span>
        </el-button>
      </slot>
    </div>

    <div class="el-crud__toolbar-right">
      <slot name="right">
        <el-tooltip content="刷新" placement="top">
          <el-button
            v-if="config.showRefresh !== false"
            circle
            @click="emit('refresh')"
          >
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="密度" placement="top">
          <el-dropdown
            v-if="config.showDensity !== false"
            trigger="click"
            @command="handleDensityChange"
          >
            <el-button circle>
              <el-icon><Operation /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="large">宽松</el-dropdown-item>
                <el-dropdown-item command="default">默认</el-dropdown-item>
                <el-dropdown-item command="small">紧凑</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>

        <el-tooltip content="列设置" placement="top">
          <el-popover
            v-if="config.showColumnSetting !== false"
            placement="bottom"
            :width="200"
            trigger="click"
          >
            <template #reference>
              <el-button circle>
                <el-icon><Setting /></el-icon>
              </el-button>
            </template>
            <slot name="column-setting">
              <div>列设置</div>
            </slot>
          </el-popover>
        </el-tooltip>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Delete, Refresh, Operation, Setting } from '@element-plus/icons-vue'
import type { ToolbarConfig } from '../types'

defineOptions({
  name: 'CrudToolbar',
})

interface Props {
  config: ToolbarConfig
  selectedCount?: number
}

withDefaults(defineProps<Props>(), {
  selectedCount: 0,
})

const emit = defineEmits<{
  create: []
  'batch-delete': []
  refresh: []
  'density-change': [size: string]
}>()

function handleDensityChange(size: string) {
  emit('density-change', size)
}
</script>
