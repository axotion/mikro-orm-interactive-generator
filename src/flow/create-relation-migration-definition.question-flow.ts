import {RelationFactor} from "../builder/relation-migration/factor/relation.factor";
import * as inquirer from "inquirer";

export class CreateRelationMigrationDefinitionQuestionFlow {

    async execute() : Promise<{tableName: string, fields: RelationFactor[]}> {

        const relations: RelationFactor[] = []

        const type = await inquirer.prompt([{
            message: 'Type of relation',
            type: 'input',
            name: 'relation_type'
        }])

        const sourceTable = await inquirer.prompt([{
            message: 'First table name (if many-to-one or one-to-one then it`s source table)',
            type: 'input',
            name: 'relation_source_table'
        }])

        const sourceTableField = await inquirer.prompt([{
            message: 'First table field (identifier, eg. id. If many-to-one or one-to-one then eg. userId)',
            type: 'input',
            name: 'relation_table_field'
        }])

        const targetTable = await inquirer.prompt([{
            message: 'Second table name (if many-to-one or one-to-one, then it`s destination table)',
            type: 'input',
            name: 'relation_target_table'
        }])

        const targetTableField = await inquirer.prompt([{
            message: 'Second table field (identifier, eg. id, if many-to-one or one-to-one then eg. id)',
            type: 'input',
            name: 'relation_target_field'
        }])

        return {
            tableName: '',
            fields: []
        }

    }
}