import React from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const ExcelExport = ({ data, onDataUpdate }) => {
  // Function to export data to Excel
  const exportToExcel = () => {
    try {
      // Create worksheet from data
      const ws = XLSX.utils.json_to_sheet(data);

      // Add custom headers
      XLSX.utils.sheet_add_aoa(ws, [["ID", "Student Name", "Class", "Fee Amount", "Payment Date", "Status"]], { origin: "A1" });

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Student Fees");

      // Style the headers
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "1";
        if (!ws[address]) continue;
        ws[address].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "FFFFAA00" } }
        };
      }

      // Save the file
      XLSX.writeFile(wb, "Student_Fees_Report.xlsx");
      
      toast({
        title: "Success",
        description: "Excel file has been downloaded successfully!",
        duration: 3000,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Error",
        description: "Failed to export Excel file",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Function to handle Excel file import for updates
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert Excel data to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 2 });
        
        // Update the parent component with new data
        onDataUpdate(jsonData);
        
        toast({
          title: "Success",
          description: "Data updated successfully from Excel!",
          duration: 3000,
        });
      } catch (error) {
        console.error("Import error:", error);
        toast({
          title: "Error",
          description: "Failed to import Excel file",
          variant: "destructive",
          duration: 3000,
        });
      }
    };

    if (file) {
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className="flex gap-4 items-center mb-4">
      <Button 
        onClick={exportToExcel}
        className="bg-green-600 hover:bg-green-700"
      >
        Export to Excel
      </Button>
      
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => document.getElementById('excel-upload').click()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Update from Excel
        </Button>
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ExcelExport;