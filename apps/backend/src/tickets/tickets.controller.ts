import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { SlaMonitorService } from './sla-monitor.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';


@Controller('tickets')
@UseGuards(AuthGuard('jwt'))
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly slaMonitor: SlaMonitorService,
  ) { }

  @Post()
  create(@Body() body: any, @Request() req: any) {
    const { title, description, priority } = body;
    return this.ticketsService.create({
      title,
      description,
      priority,
      createdBy: req.user.id,
    });
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findById(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ) {
    return this.ticketsService.updateStatus(id, { status: body.status });
  }

  @Patch(':id/escalate')
  escalate(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.ticketsService.escalateTicket(id, req.user.id);
  }

  @Patch(':id/assign/:expertId')
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Param('expertId', ParseIntPipe) expertId: number,
  ) {
    return this.ticketsService.assignTicket(id, expertId);
  }

  @Patch('sla-scan')
  runSlaScan() {
    return this.slaMonitor.escalateOverdueTickets();
  }
  @Patch(':id/auto-assign/:domain')
  autoAssign(
    @Param('id', ParseIntPipe) id: number,
    @Param('domain') domain: string,
  ) {
    return this.ticketsService.autoAssignTicket(id, domain);
  }
  @Get('my')
  getMyTickets(@Request() req: any) {
    return this.ticketsService.getClientTickets(Number(req.user.id));
  }

  @Get('assigned-to-me')
  getMyAssigned(@Request() req: any) {
    return this.ticketsService.getExpertTickets(Number(req.user.id));
  }

  @Get('escalated')
  getEscalated() {
    return this.ticketsService.getEscalatedTickets();
  }

  @Get('unassigned')
  getUnassigned() {
    return this.ticketsService.getUnassignedTickets();
  }

  @Get('with-missing-rca')
  getMissingRcaTickets() {
    return this.ticketsService.getTicketsMissingRca();
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('expert')
  @Get('assigned-to-me')
  getExpertAssignedTickets(@Request() req: any) {
    return this.ticketsService.getExpertTickets(Number(req.user.id));
  }


}
