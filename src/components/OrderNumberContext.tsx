import React, { createContext, useContext, useState } from "react";

interface OrderNumberContextType {
  orderNumber: string;
  setOrderNumber: (num: string) => void;
}

const OrderNumberContext = createContext<OrderNumberContextType | undefined>(undefined);

export const OrderNumberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderNumber, setOrderNumber] = useState("");
  return (
    <OrderNumberContext.Provider value={{ orderNumber, setOrderNumber }}>
      {children}
    </OrderNumberContext.Provider>
  );
};

export function useOrderNumberContext() {
  const ctx = useContext(OrderNumberContext);
  if (!ctx) throw new Error("useOrderNumberContext muss innerhalb eines OrderNumberProvider verwendet werden");
  return ctx;
} 