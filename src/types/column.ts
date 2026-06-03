/**
 * 列类型枚举
 */
export type ColumnType =
  | "text"
  | "number"
  | "tag"
  | "datetime"
  | "image"
  | "link"
  | "custom";

/**
 * 列对齐方式
 */
export type ColumnAlign = "left" | "center" | "right";

/**
 * 固定列方向
 */
export type ColumnFixed = "left" | "right";

/**
 * 标签类型
 */
export type TagType = "" | "success" | "warning" | "info" | "danger";

/**
 * 标签配置
 */
export interface TagConfig {
  /** 标签文本 */
  label: string;
  /** 标签类型 */
  type?: TagType;
  /** 标签颜色 */
  color?: string;
}

/**
 * 标签映射配置
 */
export type TagMap = Record<string | number, TagConfig>;

/**
 * 日期格式化配置
 */
export interface DateTimeFormat {
  /** 日期格式，默认 YYYY-MM-DD HH:mm:ss */
  format?: string;
  /** 是否显示时间，默认 true */
  showTime?: boolean;
}

/**
 * 图片配置
 */
export interface ImageConfig {
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
  /** 是否预览 */
  preview?: boolean;
  /** 预览图片列表字段 */
  previewList?: string;
  /** 图片填充模式 */
  fit?: "fill" | "contain" | "cover" | "none" | "scale-down";
}

/**
 * 链接配置
 */
export interface LinkConfig {
  /** 链接目标 */
  target?: "_blank" | "_self" | "_parent" | "_top";
  /** 链接文本字段 */
  textField?: string;
}

/**
 * 格式化函数类型
 */
export type ColumnFormatter<T = any> = (
  value: T,
  row: Record<string, any>,
  index: number,
) => string;

/**
 * 列配置
 */
export interface CrudColumn<T = any> {
  /** 字段名 */
  prop: string;
  /** 列标题 */
  label: string;
  /** 列类型 */
  type?: ColumnType;
  /** 列宽度 */
  width?: number | string;
  /** 最小宽度 */
  minWidth?: number | string;
  /** 是否可排序 */
  sortable?: boolean | "custom";
  /** 是否固定 */
  fixed?: ColumnFixed;
  /** 对齐方式 */
  align?: ColumnAlign;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 是否可编辑 */
  editable?: boolean;
  /** 自定义格式化函数 */
  formatter?: ColumnFormatter<T>;
  /** 标签映射（type 为 tag 时使用） */
  tagMap?: TagMap;
  /** 日期格式化配置（type 为 datetime 时使用） */
  dateTimeFormat?: DateTimeFormat;
  /** 图片配置（type 为 image 时使用） */
  imageConfig?: ImageConfig;
  /** 链接配置（type 为 link 时使用） */
  linkConfig?: LinkConfig;
  /** 是否显示溢出提示 */
  showOverflowTooltip?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 自定义插槽名称 */
  slotName?: string;
  /** 列表头插槽名称 */
  headerSlotName?: string;
}

/**
 * 列配置数组
 */
export type CrudColumns<T = any> = CrudColumn<T>[];
