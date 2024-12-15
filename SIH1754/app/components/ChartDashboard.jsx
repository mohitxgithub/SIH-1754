import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity ,ScrollView} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChartDashboard = ({ waterDocuments, wasteDocuments, fuelDocuments }) => {
  const [waterData, setWaterData] = useState([]);
  const [wasteData, setWasteData] = useState([]);
  const [fuelData, setFuelData] = useState({
    totalPetrolConsumption: 0,
    totalDieselConsumption: 0,
    totalCNGConsumption: 0,
    totalElectricConsumption: 0,
  });
  const [carbonFootprintData, setCarbonFootprintData] = useState({
    petrolCarbon: 0,
    dieselCarbon: 0,
    cngCarbon: 0,
    electricCarbon: 0,
    totalCarbon: 0,
  });
  const [isInPercentage, setIsInPercentage] = useState(false);  // Toggle for percentage view
  const [totalWaterUsed, setTotalWaterUsed] = useState(0);
  const [totalRecycledWaterUsed, setTotalRecycledWaterUsed] = useState(0);
  const [totalWasteGenerated, setTotalWasteGenerated] = useState(0);
  const [totalRecycledWasteGenerated, setTotalRecycledWasteGenerated] = useState(0);

  const [logoContainerHeight, setLogoContainerHeight] = useState(100);

  // Function to calculate total water usage and total recycled water
  const calculateWaterUsage = () => {
    let totalWaterUsed = 0;
    let totalRecycledWaterUsed = 0;

    waterDocuments.forEach((doc) => {
      totalWaterUsed += doc.waterQuantity;
      if (doc.recycledWater) {
        totalRecycledWaterUsed += doc.waterQuantity;
      }
    });

    const totalNonRecycledWaterUsed = totalWaterUsed - totalRecycledWaterUsed;

    setWaterData([
      { value: totalNonRecycledWaterUsed, color: '#4D9DFF', gradientCenterColor: '#1E78F2', focused: true },
      { value: totalRecycledWaterUsed, color: '#00BFFF', gradientCenterColor: '#1E90FF' },
    ]);

    setTotalWaterUsed(totalWaterUsed);
    setTotalRecycledWaterUsed(totalRecycledWaterUsed);
  };

  // Function to calculate total waste generation and total recycled waste
  const calculateWasteGeneration = () => {
    let totalWasteGenerated = 0;
    let totalRecycledWasteGenerated = 0;

    wasteDocuments.forEach((doc) => {
      totalWasteGenerated += doc.wasteQuantity;
      if (doc.recycledWaste === 'Yes') {
        totalRecycledWasteGenerated += doc.wasteQuantity;
      }
    });

    const totalNonRecycledWasteGenerated = totalWasteGenerated - totalRecycledWasteGenerated;

    setWasteData([
      { value: totalNonRecycledWasteGenerated, color: '#FF6F61', gradientCenterColor: '#FF4C37', focused: true },
      { value: totalRecycledWasteGenerated, color: '#66BB6A', gradientCenterColor: '#388E3C' },
    ]);

    setTotalWasteGenerated(totalWasteGenerated);
    setTotalRecycledWasteGenerated(totalRecycledWasteGenerated);
  };

  // Function to calculate fuel consumption
  const calculateFuelConsumption = () => {
    let totalPetrolConsumption = 0;
    let totalDieselConsumption = 0;
    let totalCNGConsumption = 0;
    let totalElectricConsumption = 0;

    if (!fuelDocuments || fuelDocuments.length === 0) {
      return;
    }

    fuelDocuments.forEach((doc) => {
      const quantity = parseFloat(doc.quantity.replace(/[^\d.-]/g, ''));

      if (isNaN(quantity)) return;

      switch (doc.fuelType) {
        case 'Petrol':
          totalPetrolConsumption += quantity;
          break;
        case 'Diesel':
          totalDieselConsumption += quantity;
          break;
        case 'CNG':
          totalCNGConsumption += quantity;
          break;
        case 'Electric':
          totalElectricConsumption += quantity;
          break;
        default:
          break;
      }
    });

    setFuelData({
      totalPetrolConsumption,
      totalDieselConsumption,
      totalCNGConsumption,
      totalElectricConsumption,
    });

    calculateCarbonFootprint(totalPetrolConsumption, totalDieselConsumption, totalCNGConsumption, totalElectricConsumption);
  };

  // Function to calculate carbon footprint
  const calculateCarbonFootprint = (totalPetrol, totalDiesel, totalCNG, totalElectric) => {
    const petrolCarbon = 2.68 * totalPetrol;
    const dieselCarbon = 2.31 * totalDiesel;
    const cngCarbon = 2 * totalCNG;
    const electricCarbon = 0.85 * totalElectric;

    const totalCarbon = petrolCarbon + dieselCarbon + cngCarbon + electricCarbon;

    setCarbonFootprintData({
      petrolCarbon,
      dieselCarbon,
      cngCarbon,
      electricCarbon,
      totalCarbon,
    });
  };

  const toggleView = () => {
    setIsInPercentage(!isInPercentage);
  };

  const getPercentage = (value, total) => {
    return total === 0 ? '0.00' : ((value / total) * 100).toFixed(2);
  };

  useEffect(() => {
    calculateWaterUsage();
    calculateWasteGeneration();
    calculateFuelConsumption();
  }, [waterDocuments, wasteDocuments, fuelDocuments]);

  const renderLegendComponent = (data) => {
    return data.map((item, index) => (
      <View key={index} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: 120, marginRight: 15 }}>
          {item.color && (
            <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: item.color, marginRight: 10 }} />
          )}
          <Text style={{ color: 'black', fontWeight: '600' }}>{item.label}</Text>
        </View>
      </View>
    ));
  };

  return (
    <ScrollView>
    <View style={{ flex: 1, backgroundColor: '#fff', paddingVertical: 20 }}>
      <View style={styles.chartContainer}>
        {/* Water Usage Chart */}
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Water Usage</Text>
          <TouchableOpacity onPress={toggleView}>
            <PieChart
              data={waterData}
              donut
              showGradient
              sectionAutoFocus
              radius={45}
              innerRadius={30}
              innerCircleColor={'#fff'}
              centerLabelComponent={() => (
                <View style={[styles.logoContainer, { height: logoContainerHeight }]}>
                  <Icon name="water" size={30} color="#1E90FF" />
                </View>
              )}
            />
          </TouchableOpacity>
          {renderLegendComponent([
            {
              label: isInPercentage
                ? `Total Water Used: ${getPercentage(totalWaterUsed, totalWaterUsed)}%`
                : `Total Water Used: ${totalWaterUsed.toFixed(2)} L`,
              color: '#4D9DFF',
            },
            {
              label: isInPercentage
                ? `Recycled: ${getPercentage(totalRecycledWaterUsed, totalWaterUsed)}%`
                : `Recycled: ${totalRecycledWaterUsed.toFixed(2)} L`,
              color: '#00BFFF',
            },
          ])}
        </View>

        {/* Waste Generation Chart */}
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Waste Generation</Text>
          <TouchableOpacity onPress={toggleView}>
            <PieChart
              data={wasteData}
              donut
              showGradient
              sectionAutoFocus
              radius={45}
              innerRadius={30}
              innerCircleColor={'#fff'}
              centerLabelComponent={() => (
                <View style={[styles.logoContainer, { height: logoContainerHeight }]}>
                  <Icon name="delete" size={30} color="#FF6F61" />
                </View>
              )}
            />
          </TouchableOpacity>
          {renderLegendComponent([
            {
              label: isInPercentage
                ? `Total Waste Generated: ${getPercentage(totalWasteGenerated, totalWasteGenerated)}%`
                : `Total Waste Generated: ${totalWasteGenerated.toFixed(2)} kg`,
              color: '#FF6F61',
            },
            {
              label: isInPercentage
                ? `Recycled: ${getPercentage(totalRecycledWasteGenerated, totalWasteGenerated)}%`
                : `Recycled: ${totalRecycledWasteGenerated.toFixed(2)} kg`,
              color: '#66BB6A',
            },
          ])}
        </View>
      </View>

      {/* 2x2 Grid Layout for Fuel and Carbon Footprint */}
      <View style={styles.gridContainer}>
        {/* Fuel Consumption Chart */}
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Fuel Consumption</Text>
          <TouchableOpacity onPress={toggleView}>
            <PieChart
              data={[
                { value: fuelData.totalPetrolConsumption, color: '#FF6347' },
                { value: fuelData.totalDieselConsumption, color: '#FF9900' },
                { value: fuelData.totalCNGConsumption, color: '#2E8B57' },
                { value: fuelData.totalElectricConsumption, color: '#1E90FF' },
              ]}
              donut
              showGradient
              sectionAutoFocus
              radius={45}
              innerRadius={30}
              innerCircleColor={'#fff'}
              outerRingWidth={12}
              centerLabelComponent={() => (
                <View style={[styles.logoContainer, { height: logoContainerHeight }]}>
                  <Icon name="ev-station" size={30} color="#FFD700" />
                </View>
              )}
            />
          </TouchableOpacity>
          {renderLegendComponent([
            {
              label: isInPercentage
                ? `Petrol: ${getPercentage(fuelData.totalPetrolConsumption, fuelData.totalPetrolConsumption + fuelData.totalDieselConsumption + fuelData.totalCNGConsumption + fuelData.totalElectricConsumption)}%`
                : `Petrol: ${fuelData.totalPetrolConsumption.toFixed(2)} L`,
              color: '#FF6347',
            },
            {
              label: isInPercentage
                ? `Diesel: ${getPercentage(fuelData.totalDieselConsumption, fuelData.totalPetrolConsumption + fuelData.totalDieselConsumption + fuelData.totalCNGConsumption + fuelData.totalElectricConsumption)}%`
                : `Diesel: ${fuelData.totalDieselConsumption.toFixed(2)} L`,
              color: '#FF9900',
            },
            {
              label: isInPercentage
                ? `CNG: ${getPercentage(fuelData.totalCNGConsumption, fuelData.totalPetrolConsumption + fuelData.totalDieselConsumption + fuelData.totalCNGConsumption + fuelData.totalElectricConsumption)}%`
                : `CNG: ${fuelData.totalCNGConsumption.toFixed(2)} kg`, 
              color: '#2E8B57',
            },
            {
              label: isInPercentage
                ? `Electric: ${getPercentage(fuelData.totalElectricConsumption, fuelData.totalPetrolConsumption + fuelData.totalDieselConsumption + fuelData.totalCNGConsumption + fuelData.totalElectricConsumption)}%`
                : `Electric: ${fuelData.totalElectricConsumption.toFixed(2)} kWh`,
              color: '#1E90FF',
            },
          ])}
        </View>

        {/* Carbon Footprint Chart */}
        <View style={styles.chartBox}>
          <Text style={styles.chartTitle}>Carbon Footprint</Text>
          <TouchableOpacity onPress={toggleView}>
            <PieChart
              data={[
                { value: carbonFootprintData.petrolCarbon, color: '#FF6347' },
                { value: carbonFootprintData.dieselCarbon, color: '#FF9900' },
                { value: carbonFootprintData.cngCarbon, color: '#2E8B57' },
                { value: carbonFootprintData.electricCarbon, color: '#1E90FF' },
              ]}
              donut
              showGradient
              sectionAutoFocus
              radius={45}
              innerRadius={30}
              innerCircleColor={'#fff'}
              outerRingWidth={12}
              centerLabelComponent={() => (
                <View style={[styles.logoContainer, { height: logoContainerHeight }]}>
                  <Icon name="eco" size={30} color="#32CD32" />
                </View>
              )}
            />
          </TouchableOpacity>
          {renderLegendComponent([
            {
              label: isInPercentage
                ? `Petrol Carbon: ${getPercentage(carbonFootprintData.petrolCarbon, carbonFootprintData.totalCarbon)}%`
                : `Petrol Carbon: ${carbonFootprintData.petrolCarbon.toFixed(2)} kg CO2`,
              color: '#FF6347',
            },
            {
              label: isInPercentage
                ? `Diesel Carbon: ${getPercentage(carbonFootprintData.dieselCarbon, carbonFootprintData.totalCarbon)}%`
                : `Diesel Carbon: ${carbonFootprintData.dieselCarbon.toFixed(2)} kg CO2`,
              color: '#FF9900',
            },
            {
              label: isInPercentage
                ? `CNG Carbon: ${getPercentage(carbonFootprintData.cngCarbon, carbonFootprintData.totalCarbon)}%`
                : `CNG Carbon: ${carbonFootprintData.cngCarbon.toFixed(2)} kg CO2`,
              color: '#2E8B57',
            },
            {
              label: isInPercentage
                ? `Electric Carbon: ${getPercentage(carbonFootprintData.electricCarbon, carbonFootprintData.totalCarbon)}%`
                : `Electric Carbon: ${carbonFootprintData.electricCarbon.toFixed(2)} kg CO2`,
              color: '#1E90FF',
            },
            {
              label: isInPercentage
                ? `Total Carbon Footprint: ${getPercentage(carbonFootprintData.totalCarbon, carbonFootprintData.totalCarbon)}%`
                : `Total Carbon Footprint: ${carbonFootprintData.totalCarbon.toFixed(2)} kg CO2`,
              color: '#4B0082',
            },
          ])}
        </View>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  chartBox: {
    margin: 10,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: Dimensions.get('window').width / 2 - 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chartTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default ChartDashboard;
