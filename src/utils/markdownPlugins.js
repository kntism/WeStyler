import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

/**
 * 创建并配置 MarkdownIt 实例
 * @returns {MarkdownIt} 配置好的 MarkdownIt 实例
 */
export function createMarkdownInstance() {
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

  // 使用自定义插件
  md.use(listItemSectionPlugin);
  md.use(linkReferencesPlugin);

  return md;
}

/**
 * 自定义插件，在<li>标签内部添加<section>标签
 * @param {MarkdownIt} md MarkdownIt 实例
 */
export function listItemSectionPlugin(md) {
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
}

/**
 * 自定义插件：识别链接并在文章底部生成引用
 * @param {MarkdownIt} md MarkdownIt 实例
 */
export function linkReferencesPlugin(md) {
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

  // 将 resetLinks 函数挂载到 paragraph_close 规则上，以便外部可以调用
  md.renderer.rules.paragraph_close.resetLinks = resetLinks;
}