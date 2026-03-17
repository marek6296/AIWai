import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'data', 'chatbot-config.json')

function readConfig() {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
}

function writeConfig(data: object) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2))
}

export async function DELETE(req: Request) {
    try {
        const { docId } = await req.json()
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
        return NextResponse.json({ error: String(err) }, { status: 500 })
    }
}
