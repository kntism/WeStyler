# WeStyler

WeStyler 是一个 Markdown 到 HTML 的实时预览和样式转换工具。它允许用户编写 Markdown，应用自定义 CSS 主题，并实时预览最终效果。核心功能是将 Markdown 内容转换为包含内联样式的 HTML，方便直接复制粘贴到微信公众号等富文本编辑器中，确保格式一致。

## 功能特性

- **实时编辑与预览**: 在左侧编辑 Markdown，中间编辑 CSS，右侧即时查看 HTML 预览。
- **动态主题加载**:
    - 从 `theme` 目录加载 `.css` 文件，轻松切换和预览不同样式主题。
    - 通过“加载主题”下拉菜单的“从本地加载...”选项，可以加载用户本地的任意 `.css` 文件。
- **示例内容加载**:
    - 从 `content` 目录加载 `.md` 文件，快速开始编辑。
    - 通过“加载文件”下拉菜单的“从本地加载...”选项，可以加载用户本地的任意 `.md` 文件。
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

## 未来开发计划

以下是一些可以考虑的未来改进方向：

1.  **分辨率切换功能**
    *   实现一个下拉菜单或按钮组，允许用户选择不同的预览容器尺寸（如 375px, 414px 等），以模拟不同设备的显示效果。

2.  **增强主题管理**
    *   为主题 CSS 文件添加元数据（如主题名称、作者），并在下拉菜单中显示更友好的名称。
    *   提供主题预览功能。
    *   允许用户上传或创建自定义主题。

3.  **优化内容加载与历史记录**
    *   记住用户最近加载过的 Markdown 文件和主题文件，方便快速切换。
    *   实现自动保存草稿功能，防止意外丢失内容。

4.  **改进复制功能**
    *   提供更明确的复制成功视觉反馈（如按钮状态变化）。
    *   提供选项让用户选择复制纯 HTML 或带容器的完整 HTML 片段。

5.  **增强编辑器功能**
    *   添加 Markdown 快捷工具栏，提供常用语法的快捷插入按钮。
    *   支持通过拖放 `.md` 文件到编辑区域来加载内容。

6.  **性能与可访问性**
    *   对大型文件的渲染进行防抖优化。
    *   增强应用的可访问性 (Accessibility)，确保对辅助技术友好。

7.  **开发者体验**
    *   随着功能增加，考虑将 `MarkdownEditor.vue` 拆分为更小的组件。
    *   考虑引入 TypeScript 来增强代码健壮性。