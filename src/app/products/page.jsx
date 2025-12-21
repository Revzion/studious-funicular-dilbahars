import ProductList from '@/components/products/ProductList'
import React from 'react'
import { Suspense } from "react";


const page = () => {
  return (
    <>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductList />
      </Suspense>
    </>
  )
}



export default page