import { usePanel } from '@/app/_context/PanelContext'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button, Switch } from '@heroui/react'
import React from 'react'

const PostSettingsSection = ({anonymously, setAnonymously }) => {
  const { popSubPanel } = usePanel();
  return (
    <div className='h-full w-full '>
      {/* Header */}
      <div className="flex items-center p-2 gap-x-2 flex-shrink-0 border-b border-gray-300 dark:border-gray-700">
        <Button onPress={popSubPanel} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <div className="font-semibold text-lg">Post audience</div>

        <Button
          size="sm"
          color="primary"
          className="ml-auto"
        >
          Post
        </Button>
      </div>
      <div className=' p-2'>
      <label htmlFor="comments">Comments</label>
      <div id='comments'>
        
      </div>
      </div>
    </div>
  )
}

export default PostSettingsSection