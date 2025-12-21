"use client";

import React, { useState, useContext } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrderDetail } from "@/components/Orders/OrderDetail";
import { OrdersList } from "@/components/Orders/OrderList";
import { useSelector } from "react-redux";

const OrdersPage = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const user = useSelector((state) => state.user.user);

  const userId = user?.id;

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-8xl">
          <Link
            href="/account"
            className="flex items-center text-blue-600 mb-4 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Link>
          <h1 className="text-2xl font-bold mb-6">My Orders</h1>
          <div className="text-center py-16 text-red-600">
            Please log in to view your orders.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-8xl">
        <Link
          href="/account"
          className="flex items-center text-blue-600 mb-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Account
        </Link>


        {selectedOrderId ? (
         <OrderDetail orderData={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
        ) : (
          <OrdersList onOrderSelect={setSelectedOrderId} userId={userId} />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
