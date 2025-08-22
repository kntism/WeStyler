<script setup>
import { ref, onMounted } from "vue";
import exampleContent from "../../../content/guide.md?raw";

// 使用 Vite 的 import.meta.glob 动态导入 content 文件夹下的所有 .md 文件
const contentFiles = import.meta.glob("../../../content/*.md", { as: "raw" });

// 存储文件名列表，用于下拉菜单
const availableContentFiles = ref([]);

// 默认的 Markdown 内容
const markdownContent = ref(exampleContent);

// 定义 emit 事件，用于向父组件传递内容变化
const emit = defineEmits(["updateContent"]);

// 更新内容并触发事件
const updateContent = () => {
  emit("updateContent", markdownContent.value);
};

// 加载 content 文件夹中的文件内容
const loadContentFile = async (fileName) => {
  // 检查是否是加载本地文件的特殊命令
  if (fileName === '__load_local__') {
    handleLocalFileSelect();
    return;
  }

  const filePath = `../../../content/${fileName}`;
  const loadFile = contentFiles[filePath];
  if (loadFile) {
    try {
      const content = await loadFile();
      markdownContent.value = content;
      updateContent(); // 手动触发更新
    } catch (error) {
      console.error(`加载文件 ${fileName} 失败:`, error);
      ElMessage({
        type: "error",
        message: `加载文件 ${fileName} 失败`,
        duration: 2000,
      });
    }
  }
};

// 处理用户选择本地文件的逻辑
const handleLocalFileSelect = () => {
  // 创建一个隐藏的文件输入元素
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.md'; // 限制只能选择 .md 文件

  // 设置文件选择后的回调
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        markdownContent.value = e.target.result;
        updateContent(); // 更新内容
      };
      reader.onerror = (e) => {
        console.error("读取文件失败:", e);
        ElMessage({
          type: "error",
          message: `读取文件失败: ${file.name}`,
          duration: 3000,
        });
      };
      reader.readAsText(file); // 以文本形式读取文件
    } else if (file) {
      ElMessage({
        type: "warning",
        message: "请选择一个 .md 文件",
        duration: 2000,
      });
    }
  };

  // 触发文件选择对话框
  input.click();
};

// 在组件挂载后，提取可用的 content 文件名
onMounted(() => {
  const contentFileNames = Object.keys(contentFiles).map((path) => {
    // 从路径中提取文件名
    return path.split("/").pop();
  });
  availableContentFiles.value = contentFileNames;
});
</script>

<template>
  <div class="editor-section">
    <div class="section-title">
      <span>Markdown 编辑器</span>
      <div>
        <el-dropdown
          @command="loadContentFile"
          size="small"
          v-if="availableContentFiles.length > 0"
        >
          <el-button type="primary" size="small" plain>
            加载文件<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="file in availableContentFiles"
                :key="file"
                :command="file"
              >
                {{ file }}
              </el-dropdown-item>
              <!-- 新增从本地加载文件的选项 -->
              <el-dropdown-item command="__load_local__" divided>
                从本地加载...
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-input
      v-model="markdownContent"
      type="textarea"
      class="full-height-textarea"
      placeholder="请输入Markdown内容"
      @input="updateContent"
    />
  </div>
</template>

<style scoped>
.editor-section {
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.full-height-textarea {
  height: calc(100% - 30px);
}
</style>