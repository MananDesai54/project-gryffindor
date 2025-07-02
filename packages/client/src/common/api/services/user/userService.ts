import { User } from "@gryffindor/client/common/types/user.type";
import { CRUDService } from "../crudService";

class UserService extends CRUDService<User> {
  private static instance: UserService;

  private constructor() {
    super("user");
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserService();
    }
    return this.instance;
  }
}

export const userServiceInstance = UserService.getInstance();
