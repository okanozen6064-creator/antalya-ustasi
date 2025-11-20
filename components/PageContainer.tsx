interface PageContainerProps {
  children: React.ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-xl shadow-lg w-full max-w-5xl mx-auto">
        {children}
      </div>
    </div>
  )
}


