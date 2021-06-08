import { injectable } from "tsyringe";
import { User } from "../schemas/User";


@injectable()
export default class GetUserBySocketIDService{

  public async execute(socket_id: string) {
    const user = await User.findOne({socket_id}).exec();

    return user;
  }
}