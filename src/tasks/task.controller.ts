import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskService } from './task.service';
import { GetId } from 'src/auth/id-decorator';
import { GroupService } from 'src/groups/groups.service';
import { CreateTaskDto, TaskDto } from './dto/tasks.dto';

@UseGuards(AuthGuard('jwtUser'))
@Controller('/tasks')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private groupService: GroupService,
  ) {}

  @Post('/')
  async create(@GetId() id, @Body() dto: CreateTaskDto) {
    const { groupId, name, description } = dto;
    const data = { name, description };
    const task = this.taskService.create(id, groupId, data);
    return task;
  }
  @Get('/')
  async getAll(@GetId() id) {
    return await this.taskService.getAll(id);
  }
  @Get('/:taskId')
  async getById(@GetId() id, @Param('taskId') taskId) {
    return await this.taskService.getById(id, taskId);
  }
  @Put('/:taskId')
  async updateTask(
    @GetId() id,
    @Param('taskId') taskId,
    @Body() dto: Partial<TaskDto>,
  ) {
    return await this.taskService.updateTask(id, taskId, dto);
  }
  @Delete('/:taskId')
  async delete(@GetId() id, @Param('taskId') taskId) {
    return await this.taskService.deleteTask(id, taskId);
  }
}
