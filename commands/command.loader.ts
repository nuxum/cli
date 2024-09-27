import { Command } from 'commander';
import { createCommand } from './create.command';

export class CommandLoader {
  public static async loadCommands(program: Command): Promise<void> {
    program.addCommand(createCommand);

    program.on('command:*', () => {
      console.error(`Invalid command: ${program.args.join(' ')}`);
      console.log(`See --help for a list of available commands.`);
      process.exit(1);
    });
  }
}