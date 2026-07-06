import { sequelize } from '../config/db';
import { User } from './user';
import { Task } from './task';

User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

export { sequelize, User, Task };
