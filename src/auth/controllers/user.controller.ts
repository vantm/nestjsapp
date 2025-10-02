import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  listUsers() {
    return this.userService.listUsers();
  }
}
