import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { RcaService } from './rca.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('rca')
@UseGuards(AuthGuard('jwt'))
export class RcaController {
  constructor(private readonly rcaService: RcaService) {}

  @Post(':ticketId')
  submitRca(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Request() req: any,
    @Body('content') content: string,
  ) {
    return this.rcaService.submit(ticketId, req.user.id, content);
  }

  @Get(':ticketId')
  getRca(@Param('ticketId', ParseIntPipe) ticketId: number) {
    return this.rcaService.getByTicket(ticketId);
  }
}
