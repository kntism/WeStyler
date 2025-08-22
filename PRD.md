# 项目说明

项目名称：WeStyler
项目主要功能：将 Markdown 文件转换为带行内样式的 HTML 预览内容，方便直接粘贴到公众号等富文本编辑器中。

## 项目功能

-   **Markdown 编辑区 (左侧)**:
    -   实时 Markdown 编辑器，支持语法高亮。
    -   **加载文件**: 提供下拉菜单，可从 `content` 目录加载 `.md` 文件。
    -   编辑器内容变化时，右侧预览区会实时更新。
-   **预览区 (右侧)**:
    -   实时渲染 Markdown 内容为 HTML。
    -   **主题切换**: 提供下拉菜单，可从 `theme` 目录加载 `.css` 文件，动态改变预览样式。
    -   **复制内容**: 提供按钮，一键复制渲染后的 HTML 内容（包含内联样式），可直接粘贴到富文本编辑器。
-   **样式与主题**:
    -   预览样式通过 CSS 文件定义。
    -   支持深色主题，并会自动调整预览容器的边框和背景色以匹配主题。

## 目录结构

-   `content/`: 存放可供加载的 Markdown 示例文件 (`.md`)。
-   `public/`: 静态资源目录。
    -   `westyler.svg`: 项目 Logo。
-   `src/`: 项目源码目录。
    -   `components/`: Vue 组件。
        -   `MarkdownEditor.vue`: 核心编辑器和预览组件。
    -   `App.vue`: 应用入口组件。
    -   `main.js`: 项目主文件。
-   `theme/`: 存放可供加载的 CSS 主题文件 (`.css`)。
-   `index.html`: 项目入口 HTML 文件。
-   `vite.config.js`: Vite 构建工具配置文件。
-   `package.json`: 项目依赖和脚本配置文件。
