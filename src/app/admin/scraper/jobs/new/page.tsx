import AdminShell from "@/app/admin/components/AdminShell";
import { NewJobForm } from "./NewJobForm";

export default function NewJobPage() {
    return (
        <AdminShell title="Nový scrape" subtitle="Spustí background job na Railway">
            <div className="max-w-2xl">
                <NewJobForm />
            </div>
        </AdminShell>
    );
}
