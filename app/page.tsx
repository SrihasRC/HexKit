import React from 'react'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import CTFTypes from '@/components/CTFTypes'
import Tools from '@/components/Tools'
import GetStarted from '@/components/GetStarted'

const page = () => {
  return (
    <div className=''>
      <Hero />
      <Features />
      <CTFTypes />
      <Tools />
      <GetStarted />
    </div>
  )
}

export default page
