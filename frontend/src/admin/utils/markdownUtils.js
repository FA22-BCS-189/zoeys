// Utility function to render markdown to HTML
export const renderMarkdown = (text) => {
  if (!text) return '';
  
  let html = text;
  
  // Escape HTML tags first (except our allowed ones)
  html = html.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/&lt;u&gt;/g, '<u>')
             .replace(/&lt;\/u&gt;/g, '</u>');
  
  // Headings (must come before bold)
  html = html.replace(/^### (.+?)$/gm, '<h3 class="text-base font-bold text-charcoal mt-2 mb-1">$1</h3>');
  html = html.replace(/^## (.+?)$/gm, '<h2 class="text-lg font-bold text-charcoal mt-3 mb-2">$1</h2>');
  html = html.replace(/^# (.+?)$/gm, '<h1 class="text-xl font-bold text-charcoal mt-4 mb-2">$1</h1>');
  
  // Bold: **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>');
  
  // Italic: *text* or _text_ (but not in URLs or already processed)
  html = html.replace(/(?<!\*)\*([^\*]+?)\*(?!\*)/g, '<em class="italic">$1</em>');
  html = html.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em class="italic">$1</em>');
  
  // Strikethrough: ~~text~~
  html = html.replace(/~~(.+?)~~/g, '<del class="line-through">$1</del>');
  
  // Code: `code`
  html = html.replace(/`(.+?)`/g, '<code class="bg-amber-100 text-rose-600 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
  
  // Links: [text](url)
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-emerald-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  // Lists: - item or * item
  html = html.replace(/^[\-\*] (.+?)(<br>|$)/gm, '<li class="ml-4 list-disc">$1</li>');
  
  // Wrap consecutive list items in ul
  html = html.replace(/(<li class="ml-4 list-disc">.*?<\/li>)+/g, (match) => {
    return '<ul class="list-disc ml-4 my-2">' + match + '</ul>';
  });
  
  return html;
};