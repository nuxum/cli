import { Command } from 'commander';
import { addControllerToModule, addModuleToApp, generateControllerFile, generateModuleFile, getConfig, IConfiguration, listModules } from '../utils/filesystem';
import inquirer from 'inquirer';
import { join } from 'path';

const generateCommand = new Command();

generateCommand
  .name('generate')
  .alias('g')
  .description('Generate a new controller or module')
  .argument('<type>', 'Type of file to generate')
  .argument('<name>', 'Name of the file')
  .option('-sm, --skip-module', 'Skip module selection', false)
  .option('-sa, --skip-app', 'Skip app module addition', false)
  .action((type, name, options) => {
    const config = getConfig(process.cwd());
    if (!config) {
      console.error('No Nuxum configuration file found.');
      process.exit(1);
    }

    const types = ['controller', 'module', 'c', 'm'];
    if (!types.includes(type)) {
      console.error('Invalid type. Please use either "controller" or "module"');
      process.exit(1);
    }

    switch (type) {
      case 'controller':
      case 'c':
        generateController(name, config, options.skipModule);
        break;
      case 'module':
      case 'm':
        generateModule(name, config);
        break;
    }
  });

function generateController(name: string, config: IConfiguration, skipModule = false) {
  const methods = ['Get', 'Post', 'Put', 'Delete', 'Patch'];
  const modules = listModules(process.cwd(), config);

  inquirer.prompt([
    {
      type: 'checkbox',
      name: 'method',
      message: 'Select a method',
      choices: methods,
    }, {
      type: 'input',
      name: 'route',
      message: 'Enter a route',
      default: `/${name.toLowerCase()}`,
    }, {
      type: 'list',
      name: 'module',
      message: 'Select a module',
      choices: modules,
      when: () => !skipModule,
    }
  ]).then((answers) => {
    console.log(`Generating controller ${name} with method(s) ${answers.method} for route ${answers.route}...`);

    const controllerPath = join(
      process.cwd(),
      config.source,
      'controllers',
      `${name}.controller.${config.template === 'typescript' ? 'ts' : 'js'}`
    );
    const controllerName = `${name.charAt(0).toUpperCase()}${name.slice(1)}Controller`;

    generateControllerFile(controllerPath, controllerName, answers.method, answers.route);

    if (!skipModule) {
      const modulePath = join(process.cwd(), config.source, 'modules', answers.module);
      addControllerToModule(modulePath, controllerName);
    }

    console.log('Controller generated successfully.');
  }).catch((error) => {
    console.error('An error occurred:', error);
  });
}

function generateModule(name: string, config: IConfiguration, skipApp = false) {
  console.log(`Generating module ${name}...`);

  const modulePath = join(process.cwd(), config.source, 'modules', name);
  generateModuleFile(modulePath, name);

  if (!skipApp) {
    const appPath = join(process.cwd(), config.source, 'index.ts');
    addModuleToApp(appPath, name);
  }

  console.log('Module generated successfully.');
}

export { generateCommand };
