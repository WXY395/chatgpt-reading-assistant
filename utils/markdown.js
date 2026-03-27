/**
 * CRA Markdown — HTML-to-Markdown conversion for ChatGPT content
 *
 * Handles common elements: bold, italic, code, pre, links, headings, lists, paragraphs.
 */
window.CRAMarkdown = (() => {
  /**
   * Convert an HTML element tree to simple Markdown.
   * @param {HTMLElement} el - Root element containing HTML to convert
   * @returns {string} Markdown text
   */
  function htmlToSimpleMarkdown(el) {
    let md = '';
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        md += node.textContent;
        continue;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      const tag = node.tagName.toLowerCase();
      const inner = htmlToSimpleMarkdown(node);

      switch (tag) {
        case 'strong':
        case 'b':
          md += `**${inner}**`;
          break;
        case 'em':
        case 'i':
          md += `*${inner}*`;
          break;
        case 'code':
          if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') {
            md += inner;
          } else {
            md += `\`${inner}\``;
          }
          break;
        case 'pre': {
          const lang = node.querySelector('code')?.className?.match(/language-(\w+)/)?.[1] || '';
          md += `\n\`\`\`${lang}\n${inner}\n\`\`\`\n`;
          break;
        }
        case 'a':
          md += `[${inner}](${node.getAttribute('href') || ''})`;
          break;
        case 'h1': md += `\n# ${inner}\n`; break;
        case 'h2': md += `\n## ${inner}\n`; break;
        case 'h3': md += `\n### ${inner}\n`; break;
        case 'h4': md += `\n#### ${inner}\n`; break;
        case 'li':
          md += `- ${inner}\n`;
          break;
        case 'p':
          md += `${inner}\n\n`;
          break;
        case 'br':
          md += '\n';
          break;
        default:
          md += inner;
      }
    }
    return md.replace(/\n{3,}/g, '\n\n').trim();
  }

  return { htmlToSimpleMarkdown };
})();
