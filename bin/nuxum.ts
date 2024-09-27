#!/usr/bin/env node

import { Command } from 'commander';
import { localBinaryExists, loadLocalBinaryCommands } from '../utils/binaries';
import { CommandLoader } from '../commands';

const bootstrap = async () => {
  const program = new Command();

  program
    .name('nuxum')
    .description('A CLI tool for the Nuxum framework')
    .version(require('../package.json').version, '-v, --version', 'Output the current version of Nuxum')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output the help menu');

  if (localBinaryExists()) {
    const localCommands = loadLocalBinaryCommands();
    await localCommands.loadCommands(program);
  } else {
    await CommandLoader.loadCommands(program);
  }

  await program.parseAsync(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

bootstrap();