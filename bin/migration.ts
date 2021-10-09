import { Command, program } from "commander"
import * as inquirer from 'inquirer'
import {CommandBus} from "../src/bus/command-bus";
import {RegisteredCommands} from "../src/command/commands";
import {CreateMigrationFileHandler} from "../src/handler/create-migration-file.handler";
import {CreateMigrationDefinitionQuestionFlow} from "../src/flow/create-migration-definition.question-flow";
import {CreateMigrationFileCommand} from "../src/command/create-migration-file.command";
import {MySQLType} from "../src/type/mysql.types";

const bootstrap = async () => {

    // 2 base arguments, path to node and path to this script, so therefore there are no flag arguments
    if(process.argv.length === 2) {
        program.help()
        return;
    }

    const CLICommand = new Command();
    CLICommand.option('-c --create', 'Create new migration with current timestamp')
    CLICommand.parse(process.argv)

    inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

    const commandBus = new CommandBus([new CreateMigrationFileHandler()])

    for (const CLICommandKey of Object.keys(CLICommand.opts())) {
        switch (CLICommandKey) {
            case RegisteredCommands.create:
                //TODO: Support more types based on some kind of config
                const flowResult = await (new CreateMigrationDefinitionQuestionFlow).execute({
                    types: MySQLType.types,
                    autoincrementKey: MySQLType.autoincrementKey
                })
                const createMigrationFileCommand = new CreateMigrationFileCommand(`Migration${new Date().getTime().toString()}`, flowResult.tableName, flowResult.fields)
                await commandBus.dispatch(createMigrationFileCommand)
        }
    }
}

bootstrap()