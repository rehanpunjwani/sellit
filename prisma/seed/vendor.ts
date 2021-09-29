import { VendorType } from "@prisma/client";

export const vendorData = [
  { name: "Vendor 1", description: "this is vendor 1", type: VendorType.LOCAL },
  { name: "Vendor 2", description: "this is vendor 2", type: VendorType.IMPORT },
  { name: "Vendor 2", description: "this is vendor 2", type: VendorType.LOCAL },
]
