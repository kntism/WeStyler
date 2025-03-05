<script setup>
import { ref } from "vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import exampleContent from "../assets/example.md?raw";
import markdownPreviewStyle from "../assets/markdown-preview.css?raw";

// Markdown解析器，设置代码高亮
const md = new MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ""; // 如果没有指定语言或语言不支持，则返回空字符串
  },
});

// 自定义插件，在<li>标签内部添加<section>标签
const listItemSectionPlugin = (md) => {
  // 保存原始的 list_item_open 渲染函数
  const originalListItemOpen =
    md.renderer.rules.list_item_open ||
    ((tokens, idx, options, env, self) =>
      self.renderToken(tokens, idx, options));
  const originalListItemClose =
    md.renderer.rules.list_item_close ||
    ((tokens, idx, options, env, self) =>
      self.renderToken(tokens, idx, options));

  // 重写 list_item_open
  md.renderer.rules.list_item_open = (tokens, idx, options, env, self) => {
    // 渲染默认的 <li> 开始标签
    const result = originalListItemOpen(tokens, idx, options, env, self);
    // 在 <li> 内部开头添加 <section>
    return result.replace("<li>", "<li><section>");
  };

  // 重写 list_item_close
  md.renderer.rules.list_item_close = (tokens, idx, options, env, self) => {
    // 渲染默认的 </li> 结束标签
    const result = originalListItemClose(tokens, idx, options, env, self);
    // 在 <li> 内部末尾添加 </section>
    return result.replace("</li>", "</section></li>");
  };
};

// 使用自定义插件
md.use(listItemSectionPlugin);

// 新增插件：识别链接并在文章底部生成引用
const linkReferencesPlugin = (md) => {
  // 将 links 数组定义为局部变量，并提供一个函数用于重置
  let links = [];

  const resetLinks = () => {
    links = [];
  };

  // 保存原始的 link_open 渲染函数
  const originalLinkOpen =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, env, self) =>
      self.renderToken(tokens, idx, options));

  // 重写 link_open
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet("href");
    if (href) {
      const id = links.length + 1;
      links.push({ id, href, title: tokens[idx + 1].content });
      tokens[idx].attrJoin("class", "reference");
      tokens[idx].attrSet("id", `ref-${id}`);
    }
    // 将 <a> 替换为 <span>
    return originalLinkOpen(tokens, idx, options, env, self).replace(
      "<a",
      "<span"
    );
  };

  // 保存原始的 link_close 渲染函数
  const originalLinkClose =
    md.renderer.rules.link_close ||
    ((tokens, idx, options, env, self) =>
      self.renderToken(tokens, idx, options));

  // 重写 link_close
  md.renderer.rules.link_close = (tokens, idx, options, env, self) => {
    const result = originalLinkClose(tokens, idx, options, env, self);
    const link = links[links.length - 1];
    if (link) {
      return result.replace("</a>", "</span>") + `<sup>[${link.id}]</sup>`;
    }
    // 将 </a> 替换为 </span>
    return result.replace("</a>", "</span>");
  };

  // 保存原始的 paragraph_close 渲染函数
  const originalParagraphClose =
    md.renderer.rules.paragraph_close ||
    ((tokens, idx, options, env, self) =>
      self.renderToken(tokens, idx, options));

  // 重写 paragraph_close
  md.renderer.rules.paragraph_close = (tokens, idx, options, env, self) => {
    const result = originalParagraphClose(tokens, idx, options, env, self);
    if (idx === tokens.length - 1) {
      if (links.length > 0) {
        let references = "<section class='reference-list'><h4>参考链接</h4>";
        links.forEach((link) => {
          references += `<p id='fn-${link.id}'>[${link.id}] ${link.title}：<em>${link.href}</em></p>`;
        });
        references += "</section>";
        // 渲染完成后重置 links 数组
        resetLinks();
        return result + references;
      }
    }
    return result;
  };
};

// 使用自定义插件
md.use(linkReferencesPlugin);

// 默认的Markdown内容
const markdownContent = ref(exampleContent);

// 从外部文件导入的样式内容
const styleContent = ref(markdownPreviewStyle);

const htmlContent = ref("");
const styleElement = ref(null);

// 更新预览函数，确保每次渲染时重置 links
const updatePreview = () => {
  // 重置 links 数组
  if (md.renderer.rules.paragraph_close.resetLinks) {
    md.renderer.rules.paragraph_close.resetLinks();
  }
  // 更新HTML内容
  htmlContent.value = md.render(markdownContent.value);

  // 更新样式
  if (!styleElement.value) {
    styleElement.value = document.createElement("style");
    document.head.appendChild(styleElement.value);
  }
  styleElement.value.textContent = styleContent.value;
};

// 初始化预览
updatePreview();

const copyPreviewContent = () => {
  try {
    const previewContent = document.querySelector(".preview-content");

    if (!previewContent) {
      throw new Error("无法找到预览内容元素");
    }

    const selection = window.getSelection();
    const range = document.createRange();

    // 记录当前选区
    const originalSelection =
      selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    // 清除当前选区
    selection.removeAllRanges();

    // 选中预览内容
    range.selectNodeContents(previewContent);
    selection.addRange(range);

    // 执行复制命令
    const successful = document.execCommand("copy");

    // 清除选区
    selection.removeAllRanges();

    // 恢复原选区
    if (originalSelection) {
      selection.addRange(originalSelection);
    }

    showMessage(successful);
  } catch (err) {
    console.error("复制失败", err);
    showMessage(false, "复制失败，请重试");
  }
};

const showMessage = (successful, customMessage = null) => {
  const messageConfig = {
    type: successful ? "success" : "error",
    duration: 2000,
    message: customMessage || (successful ? "复制成功！" : "复制失败，请重试"),
  };

  ElMessage(messageConfig);
};
</script>

<template>
  <div class="editor-container">
    <el-container>
      <el-aside width="40%" class="editor-section">
        <div class="section-title">Markdown 编辑器</div>
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
          公众号预览
          <el-button
            class="copy-button"
            type="primary"
            size="small"
            @click="copyPreviewContent"
          >
            复制
          </el-button>
        </div>
        <div class="preview-content">
          <section class="markdown-body" v-html="htmlContent"></section>
        </div>
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
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  overflow-y: auto;
  padding: 25px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-textarea__inner) {
  font-family: source-code-pro, Menlo, Courier New, Consolas, monospace;
  background-color: #f5f5f5;
  color: #202020;
  height: 100% !important;
  font-family: monospace;
  font-size: 14px;
  line-height: 25px;
  padding: 20px;
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
