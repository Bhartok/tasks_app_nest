import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class TaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
export class CreateTaskDto extends TaskDto {
  @IsUUID()
  @IsNotEmpty()
  groupId: string;
}
