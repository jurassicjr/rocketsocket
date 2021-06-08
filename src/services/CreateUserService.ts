import { injectable } from "tsyringe";
import { User } from "../schemas/User";


interface ICreateUserDTO {
  email: string;
  socket_id: string;
  avatar: string;
  name: string;
}

@injectable()
export default class CreateUserService {
  async execute({name, email, avatar, socket_id} : ICreateUserDTO){
    const userAlreadyExists = await User.findOne({email}).exec();
    if(userAlreadyExists) {
      const user = await User.findOneAndUpdate(
        { _id: userAlreadyExists._id },
        { $set: { socket_id, avatar, name }},
        { new: true }).exec();
    
      return user;
    } 
    const user = await User.create({email, socket_id, avatar, name});
    return user;
  }
}