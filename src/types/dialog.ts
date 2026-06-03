/**
 * 表单字段类型
 */
export type FormFieldType =
  | "input"
  | "number"
  | "select"
  | "date-picker"
  | "time-picker"
  | "switch"
  | "checkbox"
  | "radio"
  | "textarea"
  | "upload"
  | "rich-text";

/**
 * 表单字段配置
 */
export interface FormField {
  /** 字段名 */
  prop: string;
  /** 字段标签 */
  label: string;
  /** 字段类型 */
  type?: FormFieldType;
  /** 占位符 */
  placeholder?: string;
  /** 默认值 */
  defaultValue?: any;
  /** 是否必填 */
  required?: boolean;
  /** 校验规则 */
  rules?: any[];
  /** 选项列表（select、checkbox、radio 使用） */
  options?: OptionItem[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 是否可清空 */
  clearable?: boolean;
  /** 样式类名 */
  className?: string;
  /** 表单项属性透传 */
  componentProps?: Record<string, any>;
  /** 表单项 span（栅格布局） */
  span?: number;
  /** 最小值（number 类型） */
  min?: number;
  /** 最大值（number 类型） */
  max?: number;
  /** 步长（number 类型） */
  step?: number;
  /** 精度（number 类型） */
  precision?: number;
  /** 最大长度 */
  maxlength?: number;
  /** 最小长度 */
  minlength?: number;
  /** 行数（textarea 类型） */
  rows?: number;
  /** 自动调整高度（textarea 类型） */
  autosize?: boolean | { minRows: number; maxRows: number };
}

/**
 * 选项配置
 */
export interface OptionItem {
  /** 选项标签 */
  label: string;
  /** 选项值 */
  value: string | number | boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子选项 */
  children?: OptionItem[];
}

/**
 * 弹窗模式
 */
export type DialogMode = "create" | "edit" | "view";

/**
 * 弹窗配置
 */
export interface DialogConfig {
  /** 弹窗标题（新增） */
  createTitle?: string;
  /** 弹窗标题（编辑） */
  editTitle?: string;
  /** 弹窗标题（查看） */
  viewTitle?: string;
  /** 弹窗宽度 */
  width?: string | number;
  /** 是否全屏 */
  fullscreen?: boolean;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 是否点击遮罩关闭 */
  closeOnClickModal?: boolean;
  /** 是否按下 Esc 关闭 */
  closeOnPressEscape?: boolean;
  /** 是否显示确认按钮 */
  showConfirm?: boolean;
  /** 是否显示取消按钮 */
  showCancel?: boolean;
  /** 确认按钮文本 */
  confirmText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 确认按钮加载状态 */
  confirmLoading?: boolean;
  /** 表单字段配置 */
  fields: FormField[];
  /** 表单校验规则 */
  rules?: Record<string, any[]>;
  /** 标签宽度 */
  labelWidth?: string;
  /** 标签位置 */
  labelPosition?: "left" | "right" | "top";
  /** 表单栅格布局 */
  gutter?: number;
}
