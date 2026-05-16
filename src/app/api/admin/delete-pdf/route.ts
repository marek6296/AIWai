import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/admin'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'chatbot-config.json')

const deleteSchema = z.object({
    // doc IDs majú formát `doc_<timestamp>` z upload-pdf route — držíme sa toho
    docId: z.string().regex(/^doc_[0-9a-zA-Z_-]+$/, 'Neplatné docId'),
})

function readConfig() {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
}

function writeConfig(data: object) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2))
}

export async function DELETE(req: Request) {
    // 🔐 Admin-only endpoint
    const unauthorized = requireAdmin(req)
    if (unauthorized) return unauthorized

    try {
        const json = await req.json().catch(() => null)
        const parsed = deleteSchema.safeParse(json)
        if (!parsed.success) {
            return NextResponse.json({ error: 'Neplatný vstup' }, { status: 400 })
        }
        const { docId } = parsed.data
        const config = readConfig()

        const allDocs: Array<{ id: string; text?: string; [key: string]: unknown }> = config.knowledge?._docs_with_text || []
        const filtered = allDocs.filter((d) => d.id !== docId)

        const combinedText = filtered
            .map((d) => `--- Dokument: ${d.name} ---\n${d.text || ''}`)
            .join('\n\n')

        const updatedConfig = {
            ...config,
            knowledge: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                documents: filtered.map(({ text: _omit, ...rest }) => rest),
                combinedText,
                _docs_with_text: filtered,
            },
        }

        writeConfig(updatedConfig)

        return NextResponse.json({ success: true, remaining: filtered.length })
    } catch (err) {
        console.error('[delete-pdf] error:', err)
        return NextResponse.json({ error: 'Chyba pri mazaní dokumentu' }, { status: 500 })
    }
}
