import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './entities/task.model';
import { UserGroup } from 'src/db/usersgroups.model';
import { Group } from 'src/groups/entities/groups.model';
import { User } from 'src/users/entities/users.model';
import { TaskDto } from './dto/tasks.dto';
import { Op } from 'sequelize';
@Injectable()
export class TaskService {
  constructor(
    @InjectModel(UserGroup) private userGroupModel: typeof UserGroup,
    @InjectModel(Group) private groupModel: typeof Group,
    @InjectModel(Task) private taskModel: typeof Task,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async create(userId, groupId: string, data: TaskDto) {
    const userInGroup = await this.userGroupModel.findOne({
      where: { userId, groupId },
    });
    if (!userInGroup || userInGroup.role > 1) throw new UnauthorizedException();
    const task = Task.create({ ...data, groupId });
    return task;
  }

  async getAll(userId: string) {
    const tasks = await this.taskModel.findAll({
      include: [
        {
          model: Group,
          include: [{ model: User, where: { id: userId }, attributes: [] }],
        },
      ],
    });

    return tasks;
  }

  async getById(userId: string, taskId: string) {
    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        {
          model: Group,
          include: [
            {
              model: User,
              through: { where: { userId, role: { [Op.lte]: 1 } } },
              attributes: [],
            },
          ],
        },
      ],
    });

    return task;
  }

  async updateTask(userId: string, taskId: string, dto: Partial<TaskDto>) {
    const task = await this.getById(userId, taskId);
    if (!task) {
      throw new Error(
        'Task not found or user does not have permission to update it',
      );
    }

    await task.update({ ...dto }, { where: { id: taskId } });

    return task;
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await this.getById(userId, taskId);

    if (!task) {
      throw new BadRequestException(
        'Task not found or user does not have permission to delete it',
      );
    }
    try {
      await task.destroy();
      return true;
    } catch {
      return false;
    }
  }
}
