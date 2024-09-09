"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("./report.entity");
const ExcelJS = require("exceljs");
const axios_1 = require("axios");
const path = require("path");
const fs = require("fs");
let ReportService = class ReportService {
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }
    async createReport(serviceName, endpoint, headers) {
        const report = this.reportRepository.create({
            serviceName,
            endpoint,
            headers: JSON.stringify(headers),
            status: 'pending',
        });
        try {
            await this.reportRepository.save(report);
            setTimeout(async () => {
                try {
                    console.log(`Fetching data from endpoint: ${endpoint} with headers: ${JSON.stringify(headers)}`);
                    const response = await axios_1.default.get(endpoint, { headers });
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
                    const directory = path.dirname(filePath);
                    if (!fs.existsSync(directory)) {
                        fs.mkdirSync(directory, { recursive: true });
                    }
                    await workbook.xlsx.writeFile(filePath);
                    report.status = 'completed';
                    report.fileUrl = `http://localhost:3000/${fileName}`;
                    await this.reportRepository.save(report);
                    console.log('Report generated successfully:', report);
                }
                catch (error) {
                    report.status = 'failed';
                    await this.reportRepository.save(report);
                    console.error('Error generating report:', error);
                }
            }, 1000);
            return report.id;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create report');
        }
    }
    async getReportStatus(id) {
        const report = await this.reportRepository.findOne({
            where: { id },
        });
        if (!report) {
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        }
        return report;
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReportService);
//# sourceMappingURL=report.service.js.map