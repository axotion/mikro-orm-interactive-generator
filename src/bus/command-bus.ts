import {CommandHandlerInterface} from "../handler/command-handler.interface";
import {CommandInterface} from "../command/command.interface";

export class CommandBus {

    constructor(private handlers: CommandHandlerInterface[]) {}

    async dispatch(command: CommandInterface) : Promise<void> {
        for(const handler of this.handlers) {
            if(handler.isEligible(command)) {
                await handler.handle(command)
                return;
            }
        }

        throw new Error(`Command handler not found for command ${command.getName()}`)
    }
}