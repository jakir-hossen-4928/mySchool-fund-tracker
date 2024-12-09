import React from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const ExcelExport = ({ data, onDataUpdate }) => {
  const exportToExcel = () => {
    try {
      // Flatten the data for Excel export
      const flatData = data.reduce((acc, dateEntry) => {
        return acc.concat(
          dateEntry.transactions.map(transaction => ({
            Date: dateEntry.date,
            Description: transaction.description,
            Amount: transaction.amount
          }))
        );
      }, []);

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(flatData);

      // Add headers in Bengali
      XLSX.utils.sheet_add_aoa(ws, [["তারিখ", "বিবরণ", "টাকার পরিমাণ"]], { origin: "A1" });

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Fund Data");

      // Save file
      XLSX.writeFile(wb, "School_Development_Fund.xlsx");
      
      toast({
        title: "সফল",
        description: "এক্সেল ফাইল ডাউনলোড হয়েছে",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "ত্রুটি",
        description: "এক্সেল ফাইল এক্সপোর্ট করতে ব্যর্থ",
        variant: "destructive",
      });
    }
  };

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
        
        // Transform the data back to our format
        const transformedData = jsonData.reduce((acc, row) => {
          const dateEntry = acc.find(entry => entry.date === row.Date);
          if (dateEntry) {
            dateEntry.transactions.push({
              description: row.Description,
              amount: row.Amount
            });
          } else {
            acc.push({
              date: row.Date,
              transactions: [{
                description: row.Description,
                amount: row.Amount
              }]
            });
          }
          return acc;
        }, []);
        
        onDataUpdate(transformedData);
        
        toast({
          title: "সফল",
          description: "ডেটা আপডেট করা হয়েছে",
        });
      } catch (error) {
        console.error("Import error:", error);
        toast({
          title: "ত্রুটি",
          description: "এক্সেল ফাইল ইমপোর্ট করতে ব্যর্থ",
          variant: "destructive",
        });
      }
    };

    if (file) {
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className="flex gap-4 items-center mb-6">
      <Button 
        onClick={exportToExcel}
        className="bg-green-600 hover:bg-green-700"
      >
        এক্সেল এক্সপোর্ট
      </Button>
      
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => document.getElementById('excel-upload').click()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          এক্সেল থেকে আপডেট
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