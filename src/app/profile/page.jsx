'use client'

// import { ProfileInformation } from '@/components/Profile/Profile';
import ProfilePage from '@/components/Profile/Sidebar';
import React from 'react'
// import { useSelector } from 'react-redux';

const page = () => {
  //   const user = useSelector((state) => state.user.user);
  // console.log('user', user)
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <ProfilePage /> 
    </div>
  )
}

export default page
