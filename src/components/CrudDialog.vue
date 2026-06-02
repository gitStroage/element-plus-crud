<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    :width="config.width || '600px'"
    :fullscreen="config.fullscreen"
    :draggable="config.draggable !== false"
    :show-close="config.showClose !== false"
    :close-on-click-modal="config.closeOnClickModal !== false"
    :close-on-press-escape="config.closeOnPressEscape !== false"
    destroy-on-close
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-width="config.labelWidth || '100px'"
      :label-position="config.labelPosition || 'right'"
    >
      <el-row :gutter="config.gutter || 16">
        <el-col
          v-for="field in config.fields"
          :key="field.prop"
          :span="field.span || 24"
        >
          <el-form-item :label="field.label" :prop="field.prop">
            <!-- Input -->
            <el-input
              v-if="!field.type || field.type === 'input'"
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              :disabled="field.disabled || isViewMode"
              :readonly="field.readonly || isViewMode"
              :clearable="field.clearable !== false"
              :maxlength="field.maxlength"
              :show-word-limit="field.maxlength !== undefined"
              v-bind="field.componentProps"
            />

            <!-- Number -->
            <el-input-number
              v-else-if="field.type === 'number'"
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              :disabled="field.disabled || isViewMode"
              :min="field.min"
              :max="field.max"
              :step="field.step"
              :precision="field.precision"
              v-bind="field.componentProps"
              style="width: 100%"
            />

            <!-- Textarea -->
            <el-input
              v-else-if="field.type === 'textarea'"
              v-model="formData[field.prop]"
              type="textarea"
              :placeholder="field.placeholder || `请输入${field.label}`"
              :disabled="field.disabled || isViewMode"
              :readonly="field.readonly || isViewMode"
              :maxlength="field.maxlength"
              :show-word-limit="field.maxlength !== undefined"
              :rows="field.rows || 3"
              :autosize="field.autosize"
              v-bind="field.componentProps"
            />

            <!-- Select -->
            <el-select
              v-else-if="field.type === 'select'"
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="field.disabled || isViewMode"
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
              :disabled="field.disabled || isViewMode"
              :clearable="field.clearable !== false"
              v-bind="field.componentProps"
              style="width: 100%"
            />

            <!-- TimePicker -->
            <el-time-picker
              v-else-if="field.type === 'time-picker'"
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请选择${field.label}`"
              :disabled="field.disabled || isViewMode"
              :clearable="field.clearable !== false"
              v-bind="field.componentProps"
              style="width: 100%"
            />

            <!-- Switch -->
            <el-switch
              v-else-if="field.type === 'switch'"
              v-model="formData[field.prop]"
              :disabled="field.disabled || isViewMode"
              v-bind="field.componentProps"
            />

            <!-- Checkbox -->
            <el-checkbox-group
              v-else-if="field.type === 'checkbox'"
              v-model="formData[field.prop]"
              :disabled="field.disabled || isViewMode"
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
              :disabled="field.disabled || isViewMode"
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

            <!-- Upload -->
            <el-upload
              v-else-if="field.type === 'upload'"
              v-model:file-list="formData[field.prop]"
              :action="field.componentProps?.action"
              :headers="field.componentProps?.headers"
              :multiple="field.componentProps?.multiple ?? false"
              :limit="field.componentProps?.limit"
              :accept="field.componentProps?.accept"
              :disabled="field.disabled || isViewMode"
              :list-type="field.componentProps?.listType || 'picture-card'"
              :auto-upload="field.componentProps?.autoUpload ?? true"
              v-bind="field.componentProps"
            >
              <el-icon v-if="!isViewMode"><Plus /></el-icon>
            </el-upload>

            <!-- 自定义插槽 -->
            <slot v-else :name="`form-${field.prop}`" :field="field" :form-data="formData" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template v-if="!isViewMode" #footer>
      <span class="el-crud__dialog-footer">
        <el-button @click="handleClose">
          {{ config.cancelText || '取消' }}
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ config.confirmText || '确定' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { DialogConfig, DialogMode } from '../types'

defineOptions({
  name: 'CrudDialog',
})

interface Props {
  config: DialogConfig
  mode: DialogMode
  data?: Record<string, any>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  loading: false,
})

const emit = defineEmits<{
  submit: [data: Record<string, any>]
  close: []
}>()

// 弹窗可见性
const visible = ref(false)

// 表单引用
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<Record<string, any>>({})

// 是否查看模式
const isViewMode = computed(() => props.mode === 'view')

// 弹窗标题
const dialogTitle = computed(() => {
  const { config, mode } = props
  switch (mode) {
    case 'create':
      return config.createTitle || '新增'
    case 'edit':
      return config.editTitle || '编辑'
    case 'view':
      return config.viewTitle || '查看'
    default:
      return ''
  }
})

// 表单校验规则
const formRules = computed<FormRules>(() => {
  const rules: FormRules = { ...props.config.rules }

  // 自动生成必填规则
  props.config.fields.forEach((field) => {
    if (field.required && !rules[field.prop]) {
      rules[field.prop] = [
        { required: true, message: `请输入${field.label}`, trigger: 'blur' },
      ]
    }
    if (field.rules) {
      rules[field.prop] = [...(rules[field.prop] as any[] || []), ...field.rules]
    }
  })

  return rules
})

// 初始化表单数据
function initFormData() {
  // 先设置默认值
  props.config.fields.forEach((field) => {
    formData[field.prop] = field.defaultValue ?? getDefaultValue(field.type)
  })

  // 再合并传入的数据
  if (props.data) {
    Object.keys(props.data).forEach((key) => {
      if (key in formData || props.config.fields.some((f) => f.prop === key)) {
        formData[key] = props.data![key]
      }
    })
  }
}

// 获取默认值
function getDefaultValue(type?: string) {
  switch (type) {
    case 'checkbox':
      return []
    case 'switch':
      return false
    case 'number':
      return undefined
    default:
      return undefined
  }
}

// 监听数据变化，重新初始化
watch(
  () => [props.data, props.mode],
  () => {
    if (visible.value) {
      initFormData()
    }
  },
  { deep: true }
)

// 打开弹窗
function open() {
  visible.value = true
  initFormData()
}

// 关闭弹窗
function close() {
  visible.value = false
  formRef.value?.resetFields()
}

// 处理关闭
function handleClose() {
  close()
  emit('close')
}

// 处理提交
async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('submit', { ...formData })
  } catch {
    // 校验失败
  }
}

// 暴露方法
defineExpose({
  open,
  close,
  getFormData: () => ({ ...formData }),
  setFormData: (data: Record<string, any>) => {
    Object.keys(data).forEach((key) => {
      formData[key] = data[key]
    })
  },
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
})
</script>
