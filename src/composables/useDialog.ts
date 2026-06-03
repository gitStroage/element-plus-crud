import { ref, computed } from "vue";
import type { DialogMode } from "../types";

export function useDialog() {
  const visible = ref(false);
  const mode = ref<DialogMode>("create");
  const data = ref<Record<string, any>>({});
  const loading = ref(false);

  // 是否是新增模式
  const isCreate = computed(() => mode.value === "create");

  // 是否是编辑模式
  const isEdit = computed(() => mode.value === "edit");

  // 是否是查看模式
  const isView = computed(() => mode.value === "view");

  // 打开弹窗
  function open(
    dialogMode: DialogMode = "create",
    dialogData: Record<string, any> = {},
  ) {
    mode.value = dialogMode;
    data.value = { ...dialogData };
    visible.value = true;
  }

  // 关闭弹窗
  function close() {
    visible.value = false;
    data.value = {};
    loading.value = false;
  }

  // 设置加载状态
  function setLoading(value: boolean) {
    loading.value = value;
  }

  // 设置数据
  function setData(dialogData: Record<string, any>) {
    data.value = { ...dialogData };
  }

  return {
    visible,
    mode,
    data,
    loading,
    isCreate,
    isEdit,
    isView,
    open,
    close,
    setLoading,
    setData,
  };
}
