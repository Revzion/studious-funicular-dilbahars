"use client";
import { useSearchParams } from "next/navigation";
import OrderConfirmation from "@/components/Cart/OrderConfirmation";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderData = searchParams.get("orderData");

  // Parse orderData from query
  let parsedOrderData = null;
  try {
    parsedOrderData = orderData
      ? JSON.parse(decodeURIComponent(orderData))
      : null;
  } catch (error) {
    console.error("Error parsing orderData:", error);
  }

  return <OrderConfirmation orderData={parsedOrderData} />;
}
