import React from 'react'
import UserProfile from '../../UserProfile'

const ProfieSection = ({ currentUser, goBack }) => {
  return (
    <UserProfile currentUser={currentUser} goBack={goBack}/>
  )
}

export default ProfieSection