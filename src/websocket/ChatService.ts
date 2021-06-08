import { container } from "tsyringe";
import { io } from "../http";
import CreateChatRoomService from "../services/CreateChatRoomService";
import CreateUserService from "../services/CreateUserService";
import GetAllUsersServices from "../services/GetAllUsersService";
import GetUserBySocketIDService from "../services/GetUserBySocketIDService";

io.on("connect", (socket) => {

  socket.on("start", async (data) => {
    const {email, avatar, name} = data;
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({email, avatar, name, socket_id: socket.id});

    socket.broadcast.emit("new_users", user);
  });

  socket.on("get_users", async (callback) => {
    const getAllUsers = container.resolve(GetAllUsersServices);
    const users = await getAllUsers.execute();

    callback(users);
  });

  socket.on("start_chat", async (data, callback) => {
    const createChatRoom = container.resolve(CreateChatRoomService);
    const getUser = container.resolve(GetUserBySocketIDService);

    const userLogged = await getUser.execute(socket.id);

    const room = await createChatRoom.execute([userLogged._id, data.idUser]);

    callback(room);
  });
});