import { container } from "tsyringe";
import { io } from "../http";
import CreateChatRoomService from "../services/CreateChatRoomService";
import CreateMessageService from "../services/CreateMessageService";
import CreateUserService from "../services/CreateUserService";
import GetAllUsersServices from "../services/GetAllUsersService";
import GetChatRoomByIDService from "../services/GetChatRoomByIDService";
import GetChatRoomByUserService from "../services/GetChatRoomByUsersService";
import GetMessageByChatRoomService from "../services/GetMessageByChatRoomService";
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
    const getChatRoomByUsers = container.resolve(GetChatRoomByUserService);
    const getMessagesByChatRoom = container.resolve(GetMessageByChatRoomService);

    const userLogged = await getUser.execute(socket.id);

    let room = await getChatRoomByUsers.execute([data.idUser, userLogged._id]);

    if(!room){
      room = await createChatRoom.execute([userLogged._id, data.idUser]);
    }

    socket.join(room.idChatRoom);

    const messages = await getMessagesByChatRoom.execute(room.idChatRoom);

    callback({room , messages});
  });


  socket.on("message", async (data) => {
    const getUserBySocketID = container.resolve(GetUserBySocketIDService);
    const createMessage = container.resolve(CreateMessageService);
    const getChatRoomById =  container.resolve(GetChatRoomByIDService);

    const user = await getUserBySocketID.execute(socket.id);

    const message = await createMessage.execute({to: user._id, text: data.message, roomId: data.idChatRoom});

    io.to(data.idChatRoom).emit("message", {message, user});

    const room = await getChatRoomById.execute(data.idChatRoom);


    const userFrom = room.idUsers.find(response => response._id !== user._id);

    io.to(userFrom.socket_id).emit("notification", {
      newMessage: true,
      roomId: data.idChatRoom,
      from: user,
    })
  });
});