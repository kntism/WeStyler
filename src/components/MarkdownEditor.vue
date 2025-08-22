<script setup>
import { ref, onMounted } from "vue";
import exampleContent from "../../content/guide.md?raw";
import markdownPreviewStyle from "../../theme/default.css?raw";
import EditorSection from "./MarkdownEditor/EditorSection.vue";
import StyleSection from "./MarkdownEditor/StyleSection.vue";
import PreviewSection from "./MarkdownEditor/PreviewSection.vue";
import { createMarkdownInstance } from "./MarkdownEditor/markdownPlugins.js";

// Markdown 解析器实例
const md = createMarkdownInstance();

// 默认的 Markdown 内容
const markdownContent = ref(exampleContent);

// 从外部文件导入的样式内容
const styleContent = ref(markdownPreviewStyle);

const htmlContent = ref("");
const styleElement = ref(null);

// 导入预览更新工具函数
import { updatePreview as updatePreviewUtil } from "./MarkdownEditor/previewUtils.js";

// 更新预览函数
const updatePreview = () => {
  const result = updatePreviewUtil(md, markdownContent.value, styleContent.value, styleElement.value);
  htmlContent.value = result.htmlContent;
  styleElement.value = result.styleElement;
};

// 处理内容更新
const handleContentUpdate = (content) => {
  markdownContent.value = content;
  updatePreview();
};

// 处理样式更新
const handleStyleUpdate = (style) => {
  styleContent.value = style;
  updatePreview();
};

// 初始化预览
updatePreview();
</script>

<template>
  <div class="editor-container">
    <el-container>
      <el-aside width="40%">
        <EditorSection @updateContent="handleContentUpdate" />
      </el-aside>
      <el-aside width="30%">
        <StyleSection @updateStyle="handleStyleUpdate" />
      </el-aside>
      <el-aside width="414px">
        <PreviewSection :htmlContent="htmlContent" />
      </el-aside>
    </el-container>
  </div>
</template>

<style scoped>
.editor-container {
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

:deep(.el-textarea__inner) {
  font-family: Consolas, monospace;
  background-color: #f5f5f5;
  color: #202020;
  height: 100% !important;
  font-size: 14px;
  line-height: 25px;
  padding: 20px;
}

:deep(.el-container) {
  height: 100%;
}

/* 隐藏滚动条样式 */
:deep(.el-textarea__inner::-webkit-scrollbar) {
  width: 0;
  height: 0;
  display: none;
}
</style>
