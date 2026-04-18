import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon }from 'lucide-react'
import { motion } from 'framer-motion'

const TrailersSection = () => {

    const [currentTrailer,setCurrentTrailer]=useState(dummyTrailers[0])
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>
            Trailers</motion.p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className='relative mt-6'>
            <BlurCircle top='-100px' right='-100px'/>
            <ReactPlayer url={currentTrailer.videoUrl} controls={true} 
            className='mx-auto max-w-full' width="100%" height="540px"/>
        </motion.div>

        <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 }}}}
            className='group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto'
        >
            {dummyTrailers.map((trailer)=>(
                <motion.div 
                    variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 }}}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                    key={trailer.image} 
                    className='relative group-hover:not-hover:opacity-50 cursor-pointer max-md:h-60 md:max-h-60' 
                    onClick={()=>setCurrentTrailer(trailer)}>
                    <img src={trailer.image} alt="trailer" className='rounded-lg w-full 
                    h-full object-cover brightness-75'/>
                    <PlayCircleIcon strokeWidth={1.6} className="absolute top-1/2 left-1/2
                    w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2"/>
                </motion.div>
            ))}

        </motion.div>
    </div>
  )
}

export default TrailersSection