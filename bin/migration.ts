#!/usr/bin/env node
import { Command, program } from "commander"
import * as inquirer from 'inquirer'
import {CommandBus} from "../src/bus/command-bus";
import {RegisteredCommands} from "../src/command/commands";
import {CreateFieldMigrationFileHandler} from "../src/handler/create-field-migration-file.handler";
import {CreateFieldMigrationDefinitionQuestionFlow} from "../src/flow/create-field-migration-definition.question-flow";
import {CreateFieldMigrationFileCommand} from "../src/command/create-field-migration-file.command";
import {MySQLType} from "../src/type/mysql.types";
import {CreateRelationMigrationDefinitionQuestionFlow} from "../src/flow/create-relation-migration-definition.question-flow";

const bootstrap = async () => {

    // 2 base arguments, path to node and path to this script, so therefore there are no flag arguments
    if(process.argv.length === 2) {
        program.help()
        return;
    }

    const CLICommand = new Command();
    CLICommand.option('-cf', 'create new field-migration with current timestamp')
    CLICommand.option('-cr', 'create new relation-migration with current timestamp')
    CLICommand.parse(process.argv)

    inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

    const commandBus = new CommandBus([new CreateFieldMigrationFileHandler()])

    for (const CLICommandKey of Object.keys(CLICommand.opts())) {
        console.log(CLICommandKey)
        switch (CLICommandKey) {
            case RegisteredCommands.createFieldMigration:
                //TODO: Support more types based on some kind of config or flag
                const createFieldMigrationFlowResult = await (new CreateFieldMigrationDefinitionQuestionFlow).execute({
                    types: MySQLType.types,
                    autoincrementKey: MySQLType.autoincrementKey
                })
                const createMigrationFileCommand = new CreateFieldMigrationFileCommand(`Migration${new Date().getTime().toString()}`, createFieldMigrationFlowResult.tableName, createFieldMigrationFlowResult.fields)
                await commandBus.dispatch(createMigrationFileCommand)
                break;
            case RegisteredCommands.createRelationMigration:
                const createRelationMigrationFlowResult = await (new CreateRelationMigrationDefinitionQuestionFlow()).execute()
        }
    }
}

bootstrap()