'use client';
import React from 'react'
import { useAuth } from '../_context/AuthContext';

const FriendsList = () => {
    const {userRelations, user} = useAuth();
  return (
    <div>FriendsList</div>
  )
}

export default FriendsList