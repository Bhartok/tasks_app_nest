import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/groups/entities/groups.model';

@Table({
  tableName: 'tasks',
  timestamps: true,
})
export class Task extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM('Completed', 'Pending'),
    allowNull: false,
    defaultValue: 'Pending',
  })
  status: string;

  @ForeignKey(() => Group)
  @Column({ type: DataType.UUID })
  groupId: string;
}
