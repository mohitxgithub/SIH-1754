import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';

const BSRReport = () => {
  const printComponentRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [fuelData, setFuelData] = useState(null);

  useEffect(() => {
    // Retrieve user data from the cookie
    const userCookie = Cookies.get('fueldata');
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      setFuelData(parsedUser); // Save the user data to state
    }
  }, []);

  const generatePDF = async (action) => {
    setLoader(true);
    try {
      if (!printComponentRef.current) {
        throw new Error('Print component reference is null');
      }

      // Force layout recalculation
      printComponentRef.current.style.display = 'block';
      await new Promise(resolve => setTimeout(resolve, 0));

      const canvas = await html2canvas(printComponentRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
        willReadFrequently: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.querySelector('#fixed-size-print-component');
          if (clonedElement) {
            clonedElement.style.width = '210mm';
            clonedElement.style.height = '297mm';
            clonedElement.style.display = 'block';
            clonedElement.style.background = '#ffffff';
            clonedElement.style.padding = '20px';
          }
          return new Promise(resolve => {
            if (clonedDoc.fonts) {
              clonedDoc.fonts.ready.then(resolve);
            } else {
              resolve();
            }
          });
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      if (action === 'download') {
        pdf.save('bsr-report.pdf');
      } else if (action === 'print') {
        pdf.autoPrint();
        window.open(pdf.output('bloburl'), '_blank');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      setLoader(false);
      if (printComponentRef.current) {
        printComponentRef.current.style.display = 'none';
      }
    }
  };

  if (!fuelData) {
    return <div>Loading fuel data...</div>; // Fallback in case fuel data isn't loaded
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Business Status Report (BSR)</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={printComponentRef} 
            id="fixed-size-print-component" 
            className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg"
          >
            <h1 className="text-2xl font-bold mb-6 text-center">
              Businesses should respect and make efforts to protect and restore the environment
            </h1>
            
            <table className="table-auto w-full border-collapse border border-gray-400 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-400 px-4 py-2 text-left">Metric</th>
                  <th className="border border-gray-400 px-4 py-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {/* Fuel Consumption Section */}
                <tr className="bg-gray-100">
                  <td className="border border-gray-400 px-4 py-6 font-bold" colSpan="2">Fuel Consumption</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Total CNG consumption (A)</td>
                  <td className="border border-gray-400 px-4 py-2 text-right">{fuelData.CNG}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Total Diesel consumption (B)</td>
                  <td className="border border-gray-400 px-4 py-2 text-right">{fuelData.Diesel}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-2">Energy Electric consumption (C)</td>
                  <td className="border border-gray-400 px-4 py-2 text-right">{fuelData.Electric}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-2 font-bold">Total Petrol consumed</td>
                  <td className="border border-gray-400 px-4 py-2 text-right font-bold">{fuelData.Petrol}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 text-sm italic text-right">
              Report Generated: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="flex space-x-4 mt-4">
            <Button 
              onClick={() => generatePDF('download')} 
              disabled={loader}
            >
              {loader ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => generatePDF('print')} 
              disabled={loader}
            >
              {loader ? 'Generating...' : 'Print PDF'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BSRReport;
