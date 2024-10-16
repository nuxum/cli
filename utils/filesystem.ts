import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'fs';

interface IConfiguration {
  name: string;
  version: string;
  source: string;
  template: 'typescript' | 'javascript';
}

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

export function getConfig(path: string): IConfiguration | null {
  if (!existsSync(path + '/nuxum.config.json')) return null;

  const config = readFileSync(path + '/nuxum.config.json', 'utf-8');
  return JSON.parse(config);
}
