export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 border-gray-200"></div>
        
        {/* Yükleniyor Metni */}
        <p className="text-gray-600 font-medium">Yükleniyor...</p>
      </div>
    </div>
  )
}

