import React from 'react'
import FeedContainer from './FeedContainer'
import RightsideSection from './RightsideSection'

const HomeSection = ({switchPanel , rightSection = true}) => {
  return (
    <div className='w-full h-full bg-gray-100 dark:bg-gray-900 flex justify-center gap-x-10 md:pt-10'>
        
        <FeedContainer switchPanel={switchPanel}/>

        {rightSection && <RightsideSection />}
    </div>
  )
}

export default HomeSection