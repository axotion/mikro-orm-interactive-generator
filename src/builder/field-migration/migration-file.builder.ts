import {FieldFactor} from "./factor/field.factor";
import {render} from 'mustache'

export class MigrationFileBuilder {

    private readonly fields: FieldFactor[]

    private compiledFields: string[]

    private className: string;

    private tableName: string;

    constructor() {
        this.fields = []
        this.className = ''
        this.tableName = ''
        this.compiledFields = []
    }

    setTableName(tableName: string) {
        this.tableName = tableName;
    }

    setClassName(className: string) {
        this.className = className
    }

    addField(fieldFactor: FieldFactor) {
        this.fields.push(fieldFactor)
    }

    build() : string {

        for(const field of this.fields) {
            let compiledField = `table.specificType("${field.name}", "${field.type}")`

            if(field.autoincrement) {
                compiledField += `.increments()`
            }

            if(field.isUnique) {
                compiledField += `.unique()`
            }

            if(field.primary) {
                compiledField += `.primary()`
            }

            if(field.defaultValue) {
                compiledField += `.defaultTo("${field.defaultValue}")`
            }

            if(field.isNotNullable) {
                compiledField += `.notNullable()`
            }

            this.compiledFields.push(compiledField)

        }

        const template = `import { Migration } from '@mikro-orm/migrations';
export class {{className}} extends Migration {
    async up(): Promise<void> {
        this.addSql(
            this.getKnex()
              .schema.createTable('{{tableName}}', (table) => {
               {{#fields}}
                    {{{.}}}
                {{/fields}}
            }).toQuery(),
        );
    }
}`

        return render(template, {
            fields: this.compiledFields,
            tableName: this.tableName,
            className: this.className
        })
    }
}