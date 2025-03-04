import { useParams } from "next/navigation";
import React from "react";

/**
 * This hook gives access `isOpen` and `conversationId` through Next.js params.
 */
export default function useConversation() {
  const params = useParams();

  const conversationId = React.useMemo(() => {
    if (!params?.conversationId) {
      return '';
    }
    return params.conversationId as string;
  }, [params?.conversationId]);

  const isOpen = React.useMemo(() => conversationId as unknown as boolean, [conversationId]);

  return React.useMemo(() => ({
    isOpen,
    conversationId
  }), [isOpen, conversationId]);
}