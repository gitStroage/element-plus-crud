import type { CrudColumn } from "../types";

/**
 * 获取列的显示值
 */
export function getColumnValue(
  row: Record<string, any>,
  column: CrudColumn,
): any {
  const { prop } = column;
  if (!prop) return "";

  // 支持嵌套属性，如 'user.name'
  return prop.split(".").reduce((obj, key) => obj?.[key], row);
}

/**
 * 格式化列的显示文本
 */
export function formatColumnValue(
  row: Record<string, any>,
  column: CrudColumn,
  index: number,
): string {
  const value = getColumnValue(row, column);

  // 使用自定义格式化函数
  if (column.formatter) {
    return column.formatter(value, row, index);
  }

  // 根据类型格式化
  switch (column.type) {
    case "datetime":
      return value ? formatDateTime(value, column.dateTimeFormat?.format) : "";
    case "number":
      return value !== undefined && value !== null ? String(value) : "";
    case "tag":
      return column.tagMap?.[value]?.label ?? String(value ?? "");
    default:
      return value !== undefined && value !== null ? String(value) : "";
  }
}

/**
 * 格式化日期时间
 */
function formatDateTime(
  date: Date | string | number,
  format = "YYYY-MM-DD HH:mm:ss",
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

/**
 * 获取标签类型
 */
export function getTagType(column: CrudColumn, value: any): string {
  if (column.tagMap?.[value]?.type) {
    return column.tagMap[value].type!;
  }
  return "";
}

/**
 * 获取标签颜色
 */
export function getTagColor(column: CrudColumn, value: any): string {
  if (column.tagMap?.[value]?.color) {
    return column.tagMap[value].color!;
  }
  return "";
}
