import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async createReport(@Body() body: { serviceName: string; endpoint: string; headers: any }) {
    const { serviceName, endpoint, headers } = body;
    const reportId = await this.reportService.createReport(serviceName, endpoint, headers);
    return { reportId };
  }

  @Get(':id')
  async getReportStatus(@Param('id') id: string) {
    const report = await this.reportService.getReportStatus(Number(id));
    return report;
  }
}