import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'chatbot-config.json')
const MAX_KNOWLEDGE_CHARS = 60000 // ~15k tokens safety limit

function readConfig() {
    try {
        return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
    } catch {
        return { knowledge: { documents: [], combinedText: '' } }
    }
}

function writeConfig(data: object) {
    fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true })
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2))
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('pdf') as File | null

        if (!file || file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Prosím nahrajte PDF súbor' }, { status: 400 })
        }

        if (file.size > 15 * 1024 * 1024) { // 15MB limit
            return NextResponse.json({ error: 'PDF je príliš veľké (max 15MB)' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())

        // Dynamic import to avoid Next.js test file issue with pdf-parse
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require('pdf-parse/lib/pdf-parse.js')
        const parsed = await pdfParse(buffer)
        let extractedText = parsed.text?.trim() || ''

        if (!extractedText) {
            return NextResponse.json({ error: 'Z PDF sa nepodarilo extrahovať text. Skontrolujte či nie je skenovaný obrázok.' }, { status: 422 })
        }

        const config = readConfig()
        const docs = config.knowledge?.documents || []

        // Check if total knowledge would exceed limit
        const currentTotalChars = (config.knowledge?.combinedText || '').length
        if (currentTotalChars + extractedText.length > MAX_KNOWLEDGE_CHARS) {
            // Truncate new doc to fit
            const available = MAX_KNOWLEDGE_CHARS - currentTotalChars
            if (available < 500) {
                return NextResponse.json({
                    error: `Knowledge base je plná (${MAX_KNOWLEDGE_CHARS.toLocaleString()} znakov). Zmaž niektoré dokumenty.`
                }, { status: 400 })
            }
            extractedText = extractedText.slice(0, available) + '\n[... text skrátený z dôvodu limitu ...]'
        }

        const docEntry = {
            id: `doc_${Date.now()}`,
            name: file.name,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            charCount: extractedText.length,
            pages: parsed.numpages || 0,
        }

        docs.push({ ...docEntry, text: extractedText })

        // Rebuild combined text
        const combinedText = docs
            .map((d: { name: string; text?: string }) => `--- Dokument: ${d.name} ---\n${d.text || ''}`)
            .join('\n\n')

        const updatedConfig = {
            ...config,
            knowledge: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                documents: docs.map(({ text: _omit, ...rest }: { text?: string; [key: string]: unknown }) => rest), // strip text from metadata list
                combinedText,
                // Store per-doc text for deletion support
                _docs_with_text: docs,
            },
        }

        writeConfig(updatedConfig)

        return NextResponse.json({
            success: true,
            document: { ...docEntry, preview: extractedText.slice(0, 300) + '...' },
            totalChars: combinedText.length,
            totalDocs: docs.length,
        })
    } catch (err) {
        console.error('PDF upload error:', err)
        return NextResponse.json({ error: `Chyba pri spracovaní: ${String(err)}` }, { status: 500 })
    }
}
