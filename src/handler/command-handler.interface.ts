import {CommandInterface} from "../command/command.interface";

export interface CommandHandlerInterface {
    handle(command: CommandInterface) : Promise<void> | void;
    isEligible(command: CommandInterface) : boolean;
}