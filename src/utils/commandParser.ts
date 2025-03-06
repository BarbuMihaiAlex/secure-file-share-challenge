
// This utility will be used for parsing and validating terminal commands
// when we want more advanced command handling in the future

export interface CommandParseResult {
  valid: boolean;
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
  error?: string;
}

export function parseCommand(input: string): CommandParseResult {
  if (!input || !input.trim()) {
    return {
      valid: false,
      command: '',
      args: [],
      flags: {},
      error: 'Empty command'
    };
  }

  const parts = input.trim().split(/\s+/);
  const command = parts[0];
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  // Simple parser for demonstration
  // In a real implementation, this would handle quotes, escapes, etc.
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    
    if (part.startsWith('--')) {
      // Long flag
      const flagName = part.substring(2);
      if (i + 1 < parts.length && !parts[i + 1].startsWith('-')) {
        flags[flagName] = parts[i + 1];
        i++;
      } else {
        flags[flagName] = true;
      }
    } else if (part.startsWith('-')) {
      // Short flag
      const flagName = part.substring(1);
      if (i + 1 < parts.length && !parts[i + 1].startsWith('-')) {
        flags[flagName] = parts[i + 1];
        i++;
      } else {
        flags[flagName] = true;
      }
    } else {
      // Argument
      args.push(part);
    }
  }

  return {
    valid: true,
    command,
    args,
    flags
  };
}

export function validateCommand(input: string, expectedCommand: string): boolean {
  const parsed = parseCommand(input);
  return parsed.valid && parsed.command === expectedCommand;
}
