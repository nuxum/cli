import { Command } from 'commander';
import { getConfig } from '../utils/filesystem';

const generateCommand = new Command();

generateCommand
  .name('generate')
  .alias('g')
  .description('Generate a new file')
  .argument('<type>', 'Type of file to generate')
  .argument('<name>', 'Name of the file')
  .action((type, name) => {
    const config = getConfig(process.cwd());
    if (!config) {
      console.error('No Nuxum configuration file found.');
      process.exit(1);
    }

    const types = ['controller', 'module'];
    if (!types.includes(type)) {
      console.error('Invalid type. Please use either "controller" or "module"');
      process.exit(1);
    }

    console.log(`Generating a new ${type}...`);

    console.log(config);
  });

export { generateCommand };
