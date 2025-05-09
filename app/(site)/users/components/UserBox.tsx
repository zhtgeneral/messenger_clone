import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { User } from "@prisma/client";
import UserBoxPresenter from "./UserBoxPresenter";

interface UserboxProps {
  user: User
}

/**
 * This component renders a single user as a box.
 * 
 * When clicked, it creates a new conversation with the user 
 * if there is no conversation yet.
 */
export default function Userbox({
  user
}: UserboxProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);
    axios.post('/api/conversations', {
      userId: user.id
    })
    .then((data) => {
      router.push(`/conversations/${data.data.id}`)
    })
    .finally(() => setIsLoading(false));
  }, [user, router]);

  return (
    <UserBoxPresenter 
      user={user}
      isLoading={isLoading}
      handleClick={handleClick}    
    />
  )
}