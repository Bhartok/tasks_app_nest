import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from './entities/groups.model';
import { CreateGroupDto } from './dto/group.dto';
import { UserGroup } from 'src/db/usersgroups.model';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/entities/users.model';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group) private groupModel: typeof Group,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(UserGroup) private userGroupModel: typeof UserGroup,
    private sequelize: Sequelize,
  ) {}

  async userInGroup(userId: string, groupId: string) {
    const userInGroup = await this.userGroupModel.findOne({
      where: { userId, groupId },
    });
    if (!userInGroup || userInGroup.role != 0) {
      throw new UnauthorizedException();
    }
    return userInGroup;
  }

  async create(userId: string, dto: CreateGroupDto) {
    const { name, description } = dto;
    const transaction = await this.sequelize.transaction();
    try {
      const group = await this.groupModel.create(
        { name, description },
        { transaction },
      );
      await this.userGroupModel.create(
        {
          groupId: group.id,
          userId: userId,
          role: 0, // OWNER ROLE
        },
        { transaction },
      );
      await transaction.commit();
      return group;
    } catch {
      await transaction.rollback();
      throw new BadRequestException('Error creating group');
    }
  }

  async getAll(userId: string) {
    const groups = await this.userGroupModel.findAll({
      where: { userId },
      attributes: ['groupId'],
    });
    return groups;
  }

  async getById(userId: string, groupId: string) {
    return await this.userModel.findOne({
      where: { id: userId },
      attributes: ['id', 'name'],
      include: [{ model: Group, where: { id: groupId } }],
    });
  }

  async update(userId: string, groupId: string, input: Partial<Group>) {
    await this.userInGroup(userId, groupId);
    const [, group] = await this.groupModel.update(
      { ...input },
      { where: { id: groupId }, returning: true },
    );
    return group;
  }

  async delete(userId: string, groupId: string) {
    await this.userInGroup(userId, groupId);
    const transaction = await this.sequelize.transaction();
    try {
      await this.userGroupModel.destroy({
        where: { groupId },
        transaction,
      });
      const group = await this.groupModel.destroy({
        where: { id: groupId },
        transaction,
      });
      await transaction.commit();
      return group;
    } catch {
      await transaction.rollback();
      throw new BadRequestException('Error deleting group');
    }
  }

  async assignRole(
    userId: string,
    asigneeId: string,
    groupId: string,
    role: number,
  ) {
    await this.userInGroup(userId, groupId);
    try {
      const group = await this.userGroupModel.create({
        userId: asigneeId,
        groupId,
        role,
      });
      return group;
    } catch {
      throw new BadRequestException('Error asigning user to Group');
    }
  }

  async eliminateUser(userId: string, toEliminateId: string, groupId: string) {
    await this.userInGroup(userId, groupId);
    try {
      const group = await this.userGroupModel.destroy({
        where: { userId: toEliminateId, groupId },
      });
      return group;
    } catch {
      throw new BadRequestException('Error trying to remove user from group');
    }
  }
}
