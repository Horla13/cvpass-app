export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-black">CVpass</h1>
          <p className="text-brand-gray text-sm mt-1">
            Optimisez votre CV pour les ATS
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
