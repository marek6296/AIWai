interface JsonLdProps {
    data: Record<string, unknown> | Record<string, unknown>[];
    id: string;
}

/**
 * Server-rendered JSON-LD script tag.
 *
 * Why raw <script>: next/script with strategy="beforeInteractive" only works in the
 * root layout's <head>, not inside page bodies. A plain <script> tag with
 * dangerouslySetInnerHTML is the canonical Next.js App Router pattern for
 * structured data — it lands in the SSR HTML where Googlebot can read it
 * without executing any client-side JavaScript.
 */
export default function JsonLd({ data, id }: JsonLdProps) {
    return (
        <script
            id={id}
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
