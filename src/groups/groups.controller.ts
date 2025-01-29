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
import { AsignRoleDto, CreateGroupDto } from './dto/group.dto';
import { GroupService } from './groups.service';
import { GetId } from 'src/auth/id-decorator';

@UseGuards(AuthGuard('jwtUser'))
@Controller('/groups')
export class GroupController {
  constructor(private groupService: GroupService) {}
  @Post('')
  async create(@GetId() id, @Body() dto: CreateGroupDto) {
    const group = this.groupService.create(id, dto);
    return group;
  }
  @Get('')
  async getall(@GetId() id) {
    return await this.groupService.getAll(id);
  }
  @Get('/:groupId')
  async getById(@GetId() id, @Param('groupId') groupId) {
    return await this.groupService.getById(id, groupId);
  }

  @Put('/:groupId')
  async update(
    @GetId() id,
    @Param('groupId') groupId,
    @Body() dto: Partial<CreateGroupDto>,
  ) {
    const updatedGroup = await this.groupService.update(id, groupId, dto);
    return updatedGroup;
  }

  @Delete('/:groupId')
  async delete(@GetId() id, @Param('groupId') groupId) {
    const status = await this.groupService.delete(id, groupId);
    return status ? true : false;
  }

  @Post('/:groupId/:asigneeId')
  async asignRole(
    @GetId() id,
    @Param('groupId') groupId,
    @Param('asigneeId') asigneeId,
    @Body() dto: AsignRoleDto,
  ) {
    const { role } = dto;
    return await this.groupService.assignRole(id, asigneeId, groupId, role);
  }
  @Delete('/:groupId/:toEliminateId')
  async removeUserGroup(
    @GetId() id,
    @Param('groupId') groupId,
    @Param('toEliminateId') toEliminateId,
  ) {
    const status = await this.groupService.eliminateUser(
      id,
      toEliminateId,
      groupId,
    );
    return status ? true : false;
  }
}
