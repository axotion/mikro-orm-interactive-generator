import { writeFileSync } from 'fs'

export class LocalFilesystemSaver {

    save(name: string, content: string) : void {
        writeFileSync(process.cwd() + '/' + name + '.ts', content);
    }

}