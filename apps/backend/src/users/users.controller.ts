import { Controller, Get, Param, Patch, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('management', 'client')
   findAll(@Request() req: ExpressRequest) {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('management', 'client')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Get('pending')
  @Roles('management', 'sdm')
  getPendingUsers() {
    return this.usersService.findPendingUsers();
  }

  @Patch(':id/approve')
  @Roles('management', 'sdm')
  approveUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.approveUser(id);
  }
}

