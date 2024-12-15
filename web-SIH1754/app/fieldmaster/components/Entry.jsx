import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function Entry() {
  const [fuelData, setFuelData] = useState(null);
  const [waterData, setWaterData] = useState(null);
  const [electricData, setElectricData] = useState(null);
  const [wasteData, setWasteData] = useState(null);

  useEffect(() => {
    // Retrieve the data from cookies
    const userCookieFuel = Cookies.get('fueldata');
    const userCookieWater = Cookies.get('waterdata');
    const userCookieElectric = Cookies.get('electricdata');
    const userCookieWaste = Cookies.get('wasteData');

    // Set the data into the state if available
    if (userCookieFuel) {
      const parsedFuelData = JSON.parse(userCookieFuel);
      setFuelData(parsedFuelData);
    }

    if (userCookieWater) {
      const parsedWaterData = JSON.parse(userCookieWater);
      setWaterData(parsedWaterData);
    }

    if (userCookieElectric) {
      const parsedElectricData = JSON.parse(userCookieElectric);
      setElectricData(parsedElectricData);
    }

    if (userCookieWaste) {
      const parsedWasteData = JSON.parse(userCookieWaste);
      setWasteData(parsedWasteData);
    }
  }, []);

  // Function to render a table of fields from a given data object
  const renderTable = (data, title) => {
    if (!data) return null;

    const keys = Object.keys(data);

    return (
      <div className="my-4 p-4 border rounded-lg">
        <h3 className="font-bold text-lg">{title}</h3>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Field</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => (
              <tr key={key}>
                <td className="border border-gray-300 px-4 py-2">{key}</td>
                <td className="border border-gray-300 px-4 py-2">{data[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Display each section if the data is available */}
      {renderTable(fuelData, 'Fuel Consumption Data')}
      {renderTable(waterData, 'Water Usage Data')}
      {renderTable(electricData, 'Electricity Usage Data')}
      {renderTable(wasteData, 'Waste Management Data')}
    </div>
  );
}

export default Entry;
