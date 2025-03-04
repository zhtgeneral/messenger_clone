
/**
 * This component is displayed when the user hasn't selected a conversation on desktop.
 * 
 * It renders a light grey background with the text 'Select a Chat or start a New Conversation'
 * 
 * @returns component
 */
export default function EmptyState() {
  return (
    <div className='px-4 py-10 sm:px-6 lg:px-8 h-full flex justify-center items-center bg-gray-100'>
      <div className='text-center items-center flex flex-col'>
        <h3 className='mt-2 text-2xl font-semibold text-gray-900'>
          Select a Chat or start a New Conversation
        </h3>
      </div>
    </div>
  )
}