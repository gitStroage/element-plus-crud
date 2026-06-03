<template>
  <div class="el-crud__search">
    <el-form
      :model="formData"
      :label-width="config.labelWidth || '80px'"
      :label-position="config.labelPosition || 'right'"
      @submit.prevent="handleSearch"
    >
      <el-row :gutter="16">
        <el-col
          v-for="field in displayFields"
          :key="field.prop"
          :span="6"
        >
          <el-form-item
            :label="field.label"
            :prop="field.prop"
          >
            <!-- Input -->
            <el-input
              v-if="!field.type || field.type === 'input'"
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              v-bind="field.componentProps"
            />

            <!-- Select -->
            <el-select
              v-else-if="field.type === 'select'"
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              v-bind="field.componentProps"
              style="width: 100%"
            >
              <el-option
                v-for="option in field.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                :disabled="option.disabled"
              />
            </el-select>

            <!-- DatePicker -->
            <el-date-picker
              v-else-if="field.type === 'date-picker'"
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              v-bind="field.componentProps"
              style="width: 100%"
            />

            <!-- DateRangePicker -->
            <el-date-picker
              v-else-if="field.type === 'date-range-picker'"
              v-model="formData[field.prop]"
              type="daterange"
              :start-placeholder="
                field.componentProps?.startPlaceholder || '开始日期'
              "
              :end-placeholder="
                field.componentProps?.endPlaceholder || '结束日期'
              "
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              v-bind="field.componentProps"
              style="width: 100%"
            />

            <!-- TimePicker -->
            <el-time-picker
              v-else-if="field.type === 'time-picker'"
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              v-bind="field.componentProps"
              style="width: 100%"
            />

            <!-- TimeSelect -->
            <el-time-select
              v-else-if="field.type === 'time-select'"
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="field.disabled"
              :clearable="field.clearable !== false"
              v-bind="field.componentProps"
              style="width: 100%"
            />

            <!-- Switch -->
            <el-switch
              v-else-if="field.type === 'switch'"
              v-model="formData[field.prop]"
              :disabled="field.disabled"
              v-bind="field.componentProps"
            />

            <!-- Checkbox -->
            <el-checkbox-group
              v-else-if="field.type === 'checkbox'"
              v-model="formData[field.prop]"
              :disabled="field.disabled"
              v-bind="field.componentProps"
            >
              <el-checkbox
                v-for="option in field.options"
                :key="option.value"
                :label="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>

            <!-- Radio -->
            <el-radio-group
              v-else-if="field.type === 'radio'"
              v-model="formData[field.prop]"
              :disabled="field.disabled"
              v-bind="field.componentProps"
            >
              <el-radio
                v-for="option in field.options"
                :key="option.value"
                :label="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <!-- 操作按钮 -->
        <el-col :span="6">
          <el-form-item>
            <el-button
              v-if="config.showSearch !== false"
              type="primary"
              @click="handleSearch"
            >
              {{ config.searchText || "搜索" }}
            </el-button>
            <el-button
              v-if="config.showReset !== false"
              @click="handleReset"
            >
              {{ config.resetText || "重置" }}
            </el-button>
            <el-button
              v-if="config.showMore && config.fields.length > moreCount"
              type="primary"
              link
              @click="showMore = !showMore"
            >
              {{ showMore ? "收起" : "更多" }}
              <el-icon>
                <ArrowUp v-if="showMore" />
                <ArrowDown v-else />
              </el-icon>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";
import type { SearchConfig, SearchField } from "../types";

defineOptions({
  name: "CrudSearch",
});

interface Props {
  config: SearchConfig;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  search: [params: Record<string, any>];
  reset: [];
}>();

// 是否显示更多
const showMore = ref(false);

// 更多按钮显示数量
const moreCount = computed(() => props.config.moreCount || 3);

// 表单数据
const formData = reactive<Record<string, any>>({});

// 初始化表单数据
function initFormData() {
  props.config.fields.forEach((field) => {
    formData[field.prop] = field.defaultValue ?? getDefaultValue(field.type);
  });
}

// 获取默认值
function getDefaultValue(type?: string) {
  switch (type) {
    case "checkbox":
      return [];
    case "switch":
      return false;
    default:
      return undefined;
  }
}

// 显示的字段
const displayFields = computed<SearchField[]>(() => {
  const fields = props.config.fields;
  if (!props.config.showMore || showMore.value) {
    return fields;
  }
  return fields.slice(0, moreCount.value);
});

// 监听配置变化，重新初始化
watch(() => props.config.fields, initFormData, { immediate: true, deep: true });

// 搜索
function handleSearch() {
  // 过滤空值
  const params: Record<string, any> = {};
  Object.keys(formData).forEach((key) => {
    const value = formData[key];
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value;
    }
  });
  emit("search", params);
}

// 重置
function handleReset() {
  initFormData();
  emit("reset");
}
</script>
