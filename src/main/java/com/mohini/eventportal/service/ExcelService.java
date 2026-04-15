package com.mohini.eventportal.service;

import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class ExcelService {

    public List<CollegeOnboardingData> parseOnboardingExcel(MultipartFile file) throws Exception {
        List<CollegeOnboardingData> dataList = new ArrayList<>();
        
        try (InputStream is = file.getInputStream(); Workbook workbook = WorkbookFactory.create(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();
            
            // Skip header row
            if (rows.hasNext()) {
                rows.next();
            }
            
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (currentRow == null) continue;
                
                CollegeOnboardingData data = new CollegeOnboardingData();
                data.setCollegeCode(getCellValueAsString(currentRow.getCell(0)));
                data.setCollegeName(getCellValueAsString(currentRow.getCell(1)));
                data.setCoordinatorName(getCellValueAsString(currentRow.getCell(2)));
                data.setEmail(getCellValueAsString(currentRow.getCell(3)));
                data.setPhone(getCellValueAsString(currentRow.getCell(4)));
                data.setCity(getCellValueAsString(currentRow.getCell(5)));
                data.setDistrict(getCellValueAsString(currentRow.getCell(6)));
                
                if (data.getCollegeCode() != null && !data.getCollegeCode().isEmpty()) {
                    dataList.add(data);
                }
            }
        }
        
        return dataList;
    }
    
    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue().trim();
            case NUMERIC: 
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf((long)cell.getNumericCellValue());
                }
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            case FORMULA: return cell.getCellFormula();
            default: return "";
        }
    }
    
    public static class CollegeOnboardingData {
        private String collegeCode;
        private String collegeName;
        private String coordinatorName;
        private String email;
        private String phone;
        private String city;
        private String district;

        // Getters and Setters
        public String getCollegeCode() { return collegeCode; }
        public void setCollegeCode(String collegeCode) { this.collegeCode = collegeCode; }
        public String getCollegeName() { return collegeName; }
        public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
        public String getCoordinatorName() { return coordinatorName; }
        public void setCoordinatorName(String coordinatorName) { this.coordinatorName = coordinatorName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
    }
}
