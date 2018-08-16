export const data = {
  truck: {
    segment: 'truck',
    img: "./assets/images/equipment-options/truck.png",
    title: "Truck",
    dimensions: {
      bedDims: [5, 7.5],
      engine: [4, 6],
      maxWeight: 6000,
    },
    // Pricing
    pricing: {
      baseFee: 10,
      minimumFee: 39.99,
      feePerMinute: 0.99,
      feePerMile: 3
    },
  },
  largeTruck: {
    img: "./assets/images/equipment-options/large-truck.png",
    title: "Large Truck",
    dimensions: {
      bedDims: [8, null],
      engine: [8, 12],
      maxWeight: 10000,
    },
    pricing: {
      baseFee: 10,
      minimumFee: 44.99,
      feePerMinute: 1.29,
      feePerMile: 3.5,
    },

  },
  boxVan: {
    img: "./assets/images/equipment-options/box-van.png",
    title: "Box Van",

    dimensions: {
      bedDims: [8, null],
      engine: [8, 12],
      maxWeight: 10000,
    },
    pricing: {
      baseFee: 10,
      minimumFee: 44.99,
      feePerMinute: 1.29,
      feePerMile: 3.5,
    }
  }
};
