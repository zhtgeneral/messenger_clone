import { useParams } from "next/navigation";
import { useMemo } from "react";

/**
 * This hook determines if a conversation is open using NextJS params
 * 
 * If a conversation exists, return the id of the conversation and `isOpen=true` in a memo.
 * 
 * Otherwise return `''` and `isopen=false` in a memo.
 * 
 * @returns react memo
 */
export default function useConversation() {
  const params = useParams();
  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return '';
    }
    return params.conversationId as string;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => conversationId as unknown as boolean, [conversationId]);

  return useMemo(() => ({
    isOpen,
    conversationId
  }), [isOpen, conversationId]);
}