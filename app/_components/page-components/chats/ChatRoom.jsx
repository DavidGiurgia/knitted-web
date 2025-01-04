"use client";

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Button } from '@nextui-org/react'
import React, { useEffect } from 'react'
import ChatBox from '../../ChatBox'
import { usePanel } from '@/app/_context/PanelContext'

const ChatRoom = ({currUser, goBack}) => {
  const { setBottombar } = usePanel();

  useEffect(() => {
    setBottombar(false);
  }, [])
  
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex gap-x-4 items-center px-4 py-2 border-b border-gray-300 dark:border-gray-800 md:border-none">
        <Button onPress={() => {setBottombar(true); goBack();}} variant="light" isIconOnly>
          <ArrowLeftIcon className="size-5" />
        </Button>
        <h1 className="text-lg">{currUser?.username}</h1>
      </div>
      <ChatBox />
      </div>
  )
}

export default ChatRoom