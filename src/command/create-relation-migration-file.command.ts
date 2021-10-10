import {CommandInterface} from "./command.interface";
import {FieldFactor} from "../builder/field-migration/factor/field.factor";

export class CreateRelationMigrationFileCommand implements CommandInterface {
    //
    // public tableName: string;
    //
    // public className: string;
    //
    // public relations: FieldFactor[];
    //
    // constructor(className: string, tableName: string, fieldFactors: FieldFactor[]) {
    //     this.className = className;
    //     this.fields = fieldFactors;
    //     this.tableName = tableName;
    // }

    getName(): string {
        return this.constructor.name;
    }

}