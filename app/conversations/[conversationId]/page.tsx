interface IParams {
  conversationId: string
}

const ConversationId = async ({
  params
}: {
  params: IParams
}) => {
  return (
    <div>
      conversationId
    </div>
  )
}

export default ConversationId