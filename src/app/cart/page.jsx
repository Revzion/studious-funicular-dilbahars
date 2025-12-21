'use client'
import BlogListPage from '@/components/Blog/Blog'
import Cart from '@/components/Cart/Cart2'
import Bestseller from '@/components/Home/Bestseller'
import NewArrival from '@/components/NewArrival/NewArrival'
import React, { useState } from 'react'

const page = () => {
    const [showCart, setShowCart] = useState(true)
  return (
    <div className='bg-teal-50'>
    <Cart isOpen={showCart}/>
    <NewArrival />
    <Bestseller />
    </div>
    
  )
}

export default page