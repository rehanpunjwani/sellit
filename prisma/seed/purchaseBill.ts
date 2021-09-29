import { vendorData } from "./vendor";

export const purchaseBillData = [
  {
    totalCost: 40000,
    advancePaid: 4000,
    tireQuantity: 200,
    costPaid: 20000,
    vendor: {
      create: vendorData[2]
    },
    nextPaymentDate: new Date('2022-03-22'),
    nextPaymentAmount: 20000
  },
  {
    totalCost: 200000,
    tireQuantity: 3000,
    costPaid: 200000,
    vendor: {
      create: vendorData[1]
    },
  },
  {
    totalCost: 300000,
    advancePaid: 100000,
    tireQuantity: 2000,
    costPaid: 100000,
    vendor: {
      create: vendorData[0]
    },
    nextPaymentDate: new Date('2021-11-02'),
    nextPaymentAmount: 100000
  },
  {
    totalCost: 175400,
    advancePaid: 17600,
    tireQuantity: 300,
    costPaid: 40000,
    vendor: {
      create: vendorData[1]
    },
    nextPaymentDate: new Date('2021-12-12'),
    nextPaymentAmount: 18000,
  },
  {
    totalCost: 378600,
    advancePaid: 0,
    tireQuantity: 340,
    costPaid: 378600,
    vendor: {
      create: vendorData[0]
    },
  },

]