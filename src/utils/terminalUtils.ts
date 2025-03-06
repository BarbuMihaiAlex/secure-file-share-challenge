
// Terminal utility functions

export function formatCommandOutput(output: string): string {
  return output.replace(/\n/g, '<br>');
}

export function simulateTyping(
  text: string, 
  element: HTMLElement, 
  speed: number = 50
): Promise<void> {
  return new Promise((resolve) => {
    let i = 0;
    element.textContent = '';
    
    const interval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

export function formatError(error: string): string {
  return `Error: ${error}`;
}

export function formatSuccess(message: string): string {
  return message;
}

// Add timestamps to output
export function getTimestamp(): string {
  const now = new Date();
  return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
}
