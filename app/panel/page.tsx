import PageContainer from '@/components/PageContainer'

export default function PanelPage() {
  return (
    <PageContainer>
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Esnaf Paneline Hoş Geldiniz</h1>
        <p className="text-gray-600">
          Bu panelden profil bilgilerinizi düzenleyebilir, gelen iş taleplerini görüntüleyebilir ve
          işlerinizi yönetebilirsiniz.
        </p>
      </div>
    </PageContainer>
  )
}

