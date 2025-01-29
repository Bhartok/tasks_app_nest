import { Max, Min } from 'class-validator';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/groups/entities/groups.model';
import { User } from 'src/users/entities/users.model';

@Table({
  tableName: 'usersGroups',
})
export class UserGroup extends Model {
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({ field: 'userId', type: DataType.UUID })
  userId: string;

  @PrimaryKey
  @ForeignKey(() => Group)
  @Column({ field: 'groupId', type: DataType.UUID })
  groupId: string;

  @Max(3)
  @Min(0)
  @Column({
    type: DataType.INTEGER,
    defaultValue: 3,
  })
  role;
}
