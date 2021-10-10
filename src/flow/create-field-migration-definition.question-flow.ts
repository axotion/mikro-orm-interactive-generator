import {FieldFactor} from "../builder/field-migration/factor/field.factor";
import * as inquirer from "inquirer";
import {DBEngineTypes} from "../type/db-engine.type";

export class CreateFieldMigrationDefinitionQuestionFlow {

    async execute(types: DBEngineTypes) : Promise<{tableName: string, fields: FieldFactor[]}> {

        const fields : FieldFactor[] = []

        const tableName = await inquirer.prompt([{
            message: 'Table name',
            type: 'input',
            name: 'table_name'
        }])

        while (true) {

            let autoincrement = null

            const fieldType = await inquirer.prompt([{
                message: 'Field type',
                type: 'autocomplete',
                name: 'field_type',
                source: (answers : any, input : string) => {

                    if(!input || input === '') {
                        return types.types
                    }

                    const suggestedTypes = types.types.filter(type => {
                        return type.startsWith(input)
                    })

                    return [input, ...suggestedTypes]
                }
            }])


            if(fieldType['field_type'].includes(types.autoincrementKey)) {
                autoincrement = await inquirer.prompt([{
                    message: 'Is autoincrement?',
                    type: 'list',
                    name: 'is_autoincrement',
                    choices: [{
                        name: 'yes',
                        value: true,
                        key: 'Yes'
                    },{
                        name: 'no',
                        value: false,
                        key: 'No'
                    }]
                }])
            }

            const fieldName = await inquirer.prompt([{
                message: 'Field name',
                type: 'input',
                name: 'field_name'
            }])

            const defaultFieldValue = await inquirer.prompt([{
                message: 'Default value for field',
                type: 'input',
                name: 'field_default_value'
            }])

            const isUnique = await inquirer.prompt([{
                message: 'Is unique?',
                type: 'list',
                name: 'is_unique',
                choices: [{
                    name: 'yes',
                    value: true,
                    key: 'Yes'
                },{
                    name: 'no',
                    value: false,
                    key: 'No'
                }]
            }])

            const isNotNullable = await inquirer.prompt([{
                message: 'Is nullable?',
                type: 'list',
                name: 'is_nullable',
                choices: [{
                    name: 'yes',
                    value: true,
                    key: 'Yes'
                },{
                    name: 'no',
                    value: false,
                    key: 'No'
                }]
            }])

            const isPrimaryKey = await inquirer.prompt([{
                message: 'Is primary key?',
                type: 'list',
                name: 'is_primary_key',
                choices: [{
                    name: 'yes',
                    value: true,
                    key: 'Yes'
                },{
                    name: 'no',
                    value: false,
                    key: 'No'
                }]
            }])

            fields.push({
                defaultValue: defaultFieldValue ? defaultFieldValue[Object.keys(defaultFieldValue)[0]] : null,
                type: fieldType[Object.keys(fieldType)[0]],
                name: fieldName[Object.keys(fieldName)[0]],
                primary: isPrimaryKey[Object.keys(isPrimaryKey)[0]],
                isUnique: isUnique[Object.keys(isUnique)[0]],
                autoincrement: autoincrement ? fieldType[Object.keys(autoincrement)[0]] : null,
                isNotNullable: isNotNullable[Object.keys(isNotNullable)[0]],
            })

            const isActionFinished = await inquirer.prompt([{
                message: 'Add another field?',
                type: 'list',
                name: 'is_action_finished',
                choices: [{
                    name: 'yes',
                    value: true,
                    key: 'Yes'
                },{
                    name: 'no',
                    value: false,
                    key: 'No'
                }]
            }])

            if(!isActionFinished['is_action_finished']) {
                break;
            }

        }

        return {
            tableName: tableName['table_name'],
            fields: fields
        }
    }
}