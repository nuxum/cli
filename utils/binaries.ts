import { existsSync } from 'fs';
import { join, posix } from 'path';
import { CommandLoader } from '../commands/command.loader';

const localBinarySegments = [process.cwd(), 'node_modules', '@nuxum', 'cli'];

export function localBinaryExists(): boolean {
  return existsSync(join(...localBinarySegments));
}

export function loadLocalBinaryCommands(): typeof CommandLoader {
  const commandsFile = require(posix.join(...localBinarySegments, 'commands'));
  return commandsFile.CommandLoader;
}