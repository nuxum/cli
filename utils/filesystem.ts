import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';

export function isDirEmpty(dir: string): boolean {
  return readdirSync(dir).length === 0;
}

export function cloneDirectory(source: string, destination: string): void {
  const entries = readdirSync(source, { withFileTypes: true });

  if (!existsSync(destination)) mkdirSync(destination);

  for (const entry of entries) {
    const sourcePath = `${source}/${entry.name}`;
    const destinationPath = `${destination}/${entry.name}`;

    entry.isDirectory() ? cloneDirectory(sourcePath, destinationPath) : copyFileSync(sourcePath, destinationPath);
  }
}