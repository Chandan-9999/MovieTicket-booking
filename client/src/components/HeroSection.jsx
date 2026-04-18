import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, Calendar1Icon, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const HeroSection = () => {
    const navigate=useNavigate()

  const parentVariants = {
      hidden: { opacity: 0 },
      visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.2, delayChildren: 0.1 }
      }
  }

  const childVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={parentVariants}
        className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'>
        
        <motion.img variants={childVariants} src={assets.marvelLogo} alt="" className='max-h-100 lg:h-11 mt-20'/>
        <motion.h1 variants={childVariants} className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'> Guardians <br/> of the Galaxy</motion.h1>

        <motion.div variants={childVariants} className='flex items-center gap-4 text-gray-300'>
            <span>Action | Adventure | Sci-Fi</span>
            <div className='flex items-center gap-1'>
                <CalendarIcon className='w-4.5 h-4.5'/> 2014
            </div>
            <div className='flex items-center gap-1'>
                <ClockIcon className='w-4.5 h-4.5'/> 2h 1m
            </div>
        </motion.div>
        
        <motion.p variants={childVariants} className='max-w-md text-gray-300'>A bunch of skilled criminals led by brash adventurer Peter Quill join hands to fight a villain named Ronan the Accuser who wants to control the universe with the help of a mystical orb.</motion.p>
        
        <motion.button 
            variants={childVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=>navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
            Explore Movies 
            <ArrowRight className='w-5 h-5'/>
        </motion.button>
    </motion.div>
  )
}

export default HeroSection