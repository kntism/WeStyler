# WeStyler

WeStyler 是一个 Markdown 到 HTML 的实时预览和样式转换工具。它允许用户编写 Markdown，应用自定义 CSS 主题，并实时预览最终效果。核心功能是将 Markdown 内容转换为包含内联样式的 HTML，方便直接复制粘贴到微信公众号等富文本编辑器中，确保格式一致。

## 功能特性

- **实时编辑与预览**: 在左侧编辑 Markdown，右侧即时查看 HTML 预览。
- **动态主题加载**: 从 `theme` 目录加载 `.css` 文件，轻松切换和预览不同样式主题。
- **示例内容加载**: 从 `content` 目录加载 `.md` 文件，快速开始编辑。
- **一键复制**: 点击“复制内容”按钮，即可将带有内联样式的 HTML 复制到剪贴板，便于粘贴到其他平台。
- **代码高亮**: 支持代码块语法高亮显示。
- **深色主题适配**: 预览容器会根据选择的主题（如深色主题）自动调整边框和背景色。

## 目录结构

```
G:\projects\WeStyler\
├── content\          # Markdown 示例文件
│   ├── about.md
│   └── guide.md
├── public\           # 静态资源
│   └── westyler.svg
├── src\              # 源代码
│   ├── components\
│   │   └── MarkdownEditor.vue  # 核心编辑器组件
│   ├── App.vue       # 应用根组件
│   └── main.js       # 应用入口
├── theme\            # CSS 主题文件
│   ├── dark.css
│   └── default.css
├── index.html        # HTML 入口文件
├── package.json      # 项目依赖和脚本
├── PRD.md            # 产品需求文档
├── QWEN.md           # Qwen Code 开发记录
├── README.md         # 项目说明 (当前文件)
└── vite.config.js    # Vite 构建配置
```

## 技术栈

- [Vue 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [MarkdownIt](https://github.com/markdown-it/markdown-it)
- [Highlight.js](https://highlightjs.org/)
- [Element Plus](https://element-plus.org/)

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` (或 Vite 输出的其他地址) 查看应用。

### 构建生产版本

```bash
npm run build
```

构建的文件将输出到 `dist` 目录。

### 本地预览构建结果

```bash
npm run preview
```

## 使用说明

1.  在左侧的编辑器中输入或粘贴 Markdown 内容。
2.  通过顶部的“加载文件”下拉菜单，从 `content` 目录加载预设的 Markdown 示例。
3.  通过顶部的“加载主题”下拉菜单，从 `theme` 目录加载 CSS 主题文件来改变预览样式。
4.  在右侧预览区查看渲染效果。
5.  点击“复制内容”按钮，将生成的 HTML 复制到剪贴板。
6.  将复制的内容粘贴到微信公众号或其他富文本编辑器中。

## 自定义

- **添加 Markdown 示例**: 在 `content` 目录下添加 `.md` 文件。
- **添加 CSS 主题**: 在 `theme` 目录下添加 `.css` 文件。
- **修改核心逻辑**: 编辑 `src/components/MarkdownEditor.vue` 组件。