import {CommandHandlerInterface} from "./command-handler.interface";
import {CommandInterface} from "../command/command.interface";
import {CreateFieldMigrationFileCommand} from "../command/create-field-migration-file.command";
import {MigrationFileBuilder} from "../builder/field-migration/migration-file.builder";
import {LocalFilesystemSaver} from "../saver/local-filesystem.saver";

export class CreateFieldMigrationFileHandler implements CommandHandlerInterface {

    private migrationFileBuilder : MigrationFileBuilder

    private localSaver: LocalFilesystemSaver

    constructor() {
        this.migrationFileBuilder = new MigrationFileBuilder()
        this.localSaver = new LocalFilesystemSaver()
    }

    isEligible(command: CommandInterface): boolean {
        return command instanceof CreateFieldMigrationFileCommand
    }

    handle(command: CommandInterface): Promise<void> | void {

        this.migrationFileBuilder.setClassName((command as CreateFieldMigrationFileCommand).className)
        this.migrationFileBuilder.setTableName((command as CreateFieldMigrationFileCommand).tableName)

        for(const field of (command as CreateFieldMigrationFileCommand).fields) {
            this.migrationFileBuilder.addField(field)
        }

        const migrationContent = this.migrationFileBuilder.build()
        this.localSaver.save((command as CreateFieldMigrationFileCommand).className, migrationContent)


    }

}