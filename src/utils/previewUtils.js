/**
 * 更新预览函数
 * @param {MarkdownIt} md MarkdownIt 实例
 * @param {string} markdownContent Markdown 内容
 * @param {string} styleContent 样式内容
 * @param {HTMLElement} styleElement 样式元素引用
 * @returns {{htmlContent: string, styleElement: HTMLElement}} 更新后的 HTML 内容和样式元素
 */
export function updatePreview(md, markdownContent, styleContent, styleElement) {
  // 重置 links 数组
  if (md.renderer.rules.paragraph_close.resetLinks) {
    md.renderer.rules.paragraph_close.resetLinks();
  }
  
  // 更新 HTML 内容
  const htmlContent = md.render(markdownContent);

  // 更新样式
  let element = styleElement;
  if (!element) {
    element = document.createElement("style");
    document.head.appendChild(element);
  }
  element.textContent = styleContent;
  
  return { htmlContent, styleElement: element };
}