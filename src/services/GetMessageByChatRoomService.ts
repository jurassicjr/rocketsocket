import { injectable } from "tsyringe";
import { Message } from "../schemas/Message";

@injectable()
export default class GetMessageByChatRoomService {

    public async execute(roomId: string){
      const messages = await Message.find({
        roomId,
      }).populate("to").exec();

      return messages;
    }
}