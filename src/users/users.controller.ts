import { Controller, Get } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/')
  getAllUsers() {
    return this.userService.getAll();
  }
}
