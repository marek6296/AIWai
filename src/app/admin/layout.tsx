export const metadata = {
    title: 'AIWai Admin · Chatbot Console',
    description: 'AIWai Chatbot Management Dashboard',
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Auth is handled by middleware (simple cookie)
    return <>{children}</>
}
