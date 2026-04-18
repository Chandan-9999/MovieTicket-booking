import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const Loading = () => {

  const {nextUrl}=useParams()
  const navigate=useNavigate()

  useEffect(()=>{
    if(nextUrl){
      setTimeout(()=>{
        navigate('/'+nextUrl)
      },8000)
    }
  },[])

  return (
    <div className='flex justify-center items-center h-[80vh]'>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className='rounded-full h-14 w-14 border-4 border-primary border-t-transparent animate-spin'
        ></motion.div>
    </div>
  )
}

export default Loading