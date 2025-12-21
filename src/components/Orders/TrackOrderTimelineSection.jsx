import React, { useEffect, useState, forwardRef } from "react";
import { trackOrderService } from "@/services/orderServices";

const TrackOrderTimelineSection = forwardRef(({ orderId }, ref) => {
  const [showDetails, setShowDetails] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setErr(null);
    setTrackingData(null);

    trackOrderService(orderId)
      .then((res) => {
        console.log("res", res);
        setTrackingData(res?.data);
        setLoading(false);
      })
      .catch((error) => {
        setErr(error?.error || error.response?.data?.error || "Could not fetch tracking details.");
        setLoading(false);
      });
  }, [orderId]);

  // Loading & error
  if (loading)
    return (
      <div
        ref={ref}
        className="bg-white shadow-lg rounded-xl p-6 my-6 w-full flex items-center justify-center min-h-[180px]"
      >
        <span className="text-blue-600 font-semibold">
          Loading tracking details...
        </span>
      </div>
    );
  if (err)
    return (
      <div
        ref={ref}
        className="bg-white shadow-lg rounded-xl p-6 my-6 w-full flex items-center justify-center min-h-[180px]"
      >
        <span className="text-red-600 font-semibold">{err}</span>
      </div>
    );

  // Data structure adjustment
  const shipment = trackingData?.data?.ShipmentData?.Shipment?.[0];

  if (!shipment) {
    return (
      <div
        ref={ref}
        className="bg-white shadow-lg rounded-xl p-6 my-6 w-full flex items-center justify-center min-h-[180px]"
      >
        <span className="text-slate-600">
          No shipment tracking details found.
        </span>
      </div>
    );
  }

  const summaryFields = [
    { label: "Waybill No", value: shipment.WaybillNo },
    { label: "Status", value: shipment.Status },
    { label: "Expected Delivery", value: shipment.ExpectedDelivery },
    {
      label: "Origin",
      value: `${shipment.Origin} (${shipment.OriginAreaCode})`,
    },
    {
      label: "Destination",
      value: `${shipment.Destination} (${shipment.DestionationAreaCode})`,
    },
  ];

  const renderTimeline = () => (
    <div className="pl-2 md:pl-6 pt-4">
      {shipment.Scans?.slice()
        .reverse()
        .map((item, idx, arr) => {
          const s = item.ScanDetail;
          return (
            <div key={idx} className="flex items-start relative mb-8 last:mb-0">
              <div className="flex flex-col items-center self-start">
                <span className="block w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow" />
                {idx < arr.length - 1 && (
                  <span className="block w-1 bg-blue-300 h-10 mx-auto" />
                )}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="font-semibold text-base text-gray-800">
                  {s.Scan}
                </p>
                <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
                  <span>
                    reached at: <b>{s.ScannedLocation}</b>
                  </span>
                  <span>Date: {s.ScanDate}</span>
                  <span>Time: {s.ScanTime}</span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );

  return (
    <div
      ref={ref}
      className="bg-white shadow-lg rounded-xl p-4 md:p-6 mb-6 w-full"
    >
      <h2 className="text-lg font-bold text-blue-700 mb-4 flex flex-wrap items-center gap-2">
        <span>Order Tracking</span>
      </h2>
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-2">
        {summaryFields.map((field) => (
          <div key={field.label}>
            <span className="font-semibold">{field.label}:</span>{" "}
            <span>{field.value}</span>
          </div>
        ))}
      </div>
      {/* Show details button */}
      {!showDetails && (
        <button
          className="mt-3 px-4 py-2 rounded border border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100 transition text-sm"
          onClick={() => setShowDetails(true)}
          aria-expanded={showDetails}
        >
          Show More
        </button>
      )}
      {/* Details (collapsible) */}
      {showDetails && (
        <div className="pt-3 animate-fadeIn">
          <div className="mt-4">
            <h3 className="text-base font-semibold text-blue-700 mb-2">
              Tracking Timeline
            </h3>
            {renderTimeline()}
          </div>

          <button
            className="mt-3 px-4 py-2 rounded border border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100 transition text-sm"
            onClick={() => setShowDetails(false)}
            aria-expanded={showDetails}
          >
            Show Less
          </button>
        </div>
      )}
    </div>
  );
});

export default TrackOrderTimelineSection;
