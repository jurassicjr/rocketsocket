import { injectable } from "tsyringe";
import { User } from "../schemas/User";


@injectable()
export default class GetAllUsersServices {

  public async execute() {
    const users = await User.find().exec();

    return users;
  }
}