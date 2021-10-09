import {CommandHandlerInterface} from "./command-handler.interface";
import {CommandInterface} from "../command/command.interface";
import {CreateMigrationFileCommand} from "../command/create-migration-file.command";
import {MigrationFileBuilder} from "../builder/migration/migration-file.builder";
import {LocalSaver} from "../saver/local.saver";

export class CreateMigrationFileHandler implements CommandHandlerInterface {

    private migrationFileBuilder : MigrationFileBuilder

    private localSaver: LocalSaver

    constructor() {
        this.migrationFileBuilder = new MigrationFileBuilder()
        this.localSaver = new LocalSaver()
    }

    isEligible(command: CommandInterface): boolean {
        return command instanceof CreateMigrationFileCommand
    }

    handle(command: CommandInterface): Promise<void> | void {

        this.migrationFileBuilder.setClassName((command as CreateMigrationFileCommand).className)
        this.migrationFileBuilder.setTableName((command as CreateMigrationFileCommand).tableName)

        for(const field of (command as CreateMigrationFileCommand).fields) {
            this.migrationFileBuilder.addField(field)
        }

        const migrationContent = this.migrationFileBuilder.build()
        this.localSaver.save((command as CreateMigrationFileCommand).className, migrationContent)


    }

}