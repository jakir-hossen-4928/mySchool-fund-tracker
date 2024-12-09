import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import * as XLSX from 'xlsx';

const Index = () => {
  const [fundData, setFundData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedData = localStorage.getItem('fundData');
    if (savedData) {
      setFundData(JSON.parse(savedData));
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever fundData changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('fundData', JSON.stringify(fundData));
    }
  }, [fundData, isLoading]);

  const handleTextConvert = () => {
    try {
      const lines = inputText.split('\n').map(line => line.trim()).filter(line => line);
      const data = [];
      let currentDate = '';
      let currentEntry = null;

      lines.forEach(line => {
        const dateMatch = line.match(/^\d{2}\/\d{2}\/\d{4}/);
        
        if (dateMatch) {
          if (currentEntry) {
            data.push(currentEntry);
          }
          currentDate = dateMatch[0];
          currentEntry = {
            date: currentDate,
            transactions: []
          };
        } else if (currentEntry) {
          const amountMatch = line.match(/([\d,]+)\/=/);
          if (amountMatch) {
            const description = line.split(/[:=]/)[0].trim();
            const amount = amountMatch[1];
            currentEntry.transactions.push({
              description,
              amount
            });
          }
        }
      });

      if (currentEntry) {
        data.push(currentEntry);
      }

      setFundData(data);
      setInputText('');
      toast({
        title: "সফল",
        description: "টেক্সট ডাটা কনভার্ট করা হয়েছে",
      });
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "টেক্সট ডাটা কনভার্ট করতে ব্যর্থ হয়েছে",
        variant: "destructive",
      });
    }
  };

  const exportToExcel = () => {
    try {
      // Flatten the data for Excel export
      const flatData = fundData.reduce((acc, dateEntry) => {
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">স্কুল ডেভেলপমেন্ট ফান্ড ড্যাশবোর্ড</h1>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">টেক্সট ডাটা ইনপুট</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>টেক্সট ডাটা ইনপুট করুন</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="এখানে আপনার টেক্সট ডাটা পেস্ট করুন..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[300px]"
                  />
                  <Button onClick={handleTextConvert}>কনভার্ট করুন</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700"
            >
              এক্সেল এক্সপোর্ট
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>তারিখ</TableHead>
                <TableHead>বিবরণ</TableHead>
                <TableHead>টাকার পরিমাণ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fundData.map((dateEntry, index) => (
                dateEntry.transactions.map((transaction, tIndex) => (
                  <TableRow key={`${index}-${tIndex}`}>
                    {tIndex === 0 && (
                      <TableCell rowSpan={dateEntry.transactions.length}>
                        {dateEntry.date}
                      </TableCell>
                    )}
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Index;