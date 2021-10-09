import { writeFileSync } from 'fs'

export class LocalSaver {

    save(name: string, content: string) : void {
        writeFileSync(process.cwd() + '/' + name + '.ts', content);
    }

}