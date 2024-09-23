import { User } from "../../database/models/user.model";
import { Connection } from "../../database/models/connection.model";
import { DuplicatedDataError, NotFoundError } from "../../utils/exceptions";
import { updateStates } from "../../services/db.services";

export default class UsersHelpers {
  public async validateAndUpdateUser(user: any, updateData: any) {
    const { user_id, createdAt, updatedAt, email, ...rest } = updateData;

    if (rest.username) {
      const existingUser = await User.findOne({
        username: rest.username,
      }).exec();
      if (existingUser) {
        throw new DuplicatedDataError("Username already exists!");
      }
    }

    const state = updateStates(rest);

    await User.updateOne({ _id: user._id }, { $set: state }).exec();
  }

  public async getUserConnections(user: string) {
    const connections = await Connection.find({ user })
      .select("data type")
      .exec();

    if (connections.length === 0) {
      throw new NotFoundError("No connections found for the user");
    }

    return connections.map((connection) => ({
      id: connection.id,
      name: connection.data.name,
      username: connection.data.username,
      type: connection.type,
    }));
  }
}
