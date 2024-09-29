import UsersMeController from "./@me/index.ctrl";
import UsersConnectionsController from "./connections/index.ctrl";

export default class UsersController {
    me = new UsersMeController()
    connections = new UsersConnectionsController()
}
