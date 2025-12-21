"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Home,
  Plus,
  CreditCard,
  Check,
  MapPin,
  Lock,
  IndianRupee,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrderService,
  createRazorpayOrderService,
} from "@/services/orderServices";
import { useRouter } from "next/navigation";
import { selectIsAuthenticated } from "../../redux/slice/userSlice";
import { clearUserCart, fetchCartItems } from "@/redux/thunks/cartThunks";
import { getProfileService } from "@/services/b2cServices";
import { fetchCompanyProfile } from "@/redux/slice/companySlice";

export default function AddressSelection2({ isOpen, onClose, appliedCoupon }) {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showNewBillingAddressForm, setShowNewBillingAddressForm] =
    useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [newAddress, setNewAddress] = useState({
    fullname: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    addresstype: "home",
    otherAddressType: "",
  });
  const [newBillingAddress, setNewBillingAddress] = useState({
    fullname: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    addresstype: "home",
    otherAddressType: "",
    companyName: "",
    gstNumber: "",
  });

  const [useSameForBilling, setUseSameForBilling] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const dispatch = useDispatch();
  const companyProfile = useSelector((state) => state.company.companyProfile);
  const router = useRouter();

  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [isPincodeVerified, setIsPincodeVerified] = useState({
    shipping: false,
    billing: false,
  });
  const [addressError, setAddressError] = useState("");
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector((state) => state.cart.items);
  const cartStatus = useSelector((state) => state.cart.status);
  const cartError = useSelector((state) => state.cart.error);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadScript = () => {
      if (document.getElementById("razorpay-script")) {
        setIsRazorpayLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setIsRazorpayLoaded(true);
        // console.log("Razorpay script loaded successfully");
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        setOrderError("Failed to load payment gateway");
        setIsRazorpayLoaded(false);
      };
      document.body.appendChild(script);
    };

    loadScript();

    return () => {};
  }, []);

  useEffect(() => {
    if (isOpen && isAuthenticated && !companyProfile) {
      dispatch(fetchCompanyProfile())
        .unwrap()
        .then((data) => {
          // console.log("company fetched", data);
        })
        .catch((error) => {
          console.error("Failed to fetch company profile:", error);
        });
    }
  }, [isOpen, isAuthenticated, companyProfile, dispatch]);

  const mappedCartItems =
    cartItems && Array.isArray(cartItems)
      ? cartItems.map((item, index) => ({
          productId: item.product_id || item._id || `item-${index}`,
          name:
            item.productDetails?.sku ||
            item.productDetails ||
            "Unknown Product",
          price: item.productDetails?.saleingPrice || item.price || 0,
          image: item.productDetails?.image || "null",
          quantity: item.product_quantity || 0,
        }))
      : [];

  const subtotal = mappedCartItems.reduce(
    (total, item) => total + (item.price * item.quantity || 0),
    0
  );
  const shipping =
    companyProfile?.shipping && subtotal >= companyProfile.shipping.minAmount
      ? 0
      : companyProfile?.shipping?.shippingCharge || 50;
  const total = appliedCoupon?.finalAmount
    ? appliedCoupon.finalAmount + shipping
    : Math.max(subtotal + shipping, 0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getProfileService();
        setUser(response.user);
        setAddresses(response.user?.address || []);
      } catch (error) {
        console.error("Fetch user error:", error);
        setOrderError(error.message || "Failed to fetch user data");
      }
    };

    if (isOpen) {
      fetchUserData();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCartItems());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (useSameForBilling && selectedAddress) {
      setSelectedBillingAddress(selectedAddress);
    }
  }, [selectedAddress, useSameForBilling]);

  const validatePincode = (pincode) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  };

  const handlePincodeCheck = async (pincode, type) => {
    if (!pincode) {
      setAddressError("Pincode is required");
      setIsPincodeVerified((prev) => ({ ...prev, [type]: false }));
      return;
    }

    if (!validatePincode(pincode)) {
      setAddressError(
        "Invalid pincode. Please enter a valid 6-digit Indian pincode"
      );
      setIsPincodeVerified((prev) => ({ ...prev, [type]: false }));
      return;
    }

    try {
      setIsPincodeLoading(true);
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0]?.Status !== "Success") {
        setAddressError(
          "Invalid pincode. Please enter a correct Indian pincode"
        );
        setIsPincodeVerified((prev) => ({ ...prev, [type]: false }));
        return;
      }

      const postOffice = data[0]?.PostOffice[0];
      if (postOffice) {
        if (type === "shipping") {
          setNewAddress((prev) => ({
            ...prev,
            state: postOffice.State,
            city: postOffice.District,
            country: "India",
          }));
        } else {
          setNewBillingAddress((prev) => ({
            ...prev,
            state: postOffice.State,
            city: postOffice.District,
            country: "India",
          }));
        }
        setIsPincodeVerified((prev) => ({ ...prev, [type]: true }));
        setAddressError("");
      }
    } catch (error) {
      setAddressError("Failed to verify pincode. Please try again.");
      setIsPincodeVerified((prev) => ({ ...prev, [type]: false }));
      console.error("Pincode API error:", error);
    } finally {
      setIsPincodeLoading(false);
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    if (name === "pincode" && value.length > 6) {
      return; // Prevent input beyond 6 digits
    }
    const newValue = name === "pincode" ? value.replace(/[^0-9]/g, "") : value;
    setNewAddress((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setAddressError("");
    if (name === "pincode") {
      setIsPincodeVerified((prev) => ({ ...prev, shipping: false }));
      if (newValue.length === 6) {
        handlePincodeCheck(newValue, "shipping");
      }
    }
  };

  const handleNewBillingAddressChange = (e) => {
    const { name, value } = e.target;
    if (name === "pincode" && value.length > 6) {
      return; // Prevent input beyond 6 digits
    }
    const newValue = name === "pincode" ? value.replace(/[^0-9]/g, "") : value;
    setNewBillingAddress((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setAddressError("");
    if (name === "pincode") {
      setIsPincodeVerified((prev) => ({ ...prev, billing: false }));
      if (newValue.length === 6) {
        handlePincodeCheck(newValue, "billing");
      }
    }
  };

  const handleAddNewAddress = () => {
    if (
      !newAddress.fullname ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode ||
      !newAddress.country ||
      !newAddress.addresstype ||
      (newAddress.addresstype === "other" && !newAddress.otherAddressType) ||
      !isPincodeVerified.shipping
    ) {
      setAddressError(
        !isPincodeVerified.shipping
          ? "Please verify the pincode before saving"
          : "Please fill in all required address fields"
      );
      return;
    }
    setSelectedAddress({
      fullname: newAddress.fullname,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      pincode: newAddress.pincode,
      country: newAddress.country,
      addresstype: newAddress.addresstype,
      otherAddressType:
        newAddress.addresstype === "other"
          ? newAddress.otherAddressType
          : undefined,
    });
    setShowNewAddressForm(false);
    setNewAddress({
      fullname: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      addresstype: "home",
      otherAddressType: "",
    });
    setIsPincodeVerified((prev) => ({ ...prev, shipping: false }));
    setAddressError("");
  };

  const handleAddNewBillingAddress = () => {
    if (
      !newBillingAddress.fullname ||
      !newBillingAddress.street ||
      !newBillingAddress.city ||
      !newBillingAddress.state ||
      !newBillingAddress.pincode ||
      !newBillingAddress.country ||
      !newBillingAddress.addresstype ||
      (newBillingAddress.addresstype === "other" &&
        !newBillingAddress.otherAddressType) ||
      !isPincodeVerified.billing
    ) {
      setAddressError(
        !isPincodeVerified.billing
          ? "Please verify the pincode before saving"
          : "Please fill in all required billing address fields"
      );
      return;
    }
    setSelectedBillingAddress({
      fullname: newBillingAddress.fullname,
      street: newBillingAddress.street,
      city: newBillingAddress.city,
      state: newBillingAddress.state,
      pincode: newBillingAddress.pincode,
      country: newBillingAddress.country,
      addresstype: newBillingAddress.addresstype,
      otherAddressType:
        newBillingAddress.addresstype === "other"
          ? newBillingAddress.otherAddressType
          : undefined,
      companyName: newBillingAddress.companyName || undefined,
      gstNumber: newBillingAddress.gstNumber || undefined,
    });
    setShowNewBillingAddressForm(false);
    setNewBillingAddress({
      fullname: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      addresstype: "home",
      otherAddressType: "",
      companyName: "",
      gstNumber: "",
    });
    setIsPincodeVerified((prev) => ({ ...prev, billing: false }));
    setAddressError("");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setOrderError("Please select or add a shipping address");
      return;
    }
    if (!selectedBillingAddress) {
      setOrderError("Please select or add a billing address");
      return;
    }
    if (!isAuthenticated) {
      setOrderError("Please log in to place an order");
      router.push("/login");
      return;
    }
    if (!mappedCartItems.length) {
      setOrderError("Cart is empty");
      return;
    }
    if (paymentMethod === "ONLINE" && (!isRazorpayLoaded || !window.Razorpay)) {
      setOrderError("Payment gateway not loaded. Please try again.");
      console.error("Razorpay not available:", {
        isRazorpayLoaded,
        windowRazorpay: !!window.Razorpay,
      });
      return;
    }

    setOrderLoading(true);
    setOrderError(null);

    const orderData = {
      items: mappedCartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      shippingAddress: {
        addressLine1: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        country: selectedAddress.country,
      },
      billingAddress: {
        addressLine1: selectedBillingAddress.street,
        city: selectedBillingAddress.city,
        state: selectedBillingAddress.state,
        pincode: selectedBillingAddress.pincode,
        country: selectedBillingAddress.country,
      },
      couponCode: appliedCoupon?.code || "",
      paymentInfo: {
        method: paymentMethod,
        paymentId: paymentMethod === "COD" ? `COD_${Date.now()}` : null,
      },
      isGift: false,
      giftMessage: "",
    };

    try {
      // Prepare data for OrderConfirmation page using orderResponse fields
      const confirmationData = {
        orderNumber: "",
        totalAmount: 0,
        discountAmount: 0,
        shippingCharge: 0,
        payableAmount: 0,
        shippingAddress: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.pincode}, ${selectedAddress.country}`,
      };

      if (paymentMethod === "COD") {
        // Direct order creation for COD
        const orderResponse = await addOrderService(orderData);
        // console.log("orderResponse", orderResponse);

        // Update confirmationData with response data
        confirmationData.orderNumber = orderResponse.orderId || "";
        confirmationData.totalAmount = orderResponse.totalAmount || 0;
        confirmationData.discountAmount = orderResponse.discountAmount || 0;
        confirmationData.shippingCharge = orderResponse.shippingCharge || 0;
        confirmationData.payableAmount = orderResponse.payableAmount || 0;

        // Clear cart and close modal
        try {
          await dispatch(clearUserCart()).unwrap();
        } catch (error) {
          console.error("Failed to clear cart:", error);
          setOrderError(
            "Order placed, but failed to clear cart. Please clear manually."
          );
        }

        onClose(); // Ensure modal closes
        const targetPath = `/orderconfirmation?orderData=${encodeURIComponent(
          JSON.stringify(confirmationData)
        )}`;
        // console.log("Navigating to:", targetPath);
        router.push(targetPath);
      } else {
        // Razorpay flow for Online payment
        if (total <= 0) {
          setOrderError("Order total must be greater than zero.");
          setOrderLoading(false);
          return;
        }
        const razorpayData = await createRazorpayOrderService(
          total,
          mappedCartItems.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
          appliedCoupon ? { code: appliedCoupon.code } : {}
        );
        // console.log("razorpayData", razorpayData);

        const options = {
          key: razorpayData.key,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
          order_id: razorpayData.orderId,
          name: "Your E-commerce Store",
          description: "Order Payment",
          handler: async function (response) {
            try {
              orderData.paymentInfo.paymentId = response.razorpay_payment_id;
              const orderResponse = await addOrderService(orderData);
              // console.log("orderResponse", orderResponse);

              // Update confirmationData with response data
              confirmationData.orderNumber = orderResponse.orderId || "";
              confirmationData.totalAmount = orderResponse.totalAmount || 0;
              confirmationData.discountAmount =
                orderResponse.discountAmount || 0;
              confirmationData.shippingCharge =
                orderResponse.shippingCharge || 0;
              confirmationData.payableAmount = orderResponse.payableAmount || 0;

              // Clear cart and close modal
              try {
                await dispatch(clearUserCart()).unwrap();
              } catch (error) {
                console.error("Failed to clear cart:", error);
                setOrderError(
                  "Order placed, but failed to clear cart. Please clear manually."
                );
              }

              onClose();
              const targetPath = `/orderconfirmation?orderData=${encodeURIComponent(
                JSON.stringify(confirmationData)
              )}`;
              // console.log("Navigating to:", targetPath);
              router.push(targetPath);
            } catch (error) {
              console.error("Order placement error:", error);
              setOrderError(error.message || "Failed to place order");
              setOrderLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setOrderError("Payment cancelled");
              setOrderLoading(false);
            },
          },
          prefill: {
            name: user?.fullname
              ? `${user.fullname.firstname} ${user.fullname.lastname}`.trim()
              : "",
            email: user?.email || "",
            contact: user?.phoneNo || "",
          },
          theme: {
            color: "#34D399",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("Payment failed:", response.error);
          setOrderError(
            response.error.description || "Payment failed. Please try again."
          );
          setOrderLoading(false);
        });
        rzp.open();
      }
    } catch (error) {
      console.error("Order initiation error:", error.response?.data?.message);
      setOrderError(
        error.response?.data?.message || "Failed to initiate order"
      );
      setOrderLoading(false);
    }
  };

  const handleAddressSelection = (address) => {
    setSelectedAddress({
      fullname: `${user?.fullname?.firstname || ""} ${
        user?.fullname?.lastname || ""
      }`.trim(),
      street: address.addressinfo.street,
      city: address.addressinfo.city,
      state: address.addressinfo.state,
      pincode: address.addressinfo.pincode,
      country: address.addressinfo.country,
      addresstype: address.addresstype,
      otherAddressType:
        address.addresstype === "other" ? address.customType : undefined,
      _id: address._id,
    });
  };

  const handleBillingAddressSelection = (address) => {
    setSelectedBillingAddress({
      fullname: `${user?.fullname?.firstname || ""} ${
        user?.fullname?.lastname || ""
      }`.trim(),
      street: address.addressinfo.street,
      city: address.addressinfo.city,
      state: address.addressinfo.state,
      pincode: address.addressinfo.pincode,
      country: address.addressinfo.country,
      addresstype: address.addresstype,
      otherAddressType:
        address.addresstype === "other" ? address.customType : undefined,
      _id: address._id,
    });
  };

  const handleCancelNewAddress = () => {
    setShowNewAddressForm(false);
    setShowNewBillingAddressForm(false);
    setNewAddress({
      fullname: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      addresstype: "home",
      otherAddressType: "",
    });
    setNewBillingAddress({
      fullname: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      addresstype: "home",
      otherAddressType: "",
      companyName: "",
      gstNumber: "",
    });
    setIsPincodeVerified({ shipping: false, billing: false });
    setAddressError("");
  };

  const isUnauthorized =
    !isAuthenticated ||
    cartStatus === "failed" ||
    cartItems === null ||
    (cartError &&
      (cartError.status === 401 ||
        cartError.message?.toLowerCase().includes("unauthorized")));

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full md:w-96 lg:w-[28rem] z-[1000] flex flex-col bg-white"
          >
            <motion.div
              style={{
                background:
                  "linear-gradient(to right, #cffafe 0%, #ffffff 50%, #cffafe 100%)",
              }}
              className="p-5 shadow-lg"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center">
                <motion.div
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.03 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, -5, 5, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  >
                    <MapPin size={28} className="text-green-300" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-indigo-900">
                    Select Address
                  </h2>
                </motion.div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full bg-green-500 hover:bg-green-400 text-white transition-colors"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                >
                  <X size={24} />
                </motion.button>
              </div>
            </motion.div>

            <div className="flex-grow overflow-auto bg-white shadow-inner p-4">
              {isUnauthorized ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-green-100 p-6 rounded-full mb-4">
                    <Lock size={60} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    Authorization Required
                  </h3>
                  <p className="text-green-500 mb-6">
                    Please log in to view your addresses
                  </p>
                  <motion.button
                    className="bg-gradient-to-r from-blue-500 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onClose();
                      router.push("/login");
                    }}
                  >
                    Log In
                  </motion.button>
                </motion.div>
              ) : addresses.length === 0 &&
                !showNewAddressForm &&
                !showNewBillingAddressForm ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full p-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-green-100 p-6 rounded-full mb-4">
                    <Home size={60} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    No Addresses Found
                  </h3>
                  <p className="text-green-500 mb-6">
                    Add a new address to continue
                  </p>
                  <motion.button
                    className="bg-gradient-to-r from-blue-500 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewAddressForm(true)}
                  >
                    Add New Address
                  </motion.button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {!showNewAddressForm && !showNewBillingAddressForm ? (
                    <>
                      <div>
                        <h3 className="text-lg font-bold text-green-800 mb-3">
                          Shipping Address
                        </h3>
                        <motion.button
                          className="w-full bg-green-100 text-green-800 font-bold py-3 px-6 rounded-full shadow-md flex items-center justify-center space-x-2 mb-3"
                          whileHover={{
                            scale: 1.03,
                            boxShadow:
                              "0 10px 25px -5px rgba(147, 51, 234, 0.5)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowNewAddressForm(true)}
                        >
                          <Plus size={20} />
                          <span>Add New Shipping Address</span>
                        </motion.button>
                        <motion.ul
                          className="space-y-3"
                          initial="hidden"
                          animate="visible"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: { staggerChildren: 0.1 },
                            },
                          }}
                        >
                          {addresses.map((address, index) => (
                            <motion.li
                              key={address._id || index}
                              className={`rounded-xl p-4 shadow-md border-2 ${
                                selectedAddress?._id === address._id
                                  ? "border-green-500 bg-green-50"
                                  : "border-green-100"
                              } cursor-pointer relative`}
                              variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                              }}
                              onClick={() => handleAddressSelection(address)}
                            >
                              <div className="flex items-center space-x-3">
                                <Home size={24} className="text-green-600" />
                                <div>
                                  <p className="font-bold text-green-800">
                                    {address.addresstype === "other" &&
                                    address.customType
                                      ? address.customType
                                      : address.addresstype
                                          .charAt(0)
                                          .toUpperCase() +
                                        address.addresstype.slice(1)}{" "}
                                    Address
                                  </p>
                                  <p className="text-sm text-green-600">
                                    {address.addressinfo.street},{" "}
                                    {address.addressinfo.city},{" "}
                                    {address.addressinfo.state}{" "}
                                    {address.addressinfo.pincode},{" "}
                                    {address.addressinfo.country}
                                  </p>
                                </div>
                                {selectedAddress?._id === address._id && (
                                  <Check
                                    size={20}
                                    className="absolute right-4 text-green-600"
                                  />
                                )}
                              </div>
                            </motion.li>
                          ))}
                        </motion.ul>
                      </div>

                      {selectedAddress && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={useSameForBilling}
                              onChange={(e) =>
                                setUseSameForBilling(e.target.checked)
                              }
                              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-green-800 font-medium">
                              Use same address for billing
                            </span>
                          </label>
                        </div>
                      )}

                      {selectedAddress && !useSameForBilling && (
                        <div>
                          <h3 className="text-lg font-bold text-green-800 mb-3">
                            Billing Address
                          </h3>
                          <motion.button
                            className="w-full bg-blue-100 text-blue-800 font-bold py-3 px-6 rounded-full shadow-md flex items-center justify-center space-x-2 mb-3"
                            whileHover={{
                              scale: 1.03,
                              boxShadow:
                                "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowNewBillingAddressForm(true)}
                          >
                            <Plus size={20} />
                            <span>Add New Billing Address</span>
                          </motion.button>
                          <motion.ul
                            className="space-y-3"
                            initial="hidden"
                            animate="visible"
                            variants={{
                              hidden: { opacity: 0 },
                              visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 },
                              },
                            }}
                          >
                            {addresses.map((address, index) => (
                              <motion.li
                                key={`billing-${address._id || index}`}
                                className={`rounded-xl p-4 shadow-md border-2 ${
                                  selectedBillingAddress?._id === address._id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-blue-100"
                                } cursor-pointer relative`}
                                variants={{
                                  hidden: { opacity: 0, y: 20 },
                                  visible: { opacity: 1, y: 0 },
                                }}
                                onClick={() =>
                                  handleBillingAddressSelection(address)
                                }
                              >
                                <div className="flex items-center space-x-3">
                                  <Home size={24} className="text-blue-600" />
                                  <div>
                                    <p className="font-bold text-blue-800">
                                      {address.addresstype === "other" &&
                                      address.customType
                                        ? address.customType
                                        : address.addresstype
                                            .charAt(0)
                                            .toUpperCase() +
                                          address.addresstype.slice(1)}
                                    </p>
                                    <p className="text-sm text-blue-600">
                                      {address.addressinfo.street},{" "}
                                      {address.addressinfo.city},{" "}
                                      {address.addressinfo.state}{" "}
                                      {address.addressinfo.pincode},{" "}
                                      {address.addressinfo.country}
                                    </p>
                                  </div>
                                  {selectedBillingAddress?._id ===
                                    address._id && (
                                    <Check
                                      size={20}
                                      className="absolute right-4 text-blue-600"
                                    />
                                  )}
                                </div>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </div>
                      )}
                    </>
                  ) : showNewAddressForm ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl p-4 shadow-md border-2 border-green-100"
                    >
                      <h3 className="text-lg font-bold text-green-800 mb-4">
                        Add New Shipping Address
                      </h3>
                      {addressError && (
                        <p className="text-red-500 text-sm mb-3">
                          {addressError}
                        </p>
                      )}
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="fullname"
                          value={newAddress.fullname}
                          onChange={handleNewAddressChange}
                          placeholder="Full Name"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <select
                          name="addresstype"
                          value={newAddress.addresstype}
                          onChange={handleNewAddressChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                        {newAddress.addresstype === "other" && (
                          <input
                            type="text"
                            name="otherAddressType"
                            value={newAddress.otherAddressType}
                            onChange={handleNewAddressChange}
                            placeholder="Enter custom address type"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        )}
                        <input
                          type="text"
                          name="street"
                          value={newAddress.street}
                          onChange={handleNewAddressChange}
                          placeholder="Street Address"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <div className="relative">
                          <input
                            type="text"
                            name="pincode"
                            value={newAddress.pincode}
                            onChange={handleNewAddressChange}
                            placeholder="Pincode"
                            maxLength={6}
                            inputMode="numeric"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                          {isPincodeLoading && (
                            <div className="absolute right-3 top-2">
                              <svg
                                className="animate-spin h-5 w-5 text-green-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          name="city"
                          value={newAddress.city}
                          onChange={handleNewAddressChange}
                          placeholder="City"
                          disabled={isPincodeLoading}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <input
                          type="text"
                          name="state"
                          value={newAddress.state}
                          onChange={handleNewAddressChange}
                          placeholder="State"
                          disabled={isPincodeLoading}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <input
                          type="text"
                          name="country"
                          value={newAddress.country}
                          onChange={handleNewAddressChange}
                          placeholder="Country"
                          disabled={isPincodeLoading}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <div className="flex space-x-2">
                          <motion.button
                            className="flex-1 bg-green-600 text-white font-bold py-2 rounded-md"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddNewAddress}
                            disabled={
                              isPincodeLoading ||
                              !newAddress.fullname ||
                              !newAddress.street ||
                              !newAddress.city ||
                              !newAddress.state ||
                              !newAddress.pincode ||
                              !newAddress.country ||
                              !newAddress.addresstype ||
                              (newAddress.addresstype === "other" &&
                                !newAddress.otherAddressType) ||
                              !isPincodeVerified.shipping
                            }
                          >
                            Save Address
                          </motion.button>
                          <motion.button
                            className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 rounded-md"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCancelNewAddress}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl p-4 shadow-md border-2 border-blue-100"
                    >
                      <h3 className="text-lg font-bold text-blue-800 mb-4">
                        Add New Billing Address
                      </h3>
                      {addressError && (
                        <p className="text-red-500 text-sm mb-3">
                          {addressError}
                        </p>
                      )}
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="fullname"
                          value={newBillingAddress.fullname}
                          onChange={handleNewBillingAddressChange}
                          placeholder="Full Name"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                          name="addresstype"
                          value={newBillingAddress.addresstype}
                          onChange={handleNewBillingAddressChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                        {newBillingAddress.addresstype === "other" && (
                          <input
                            type="text"
                            name="otherAddressType"
                            value={newBillingAddress.otherAddressType}
                            onChange={handleNewBillingAddressChange}
                            placeholder="Enter custom address type"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                        <input
                          type="text"
                          name="street"
                          value={newBillingAddress.street}
                          onChange={handleNewBillingAddressChange}
                          placeholder="Street Address"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="relative">
                          <input
                            type="text"
                            name="pincode"
                            value={newBillingAddress.pincode}
                            onChange={handleNewBillingAddressChange}
                            placeholder="Pincode"
                            maxLength={6}
                            inputMode="numeric"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {isPincodeLoading && (
                            <div className="absolute right-3 top-2">
                              <svg
                                className="animate-spin h-5 w-5 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          name="city"
                          value={newBillingAddress.city}
                          onChange={handleNewBillingAddressChange}
                          placeholder="City"
                          disabled={isPincodeLoading}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <input
                          type="text"
                          name="state"
                          value={newBillingAddress.state}
                          onChange={handleNewBillingAddressChange}
                          placeholder="State"
                          disabled={isPincodeLoading}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <input
                          type="text"
                          name="country"
                          value={newBillingAddress.country}
                          onChange={handleNewBillingAddressChange}
                          placeholder="Country"
                          disabled={isPincodeLoading}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <input
                          type="text"
                          name="companyName"
                          value={newBillingAddress.companyName}
                          onChange={handleNewBillingAddressChange}
                          placeholder="Company Name (Optional)"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          name="gstNumber"
                          value={newBillingAddress.gstNumber}
                          onChange={handleNewBillingAddressChange}
                          placeholder="GST Number (Optional)"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex space-x-2">
                          <motion.button
                            className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-md"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddNewBillingAddress}
                            disabled={
                              isPincodeLoading ||
                              !newBillingAddress.fullname ||
                              !newBillingAddress.street ||
                              !newBillingAddress.city ||
                              !newBillingAddress.state ||
                              !newBillingAddress.pincode ||
                              !newBillingAddress.country ||
                              !newBillingAddress.addresstype ||
                              (newBillingAddress.addresstype === "other" &&
                                !newBillingAddress.otherAddressType) ||
                              !isPincodeVerified.billing
                            }
                          >
                            Save Address
                          </motion.button>
                          <motion.button
                            className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 rounded-md"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCancelNewAddress}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {!showNewAddressForm &&
              !showNewBillingAddressForm &&
              !isUnauthorized && (
                <motion.div
                  className="bg-gradient-to-r from-green-50 to-green-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="space-y-3">
                    {orderError && (
                      <p className="text-red-500 text-sm text-center">
                        {orderError}
                      </p>
                    )}
                    {selectedAddress && (
                      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                        <p className="font-bold text-green-800 mb-2">
                          Selected Shipping Address
                        </p>
                        <p className="text-sm text-green-600 mb-3">
                          {selectedAddress.fullname}, {selectedAddress.street},{" "}
                          {selectedAddress.city}, {selectedAddress.state}{" "}
                          {selectedAddress.pincode}, {selectedAddress.country}
                        </p>

                        {selectedBillingAddress && (
                          <>
                            <p className="font-bold text-blue-800 mb-2">
                              Selected Billing Address
                            </p>
                            <p className="text-sm text-blue-600">
                              {useSameForBilling ? (
                                <span className="italic">
                                  Same as shipping address
                                </span>
                              ) : (
                                `${selectedBillingAddress.fullname}, ${
                                  selectedBillingAddress.street
                                }, ${selectedBillingAddress.city}, ${
                                  selectedBillingAddress.state
                                } ${selectedBillingAddress.pincode}, ${
                                  selectedBillingAddress.country
                                }${
                                  selectedBillingAddress.companyName
                                    ? `, ${selectedBillingAddress.companyName}`
                                    : ""
                                }${
                                  selectedBillingAddress.gstNumber
                                    ? `, GST: ${selectedBillingAddress.gstNumber}`
                                    : ""
                                }`
                              )}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                    {selectedAddress && selectedBillingAddress && (
                      <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                        <p className="font-bold text-green-800 mb-2">
                          Payment Method
                        </p>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="ONLINE"
                              checked={paymentMethod === "ONLINE"}
                              onChange={() => setPaymentMethod("ONLINE")}
                              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                            />
                            <span className="text-green-800">Pay Online</span>
                            <CreditCard size={20} className="text-green-600" />
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="COD"
                              checked={paymentMethod === "COD"}
                              onChange={() => setPaymentMethod("COD")}
                              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                            />
                            <span className="text-green-800">
                              Cash on Delivery
                            </span>
                            <IndianRupee size={18} className="text-green-600" />
                          </label>
                        </div>
                      </div>
                    )}
                    <motion.button
                      className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center justify-center space-x-2"
                      whileHover={{
                        scale: 1.03,
                        boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.5)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      disabled={
                        orderLoading ||
                        !selectedAddress ||
                        !selectedBillingAddress ||
                        (paymentMethod === "ONLINE" && !isRazorpayLoaded)
                      }
                    >
                      <span>
                        {orderLoading
                          ? "Placing Order..."
                          : `Place Order (₹${total.toFixed(2)})`}
                      </span>
                      {paymentMethod === "ONLINE" ? (
                        <CreditCard size={20} />
                      ) : (
                        <IndianRupee size={18} />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
