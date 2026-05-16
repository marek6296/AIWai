#!/usr/bin/env python3
"""Jednorázový skript: zníži všetky ceny v projekte o ~50%, zaokrúhli na pekné čísla.

Bezpečný cez 2-fázový placeholder approach:
  Fáza 1: každú starú cenu nahradí unikátnym placeholderom (§§PRICE_NN§§).
  Fáza 2: placeholdery nahradí finálnymi novými cenami.

Bez placeholderov by sa 199 -> 99 zlialo s mapingom 99 -> 49 a Prezentačná
stránka by skončila ako 49 namiesto 99.

Spustený 2026-05-16. Po behu môže byť zmazaný.
"""
import re
import sys
from pathlib import Path

PRICE_MAP = {
    "69":  "35",
    "99":  "49",
    "139": "69",
    "159": "79",
    "169": "85",
    "199": "99",
    "209": "105",
    "349": "175",
    "399": "199",
    "599": "299",
    "699": "349",
}

TARGETS = [
    "src/i18n/translations.ts",
    "src/lib/seo/services.ts",
    "src/app/(main)/cennik/page.tsx",
    "src/lib/chatbot/knowledge.ts",
    "supabase/migrations/20260421_pricing.sql",
    "supabase/migrations/20260516_pricing_sync.sql",
]


def placeholder(idx):
    return "PHPRICE" + str(idx).zfill(2) + "PHEND"


def transform(text):
    items = sorted(PRICE_MAP.items(), key=lambda kv: -len(kv[0]))

    # Fáza 1: starý literál -> placeholder
    for idx, (old, _new) in enumerate(items):
        ph = placeholder(idx)
        text = re.sub(r"€" + old + r"(?!\d)", "€" + ph, text)
        text = re.sub(r"(?<!\d)" + old + r" €", ph + " €", text)
        text = re.sub(r'"' + old + r'"', '"' + ph + '"', text)
        text = re.sub(r"price_from\s*=\s*" + old + r"(?!\d)", "price_from = " + ph, text)
        text = re.sub(r"(,\s+)" + old + r"(\s*,)", r"\g<1>" + ph + r"\g<2>", text)

    # Fáza 2: placeholder -> nová cena
    for idx, (_old, new) in enumerate(items):
        text = text.replace(placeholder(idx), new)

    return text


def main():
    repo = Path(__file__).resolve().parent.parent
    changed = []
    for rel in TARGETS:
        path = repo / rel
        if not path.exists():
            print("SKIP missing: " + rel)
            continue
        original = path.read_text(encoding="utf-8")
        updated = transform(original)
        if original == updated:
            print("  no change: " + rel)
            continue
        path.write_text(updated, encoding="utf-8")
        n = sum(1 for a, b in zip(original.splitlines(), updated.splitlines()) if a != b)
        print("OK updated: " + rel + " (" + str(n) + " lines changed)")
        changed.append(rel)
    print("Done. " + str(len(changed)) + " file(s).")


if __name__ == "__main__":
    main()
