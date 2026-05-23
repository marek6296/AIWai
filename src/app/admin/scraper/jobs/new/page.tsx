import AdminShell from "@/app/admin/components/AdminShell";
import { NewJobForm } from "./NewJobForm";
import { ScraperTabs } from "../../components/ScraperTabs";

export default function NewJobPage() {
    return (
        <AdminShell title="Nový scrape" subtitle="Spustí background job na Railway">
            <ScraperTabs />
            <div className="max-w-2xl">
                <NewJobForm />
            </div>
        </AdminShell>
    );
}
