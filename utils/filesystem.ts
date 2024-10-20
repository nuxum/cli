import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';

export interface IConfiguration {
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

export function listModules(dir: string, config: IConfiguration): string[] {
  const modulesPath = `${dir}/${config.source}/modules`;
  return readdirSync(modulesPath).filter(file => file.endsWith('.module.ts'));
}

export function addControllerToModule(modulePath: string, controllerName: string): void {
  const moduleContent = readFileSync(modulePath, 'utf-8');
  const lines = moduleContent.split('\n');

  const importLine = lines.findIndex(line => line.includes('import'));
  const lastImportLine = lines.slice(importLine).findIndex(line => !line.includes('import')) + importLine;

  lines.splice(lastImportLine, 0, `import { ${controllerName} } from '../controllers/${controllerName.toLowerCase().replace('controller', '')}.controller';`);

  const moduleLine = lines.findIndex(line => line.includes('@Module'));
  const lastModuleLine = lines.slice(moduleLine).findIndex(line => !line.includes('@Module')) + moduleLine;

  const controllersLine = lines.findIndex(line => line.includes('controllers:'));
  if (controllersLine === -1) {
    lines.splice(lastModuleLine, 0, '  controllers: [');
    lines.splice(lastModuleLine + 1, 0, `    ${controllerName},`);
    lines.splice(lastModuleLine + 2, 0, '  ],');
  } else {
    const lastControllerLine = lines.slice(controllersLine).findIndex(line => !line.includes(controllerName)) + controllersLine;
    lines.splice(lastControllerLine + 1, 0, `    ${controllerName},`);
  }

  writeFileSync(modulePath, lines.join('\n'));
}

export function addModuleToApp(appPath: string, moduleName: string): void {
  const appContent = readFileSync(appPath, 'utf-8');
  const lines = appContent.split('\n');

  const importLine = lines.findIndex(line => line.includes('import'));
  const lastImportLine = lines.slice(importLine).findIndex(line => !line.includes('import')) + importLine;

  lines.splice(lastImportLine, 0, `import { ${moduleName.charAt(0).toUpperCase()}${moduleName.slice(1)}Module } from './modules/${moduleName.toLowerCase()}.module';`);

  const modulesLine = lines.findIndex(line => line.includes('modules:'));
  if (modulesLine === -1) {
    lines.splice(lastImportLine + 1, 0, '  modules: [');
    lines.splice(lastImportLine + 2, 0, `    ${moduleName.charAt(0).toUpperCase()}${moduleName.slice(1)}Module,`);
    lines.splice(lastImportLine + 3, 0, '  ],');
  } else {
    const lastModuleLine = lines.slice(modulesLine).findIndex(line => !line.includes(moduleName)) + modulesLine;
    lines.splice(lastModuleLine + 1, 0, `    ${moduleName.charAt(0).toUpperCase()}${moduleName.slice(1)}Module,`);
  }

  writeFileSync(appPath, lines.join('\n'));
}

export function generateControllerFile(controllerPath: string, controllerName: string, methods: string[], route: string): void {
  const content = `import { Controller, ${methods.join(', ')} } from '@nuxum/core';
import { Request, Response } from 'express';

@Controller('${route}')
export class ${controllerName} {
  ${methods.map(method => `
  @${method}()
  public ${method.toLowerCase()}(req: Request, res: Response) {
    res.send('Hello World!');
  }`).join('')}
}`;

  writeFileSync(controllerPath, content);

  console.log(`Controller generated at ${controllerPath}`);
}

export function generateModuleFile(modulePath: string, moduleName: string): void {
  const content = `import { Module } from '@nuxum/core';

@Module({
  controllers: [],  
})
export class ${moduleName.charAt(0).toUpperCase()}${moduleName.slice(1)}Module { }`;

  writeFileSync(modulePath, content);
}
