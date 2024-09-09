import { ReportService } from './report.service';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    createReport(body: {
        serviceName: string;
        endpoint: string;
        headers: any;
    }): Promise<{
        reportId: number;
    }>;
    getReportStatus(id: string): Promise<import("./report.entity").Report>;
}
