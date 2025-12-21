import React, { useState } from "react";
import { Star, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addItemToCart } from "@/redux/thunks/cartThunks";
import { selectUser } from "@/redux/slice/userSlice";
import { addGuestItem } from "@/redux/slice/cartSlice";
// import { toast } from '../Toast/Toast';

const ProductCard = ({
  product,
  isSelected,
  onToggle,
  showCheckbox = false,
}) => {
  const subproduct = product.subproduct[0];
  // const discountPercent = Math.round(((subproduct.mrp - subproduct.saleingPrice) / subproduct.mrp) * 100);

  return (
    <>
      <div className="bg-teal-50 rounded-lg border border-gray-200 p-2 sm:p-3 relative shadow-sm w-full max-w-[120px] sm:max-w-[160px] flex-shrink-0">
        {showCheckbox && (
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggle}
              className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </div>
        )}
        <Link href={`/products/${product._id}`}>
          <div className="mb-2 sm:mb-3 flex justify-center">
            <img
              src={subproduct.image[0].url}
              alt={product.title}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-indigo-900 mb-1 min-h-[1rem] leading-tight">
            {product.title}
          </h3>
        </Link>

        <p className="text-xs text-teal-600 mb-1 sm:mb-2 line-clamp-1">
          {subproduct.subtitle}
        </p>

        {/* Price */}
        <div className="mb-1">
          <div className="flex flex-col gap-0.5 sm:gap-1">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 line-through">
                ₹{subproduct.mrp}
              </span>
              <span className="text-xs text-green-600 font-medium">
                {subproduct.discountPercent}% off
              </span>
            </div>
            <span className="text-sm font-bold text-gray-900">
              ₹{subproduct.saleingPrice}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

const BoughtTogether = ({ data }) => {
  // console.log('data', data)
  const relatedProducts = data?.product?.relatedProducts || [];

  const [selectedItems, setSelectedItems] = useState(
    new Array(1 + relatedProducts.length).fill(true)
  );

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);

  const mainProduct = {
    _id: data?.product?._id,
    title: data?.product?.title,
    description: data?.product?.description,
    subproduct: [
      {
        _id: data?.product?.subproduct?.[0]?._id,
        subtitle: data?.product?.subproduct?.[0]?.sku,
        discountPercent: data?.product?.subproduct?.[0]?.discount,
        image: data?.product?.subproduct?.[0]?.image || [],
        mrp: data?.product?.subproduct?.[0]?.mrp,
        saleingPrice: data?.product?.subproduct?.[0]?.saleingPrice,
      },
    ],
  };

  // console.log('mainProduct', mainProduct)

  // Transform related products to match the expected structure
  const boughtTogether = relatedProducts.map((relatedProduct) => ({
    _id: relatedProduct.mainProductId._id,
    title: relatedProduct.mainProductId.title,
    description: relatedProduct.mainProductId.description,
    sku: relatedProduct.mainProductId.sku,
    minPrice: relatedProduct.mainProductId.minPrice,
    maxPrice: relatedProduct.mainProductId.maxPrice,
    isActive: relatedProduct.mainProductId.isActive,
    bestSaling: relatedProduct.mainProductId.bestSaling,
    subproduct: [
      {
        _id: relatedProduct.subProductId._id,
        subtitle: relatedProduct.subProductId.sku,
        discountPercent: relatedProduct.subProductId.discount,
        image: relatedProduct.subProductId.image || [],
        mrp: relatedProduct.subProductId.mrp,
        saleingPrice: relatedProduct.subProductId.saleingPrice,
      },
    ],
  }));

  // console.log('boughtTogether', boughtTogether)

  const toggleItem = (index) => {
    const newSelected = [...selectedItems];
    newSelected[index] = !newSelected[index];
    setSelectedItems(newSelected);
  };

  const getTotalPrice = () => {
    let total = 0;

    // Add main product price if selected
    if (selectedItems[0] && mainProduct.subproduct[0]) {
      total += mainProduct.subproduct[0].saleingPrice;
    }

    // Add related products prices if selected
    boughtTogether.forEach((product, index) => {
      if (selectedItems[index + 1] && product.subproduct[0]) {
        total += product.subproduct[0].saleingPrice;
      }
    });

    return total;
  };

  const getSelectedCount = () => {
    return selectedItems.filter((selected) => selected).length;
  };

  const showSuccessToast = (message, product = null) => {
    // Replace with your actual toast function
    // toast.success(message);
    // console.log('Success:', message, product);
  };

  const showErrorToast = (message) => {
    // toast.error(message);
    // console.log('Error:', message);
  };

  const showInfoToast = (message) => {
    // toast.info(message);
    // console.log('Info:', message);
  };

  const handleAddToCart = async () => {
    // console.log('callhjdvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv')
    const selectedCount = getSelectedCount();
    if (selectedCount === 0) {
      // showInfoToast("Please select at least one item to add to cart");
      return;
    }

    setIsAddingToCart(true);

    try {
      const addToCartPromises = [];
      const selectedProducts = [];

      if (!user) {
        // Guest cart handling
        // console.log('mainProduct', mainProduct)
        if (selectedItems[0] && mainProduct.subproduct[0]) {
          dispatch(
            addGuestItem({
              product_id: mainProduct.subproduct[0]._id,
              product_quantity: 1,
              productDetails: {
                image: mainProduct.subproduct[0].image,
                saleingPrice: mainProduct.subproduct[0].saleingPrice,
                sku: mainProduct.subproduct[0].sku || mainProduct.title,
                mrp: mainProduct.subproduct[0].mrp || 0,
                discount: mainProduct.subproduct[0].discountPercent || 0,
                category: mainProduct.category,
                _id: mainProduct.subproduct[0]._id,
              },
            })
          );
          selectedProducts.push(mainProduct.title);
        }
        // console.log('boughtTogether', boughtTogether)
        // Add related products to guest cart if selected
        boughtTogether.forEach((product, index) => {
          if (selectedItems[index + 1] && product.subproduct[0]) {
            dispatch(
              addGuestItem({
                product_id: product.subproduct[0]._id,
                product_quantity: 1,
                productDetails: {
                  image: product.subproduct[0].image,
                  saleingPrice: product.subproduct[0].saleingPrice,
                  sku: product.subproduct[0].sku || product.title,
                  mrp: product.subproduct[0].mrp || 0,
                  discount: product.subproduct[0].discountPercent || 0,
                  category: product.category,
                  _id: product.subproduct[0]._id,
                },
              })
            );
            selectedProducts.push(product.title);
          }
        });

        // Show success notification for guest cart
        if (selectedCount === 1) {
          // showSuccessToast(`${selectedProducts[0]} added to guest cart successfully!`);
        } else {
          // showSuccessToast(`${selectedCount} items added to guest cart successfully!`);
        }
        return;
      }

      // Original logic for logged-in users
      if (selectedItems[0] && mainProduct.subproduct[0]) {
        const cartData = {
          product_id: mainProduct.subproduct[0]._id,
          product_quantity: 1,
        };
        addToCartPromises.push(dispatch(addItemToCart(cartData)).unwrap());
        selectedProducts.push(mainProduct.title);
      }

      // Add related products to cart if selected
      boughtTogether.forEach((product, index) => {
        if (selectedItems[index + 1] && product.subproduct[0]) {
          const cartData = {
            product_id: product.subproduct[0]._id,
            product_quantity: 1,
          };
          addToCartPromises.push(dispatch(addItemToCart(cartData)).unwrap());
          selectedProducts.push(product.title);
        }
      });

      // Wait for all items to be added
      await Promise.all(addToCartPromises);

      // Show success notification
      if (selectedCount === 1) {
        // showSuccessToast(`${selectedProducts[0]} added to cart successfully!`);
      } else {
        // showSuccessToast(`${selectedCount} items added to cart successfully!`);
      }
    } catch (err) {
      console.error("Failed to add items to cart:", err);
      const errorMessage =
        err?.message || "Failed to add items to cart. Please try again.";
      // showErrorToast(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Don't render if no related products
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className="text-lg sm:text-xl font-bold text-teal-700 mb-4">
        Frequently bought together
      </h2>

      <div className="rounded-lg border border-gray-200 p-3">
        {/* Products Row - Mobile Scrollable, Desktop Centered */}
        <div className="mb-4">
          {/* Mobile: Show 2 cards initially, then scroll */}
          <div className="md:hidden">
            <div
              className={`flex ${
                boughtTogether.length <= 1
                  ? "justify-center"
                  : "overflow-x-auto scrollbar-hide"
              }`}
            >
              <div className="flex gap-1">
                {/* Main Product */}
                <ProductCard
                  product={mainProduct}
                  isSelected={selectedItems[0]}
                  onToggle={() => toggleItem(0)}
                  showCheckbox={true}
                />

                {/* Related Products with Plus icons */}
                {boughtTogether.map((product, index) => (
                  <React.Fragment key={index}>
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <Plus className="w-3 h-3 text-gray-400" />
                    </div>
                    <ProductCard
                      product={product}
                      isSelected={selectedItems[index + 1]}
                      onToggle={() => toggleItem(index + 1)}
                      showCheckbox={true}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Centered layout */}
          <div className="hidden md:flex items-center justify-center gap-1">
            {/* Main Product */}
            <ProductCard
              product={mainProduct}
              isSelected={selectedItems[0]}
              onToggle={() => toggleItem(0)}
              showCheckbox={true}
            />

            {/* Related Products with Plus icons */}
            {boughtTogether.map((product, index) => (
              <React.Fragment key={index}>
                <div className="flex-shrink-0">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <ProductCard
                  product={product}
                  isSelected={selectedItems[index + 1]}
                  onToggle={() => toggleItem(index + 1)}
                  showCheckbox={true}
                />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Summary Row */}
        <div className="border-t border-gray-200 pt-3 sm:pt-4">
          {/* Mobile: Stacked layout */}
          <div className="md:hidden">
            {/* Price Breakdown */}
            <div className="mb-3">
              <div className="flex items-center justify-center gap-2 text-sm overflow-x-auto scrollbar-hide pb-1">
                {/* Main Product Price */}
                {selectedItems[0] && (
                  <>
                    <div className="text-center flex-shrink-0">
                      <div className="text-xs text-gray-500">Main</div>
                      <div className="font-bold text-sm">
                        ₹{mainProduct.subproduct[0]?.saleingPrice || 0}
                      </div>
                    </div>
                    {boughtTogether.some(
                      (_, index) => selectedItems[index + 1]
                    ) && <span className="text-gray-400">+</span>}
                  </>
                )}

                {/* Related Products Prices */}
                {boughtTogether.map((product, index) =>
                  selectedItems[index + 1] ? (
                    <React.Fragment key={index}>
                      <div className="text-center flex-shrink-0">
                        <div className="text-xs text-gray-500">Add-on</div>
                        <div className="font-bold text-sm">
                          ₹{product.subproduct[0]?.saleingPrice || 0}
                        </div>
                      </div>
                      {index < boughtTogether.length - 1 &&
                        boughtTogether.some(
                          (_, idx) => idx > index && selectedItems[idx + 2]
                        ) && <span className="text-gray-400">+</span>}
                    </React.Fragment>
                  ) : null
                )}

                {getSelectedCount() > 0 && (
                  <>
                    <span className="text-gray-400">=</span>
                    <div className="text-center flex-shrink-0">
                      <div className="text-xs text-gray-500">Total</div>
                      <div className="text-base font-bold text-indigo-900">
                        ₹{getTotalPrice()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-blue-600 hover:to-teal-500 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              disabled={getSelectedCount() === 0 || isAddingToCart}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {isAddingToCart
                  ? "ADDING..."
                  : `ADD ${getSelectedCount()} ITEM${
                      getSelectedCount() !== 1 ? "S" : ""
                    } TO CART`}
              </span>
            </button>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden md:flex flex-col md:flex-row justify-between items-center">
            {/* Price Breakdown */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4 text-sm flex-wrap">
                {/* Main Product Price */}
                {selectedItems[0] && (
                  <>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Main Item</div>
                      <div className="font-bold">
                        ₹{mainProduct.subproduct[0]?.saleingPrice || 0}
                      </div>
                    </div>
                    {boughtTogether.some(
                      (_, index) => selectedItems[index + 1]
                    ) && <span className="text-gray-400">+</span>}
                  </>
                )}

                {/* Related Products Prices */}
                {boughtTogether.map((product, index) =>
                  selectedItems[index + 1] ? (
                    <React.Fragment key={index}>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">
                          Add-on {index + 1}
                        </div>
                        <div className="font-bold">
                          ₹{product.subproduct[0]?.saleingPrice || 0}
                        </div>
                      </div>
                      {index < boughtTogether.length - 1 &&
                        boughtTogether.some(
                          (_, idx) => idx > index && selectedItems[idx + 2]
                        ) && <span className="text-gray-400">+</span>}
                    </React.Fragment>
                  ) : null
                )}

                {getSelectedCount() > 0 && (
                  <>
                    <span className="text-gray-400">=</span>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Total</div>
                      <div className="text-lg font-bold text-indigo-900">
                        ₹{getTotalPrice()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full md:w-1/2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-blue-600 hover:to-teal-500 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              disabled={getSelectedCount() === 0 || isAddingToCart}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {isAddingToCart
                  ? "ADDING..."
                  : `ADD ${getSelectedCount()} ITEM${
                      getSelectedCount() !== 1 ? "S" : ""
                    } TO CART`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default BoughtTogether;
