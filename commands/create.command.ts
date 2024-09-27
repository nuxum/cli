import { Command } from 'commander';
import { exec } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { cloneDirectory, isDirEmpty } from '../utils/filesystem';
import { join } from 'path';

const createCommand = new Command();

createCommand
  .name('create')
  .alias('c')
  .description('Create a new Nuxum project')
  .argument('<name>', 'Name of the project')
  .option('-t, --template <template>', 'Template to use', 'typescript')
  .option('-d, --directory <directory>', 'Directory to create the project in', '.')
  .option('-g, --git', 'Initialize a Git repository', false)
  .option('-p, --package-manager <package-manager>', 'Package manager to use', 'npm')
  .option('-s, --skip-install', 'Skip installing dependencies', false)
  .action((name, options) => {
    console.log('Creating a new Nuxum project...');

    const { template, directory, git, packageManager } = options;

    const templateValid = ['ts', 'js', 'typescript', 'javascript'].indexOf(template) !== -1;
    const packageManagerValid = ['npm', 'yarn', 'pnpm'].indexOf(packageManager) !== -1;

    if (!templateValid) {
      console.error('Invalid template. Please use either "typescript" or "javascript"');
      process.exit(1);
    }

    if (!packageManagerValid) {
      console.error('Invalid package manager. Please use either "npm", "yarn", or "pnpm"');
      process.exit(1);
    }

    createProject(name, template, directory, git, packageManager, options.skipInstall);
  });

async function executeShellCommand(command: string, cwd: string) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) reject(error);

      resolve(stdout);
    });
  });
};

async function createProject(name: string, template: string, directory: string, git: boolean, packageManager: string, skipInstall: boolean) {
  const projectPath = join(process.cwd(), `${directory}/${name}`);
  if (existsSync(projectPath) && !isDirEmpty(projectPath)) {
    console.error(`Directory ${projectPath} is not empty.`);
    process.exit(1);
  }

  console.log(`Creating project in ${projectPath}...`);
  const templatePath = join(__dirname, `../templates/${template}`);
  cloneDirectory(templatePath, projectPath);
  console.log('Project created successfully.');

  if (git) {
    console.log('Initializing Git repository...');
    await executeShellCommand('git init', projectPath);
    console.log('Git repository initialized.');
  } else {
    rmSync(join(projectPath, '.gitignore'));
  }

  if (!skipInstall) {
    console.log('Installing dependencies...');
    await executeShellCommand(`${packageManager} install`, projectPath);
    console.log('Dependencies installed.');
  }

  console.log('Project setup complete.');

  console.log(`\nTo get started, run the following commands:\n`);
  console.log(`  cd ${name}`);
  if (skipInstall) console.log(`  ${packageManager === 'yarn' ? 'yarn' : `${packageManager} install`}`);
  console.log(`  ${packageManager === 'yarn' ? 'yarn dev' : `${packageManager} run dev`}`);
};

export { createCommand };
