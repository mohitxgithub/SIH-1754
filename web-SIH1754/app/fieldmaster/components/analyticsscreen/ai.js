import { createContext, useState } from "react";

// Create the contexts for each data type
export const WaterContext = createContext();
export const WasteContext = createContext();
export const FuelContext = createContext();
export const ElectricityContext = createContext();

// DataProvider component to hold and provide data
export const DataProvider = ({ children }) => {
    const [wasteDocuments, setWasteDocuments] = useState([]);
    const [waterDocuments, setWaterDocuments] = useState([]);
    const [fuelDocuments, setFuelDocuments] = useState([]);
    const [electricityDocument, setElectricityDocument] = useState([]);

    // Functions to modify the data
    const addWater = (array) => {
        setWaterDocuments(array);
        console.log("Water data updated");
    }

    const addWaste = (array) => {
        setWasteDocuments(array);
        console.log("Waste data updated");
    }

    const addFuel = (array) => {
        setFuelDocuments(array);
        console.log("Fuel data updated");
    }

    const addElectricity = (array) => {
        setElectricityDocument(array);
        console.log("Electricity data updated");
    }

    return (
       <ContextData.Provider value={
        addElectricity,
        addFuel,
        addWaste,
        addWater,
        wasteDocuments,
        waterDocuments,
        
       }>

       </ContextData.Provider>
    );
};
