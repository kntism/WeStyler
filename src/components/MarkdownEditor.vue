<script setup>
import { ref } from 'vue'
import MarkdownIt from 'markdown-it'
import exampleContent from '../assets/example.md?raw'
import markdownPreviewStyle from '../assets/markdown-preview.css?raw'

const md = new MarkdownIt()

// 默认的Markdown内容
const markdownContent = ref(exampleContent)

// 从外部文件导入的样式内容
const styleContent = ref(markdownPreviewStyle)

const htmlContent = ref('')
const styleElement = ref(null)

const updatePreview = () => {
  // 更新HTML内容
  htmlContent.value = md.render(markdownContent.value)
  
  // 更新样式
  if (!styleElement.value) {
    styleElement.value = document.createElement('style')
    document.head.appendChild(styleElement.value)
  }
  styleElement.value.textContent = styleContent.value
}

// 初始化预览
updatePreview()

const copyPreviewContent = () => {
  try {
    const previewContent = document.querySelector('.preview-content')
    const selection = window.getSelection()
    const range = document.createRange()
    
    // 清除当前选区
    selection.removeAllRanges()
    
    // 选中预览内容
    range.selectNodeContents(previewContent)
    selection.addRange(range)
    
    // 执行复制命令
    const successful = document.execCommand('copy')
    
    // 清除选区
    selection.removeAllRanges()
    
    if (successful) {
      ElMessage({
        message: '复制成功！',
        type: 'success',
        duration: 2000
      })
    } else {
      ElMessage({
        message: '复制失败，请重试',
        type: 'error',
        duration: 2000
      })
    }
  } catch (err) {
    console.error('复制失败：', err)
    ElMessage({
      message: '复制失败，请重试',
      type: 'error',
      duration: 2000
    })
  }
}
</script>

<template>
  <div class="editor-container">
    <el-container>
      <el-aside width="40%" class="editor-section">
        <div class="section-title">Markdown编辑器</div>
        <el-input
          v-model="markdownContent"
          type="textarea"
          class="full-height-textarea"
          placeholder="请输入Markdown内容"
          @input="updatePreview"
        />
      </el-aside>
      <el-aside width="30%" class="style-section">
        <div class="section-title">样式编辑器</div>
        <el-input
          v-model="styleContent"
          type="textarea"
          class="full-height-textarea"
          placeholder="请输入CSS样式"
          @input="updatePreview"
        />
      </el-aside>
      <el-aside width="414px" class="preview-section">
        <div class="section-title">
          预览
          <el-button
            class="copy-button"
            type="primary"
            size="small"
            @click="copyPreviewContent"
          >
            复制
          </el-button>
        </div>
        <div class="markdown-body preview-content" v-html="htmlContent"></div>
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

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copy-button {
  margin-left: auto;
}

.editor-section,
.style-section {
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-section {
  display: flex;
  flex-direction: column;
  padding-right: 20px;
  height: 100%;
}

.preview-content {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  background-color: white;
  overflow-y: auto;
}

:deep(.el-textarea__inner) {
  height: 100%!important;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.6;
}

:deep(.el-container) {
  height: 100%;
}

.full-height-textarea {
  height: calc(100% - 30px);
}

/* 隐藏滚动条样式 */
.preview-content::-webkit-scrollbar,
:deep(.el-textarea__inner::-webkit-scrollbar) {
  width: 0;
  height: 0;
  display: none;
}
</style>