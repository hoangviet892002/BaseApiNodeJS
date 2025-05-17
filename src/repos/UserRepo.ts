import { IUser, User } from "@src/models/User";
import { getRandomInt } from "@src/common/util/util.misc";

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get one user.
 */
async function getOne(email: string): Promise<IUser | null> {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  } else return user;
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const user = await User.findById(id);
  if (!user) {
    return false;
  }
  return true;
}

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  const users = await User.find();
  return users;
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<void> {
  const saveUser = new User(user);
  saveUser.save();
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  await User.findByIdAndUpdate(user.id, user);
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
  await User.findByIdAndDelete(id);
}

// **** Unit-Tests Only **** //

/**
 * Delete every user record.
 */
async function deleteAllUsers(): Promise<void> {
  await User.deleteMany({});
}

/**
 * Insert multiple users. Can't do multiple at once cause using a plain file
 * for nmow.
 */
async function insertMult(users: IUser[] | readonly IUser[]): Promise<IUser[]> {
  const insertedUsers: IUser[] = [];
  for (const user of users) {
    const newUser = new User(user);
    await newUser.save();
    insertedUsers.push(newUser);
  }
  return insertedUsers;
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  deleteAllUsers,
  insertMult,
} as const;
