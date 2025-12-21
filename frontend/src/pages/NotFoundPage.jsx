import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <>
    
    <button className='action-button'>
         <Link to="/">
         go back
         </Link>
        
         
    </button>
    </>
   
  )
}

export default NotFoundPage