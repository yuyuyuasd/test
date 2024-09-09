import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import * as ExcelJS from 'exceljs';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async createReport(serviceName: string, endpoint: string, headers: Record<string, string>): Promise<number> {
    const report = this.reportRepository.create({
      serviceName,
      endpoint,
      headers: JSON.stringify(headers),
      status: 'pending',
    });
    try {
      await this.reportRepository.save(report);

      // тут генерация отчета
      setTimeout(async () => {
        try {
          console.log(`Fetching data from endpoint: ${endpoint} with headers: ${JSON.stringify(headers)}`);
          
          const response = await axios.get(endpoint, { headers });
          const data = response.data;

          console.log('Data received from service:', data);

          if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Received data is not in the expected format');
          }

          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Report');
          worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key }));

          data.forEach(item => worksheet.addRow(item));

          const fileName = `report_${report.id}.xlsx`;
          const filePath = path.resolve(__dirname, '..', '..', 'public', fileName);

          // директория
          const directory = path.dirname(filePath);
          if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
          }

          await workbook.xlsx.writeFile(filePath);

          report.status = 'completed';
          report.fileUrl = `http://localhost:3000/${fileName}`;
          await this.reportRepository.save(report);
          console.log('Report generated successfully:', report);
        } catch (error) {
          report.status = 'failed';
          await this.reportRepository.save(report);
          console.error('Error generating report:', error); 
        }
      }, 1000);

      return report.id;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create report');
    }
  }

  async getReportStatus(id: number): Promise<Report> {
    const report = await this.reportRepository.findOne({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }
}