export function escapeHtml(value: unknown): string {
  return String(value || '').replace(/[&<>"']/g, (char) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char] ?? char;
  });
}

export function sanitizeExcerpt(value: unknown): string {
  return escapeHtml(value)
    .replace(/&lt;mark&gt;/g, '<mark>')
    .replace(/&lt;\/mark&gt;/g, '</mark>');
}
