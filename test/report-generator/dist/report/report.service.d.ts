import { Repository } from 'typeorm';
import { Report } from './report.entity';
export declare class ReportService {
    private readonly reportRepository;
    constructor(reportRepository: Repository<Report>);
    createReport(serviceName: string, endpoint: string, headers: Record<string, string>): Promise<number>;
    getReportStatus(id: number): Promise<Report>;
}
