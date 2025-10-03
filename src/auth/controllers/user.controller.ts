import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserAttributesDto } from '@app/auth/dtos/user-attributes.dto';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { UserService } from '@app/auth/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  listUsers() {
    return this.userService.listUsers();
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getProfile(@Request() req: Request & { user: UserAttributesDto }) {
    return req.user;
  }
}
