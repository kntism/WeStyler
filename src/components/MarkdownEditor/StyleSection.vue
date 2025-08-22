<script setup>
import { ref, onMounted } from "vue";
import markdownPreviewStyle from "../../../theme/default.css?raw";

// 使用 Vite 的 import.meta.glob 动态导入 theme 文件夹下的所有 .css 文件
const themeFiles = import.meta.glob("../../../theme/*.css", { as: "raw" });

// 存储文件名列表，用于下拉菜单
const availableThemeFiles = ref([]);

// 从外部文件导入的样式内容
const styleContent = ref(markdownPreviewStyle);

// 定义 emit 事件，用于向父组件传递样式变化
const emit = defineEmits(["updateStyle"]);

// 更新样式并触发事件
const updateStyle = () => {
  emit("updateStyle", styleContent.value);
};

// 加载 theme 文件夹中的样式文件内容
const loadThemeFile = async (fileName) => {
  // 检查是否是加载本地文件的特殊命令
  if (fileName === '__load_local__') {
    handleLocalStyleSelect();
    return;
  }

  const filePath = `../../../theme/${fileName}`;
  const loadFile = themeFiles[filePath];
  if (loadFile) {
    try {
      const style = await loadFile();
      styleContent.value = style;
      
      // 动态调整预览区域容器的类名以匹配主题
      const previewContentElement = document.querySelector('.preview-content');
      if (previewContentElement) {
        // 移除所有可能的主题类
        previewContentElement.classList.remove('dark-theme');
        // 根据文件名添加对应的主题类
        if (fileName === 'dark.css') {
          previewContentElement.classList.add('dark-theme');
        }
      }

      updateStyle(); // 手动触发更新
    } catch (error) {
      console.error(`加载样式文件 ${fileName} 失败:`, error);
      ElMessage({
        type: "error",
        message: `加载样式文件 ${fileName} 失败`,
        duration: 2000,
      });
    }
  }
};

// 处理用户选择本地样式文件的逻辑
const handleLocalStyleSelect = () => {
  // 创建一个隐藏的文件输入元素
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.css'; // 限制只能选择 .css 文件

  // 设置文件选择后的回调
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.css')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        styleContent.value = e.target.result;
        
        // 动态调整预览区域容器的类名以匹配主题
        // 注意：这里我们不知道本地文件是否是深色主题，所以简单地移除 dark-theme 类
        const previewContentElement = document.querySelector('.preview-content');
        if (previewContentElement) {
          previewContentElement.classList.remove('dark-theme');
        }

        updateStyle(); // 更新样式
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
        message: "请选择一个 .css 文件",
        duration: 2000,
      });
    }
  };

  // 触发文件选择对话框
  input.click();
};

// 在组件挂载后，提取可用的 theme 文件名
onMounted(() => {
  const themeFileNames = Object.keys(themeFiles).map((path) => {
    // 从路径中提取文件名
    return path.split("/").pop();
  });
  availableThemeFiles.value = themeFileNames;
});
</script>

<template>
  <div class="style-section">
    <div class="section-title">
      <span>样式编辑器</span>
      <div>
        <el-dropdown @command="loadThemeFile" size="small" v-if="availableThemeFiles.length > 0">
          <el-button type="primary" size="small" plain>
            加载主题<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="file in availableThemeFiles" :key="file" :command="file">
                {{ file }}
              </el-dropdown-item>
              <!-- 新增从本地加载样式文件的选项 -->
              <el-dropdown-item command="__load_local__" divided>
                从本地加载...
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-input
      v-model="styleContent"
      type="textarea"
      class="full-height-textarea"
      placeholder="请输入CSS样式"
      @input="updateStyle"
    />
  </div>
</template>

<style scoped>
.style-section {
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