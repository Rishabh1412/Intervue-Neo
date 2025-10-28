import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

const page = async () => {
  const user = await getCurrentUser();
  const username = user?.name || "User";
  console.log("Current User in interview page:", user)
  return (
    <>
        <h3>Interview Generation</h3>
        <Agent userName={username} userId={user?.id} type="generate" />
    </>
  )
}

export default page