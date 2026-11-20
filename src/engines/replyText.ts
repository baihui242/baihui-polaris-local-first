function replaceAssistantDashInProseSegment(segment: string) {
  return segment.replace(/\s*[—–]\s*/g, '，');
}

export function normalizeAssistantVisiblePunctuation(content: string) {
  let inFence = false;
  let fenceChar: '`' | '~' | null = null;

  return content
    .split('\n')
    .map((line) => {
      const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);
      if (fenceMatch) {
        const currentFenceChar = fenceMatch[1][0] as '`' | '~';
        if (!inFence) {
          inFence = true;
          fenceChar = currentFenceChar;
        } else if (fenceChar === currentFenceChar) {
          inFence = false;
          fenceChar = null;
        }
        return line;
      }

      if (inFence) return line;

      const inlineCodePattern = /(`+)([\s\S]*?)\1/g;
      let result = '';
      let cursor = 0;
      let match: RegExpExecArray | null;

      while ((match = inlineCodePattern.exec(line)) !== null) {
        result += replaceAssistantDashInProseSegment(line.slice(cursor, match.index));
        result += match[0];
        cursor = match.index + match[0].length;
      }

      return result + replaceAssistantDashInProseSegment(line.slice(cursor));
    })
    .join('\n');
}

export function normalizeReplySpacing(content: string) {
  return content.replace(/\n{3,}/g, '\n\n').trim();
}
