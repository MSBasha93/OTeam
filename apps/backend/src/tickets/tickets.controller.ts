import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('tickets')
@UseGuards(AuthGuard('jwt'))
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
create(@Body() body: any, @Request() req: any) {
  const { title, description } = body;
  return this.ticketsService.create({
    title,
    description,
    createdBy: req.user.id,
  });
}

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ticketsService.findById(Number(id));
  }
}
