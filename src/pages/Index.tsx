import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ExcelExport from '../components/ExcelExport';
import { parseTextData } from '../utils/parseTextData';

const Index = () => {
  const [fundData, setFundData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Simulating data fetch - in real app, this would be an API call
    const sampleText = `মাই স্কুল ডেভেলপমেন্ট ফান্ড 
    ০৩/১১/২০২৪ 
    ইসলামী ব্যাংক একাউন্টে প্রাপ্ত 
    ১০০,০০০/=`;
    
    const parsedData = parseTextData(sampleText);
    setFundData(parsedData);
    setIsLoading(false);
  }, []);

  const handleDataUpdate = (newData) => {
    setFundData(newData);
    toast({
      title: "Success",
      description: "Data updated successfully",
    });
  };

  const handleTextConvert = () => {
    try {
      const parsedData = parseTextData(inputText);
      setFundData(parsedData);
      setInputText('');
      toast({
        title: "Success",
        description: "Text data converted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert text data. Please check the format.",
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
          </div>
        </div>

        <ExcelExport 
          data={fundData} 
          onDataUpdate={handleDataUpdate}
        />

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