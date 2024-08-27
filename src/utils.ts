import { BlockEntity, BlockUUIDTuple } from '@logseq/libs/dist/LSPlugin.user';

/**
 * Retrieves the content of a block and its children recursively.
 * @param block - The Logseq block entity to process
 * @param depth - The current depth of recursion (used for indentation)
 * @returns Promise<string> - The content of the block and its children
 */
export async function getBlockContent(block: BlockEntity, depth: number = 0): Promise<string> {
  // Get the content of the current block
  let content = block.content || '';

  // If the block has children, process them recursively
  if (block.children && block.children.length > 0) {
    for (const child of block.children) {
      // Extract the UUID from the BlockUUIDTuple
      const childUUID = Array.isArray(child) ? child[1] : child;
      // Get the full child block data
      const childBlock = await logseq.Editor.getBlock(childUUID);
      if (childBlock) {
        // Recursively get content of child blocks
        const childContent = await getBlockContent(childBlock, depth + 1);
        // Add child content with proper indentation
        content += '\n' + childContent.split('\n').map(line => '  '.repeat(depth + 1) + line).join('\n');
      }
    }
  }

  // Trim whitespace for top-level blocks
  return depth === 0 ? content.trim() : content;
}

/**
 * Formats the response from RAGflow for insertion into Logseq.
 * @param response - The raw response string from RAGflow
 * @returns string - The formatted response
 */
export function formatResponse(response: string): string {
  if (!response) return '';
  let formatted = response.trim();
  // Ensure the response starts with a Markdown list item
  if (!formatted.startsWith('-') && !formatted.startsWith('*')) {
    formatted = '- ' + formatted;
  }
  // Convert any Markdown-style links back to Logseq-style links
  return convertMarkdownLinksToLogseq(formatted);
}

/**
 * Converts Logseq-style links to Markdown-style links.
 * @param content - The content containing Logseq-style links
 * @returns string - The content with Markdown-style links
 */
export function convertLogseqLinksToMarkdown(content: string): string {
  // Convert [[Page Name]] to [Page Name](Page Name)
  content = content.replace(/\[\[([^\]]+)\]\]/g, '[$1]($1)');
  // Convert #Tag to [#Tag](Tag)
  content = content.replace(/#(\w+)/g, '[#$1]($1)');
  return content;
}

/**
 * Converts Markdown-style links back to Logseq-style links.
 * @param content - The content containing Markdown-style links
 * @returns string - The content with Logseq-style links
 */
export function convertMarkdownLinksToLogseq(content: string): string {
  return content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, link) => {
    if (text === link) {
      // Convert [Page Name](Page Name) back to [[Page Name]]
      return `[[${text}]]`;
    } else if (text.startsWith('#') && text.slice(1) === link) {
      // Keep #Tag as is
      return text;
    }
    // If it's not a Logseq-style link, keep it as is
    return match;
  });
}

