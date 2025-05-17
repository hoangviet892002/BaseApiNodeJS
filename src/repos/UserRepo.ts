import { IUser, User } from "@src/models/User";
import { getRandomInt } from "@src/common/util/util.misc";
import { BaseRepository } from "@src/common/base/base.repository";
import {
  FilterOptions,
  PaginationOptions,
  PaginationResult,
  SortOptions,
} from "@src/common/interfaces/mongo.interface";

/******************************************************************************
                                Functions
******************************************************************************/
export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }
  /**
   * Get user by email.
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }
  /**
   * See if a user with the given id exists.
   */
  async persists(id: number): Promise<boolean> {
    const user = await User.findById(id);
    if (!user) {
      return false;
    }
    return true;
  }
  /**
   * Get all users.
   */
  async getAll(): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }

  /**
   * Add one user.
   */
  async add(user: IUser): Promise<void> {
    const saveUser = new User(user);
    saveUser.save();
  }

  /**
   * Update a user.
   */
  async update_(user: IUser): Promise<void> {
    await User.findByIdAndUpdate(user.id, user);
  }

  /**
   * Delete one user.
   */
  async delete_(id: number): Promise<void> {
    await User.findByIdAndDelete(id);
  }

  // **** Unit-Tests Only **** //

  /**
   * Delete every user record.
   */
  async deleteAllUsers(): Promise<void> {
    await User.deleteMany({});
  }

  /**
   * Insert multiple users. Can't do multiple at once cause using a plain file
   * for nmow.
   */
  async insertMult(users: IUser[] | readonly IUser[]): Promise<IUser[]> {
    const insertedUsers: IUser[] = [];
    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
      insertedUsers.push(newUser);
    }
    return insertedUsers;
  }
  async searchUsers(
    query: string,
    paginationOptions: PaginationOptions,
    sort?: SortOptions
  ): Promise<PaginationResult<IUser>> {
    const filter: FilterOptions<IUser> = {
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    };

    return this.paginate(filter, paginationOptions, sort);
  }
}

/******************************************************************************
                                Export default
******************************************************************************/
