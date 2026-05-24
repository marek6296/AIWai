// Slovenské administratívne členenie — 8 krajov × 79 okresov.
// Okresné mesto = názov okresu (s výnimkou Bratislavy/Košíc — tie sú jednotlivé okresy I-V; pre scraper
// stačí mestská lokácia, nie okresy I-V, takže ich aggregujeme do "Bratislava" / "Košice").

export type Region = { name: string; districts: string[] };

export const SK_REGIONS: Region[] = [
    {
        name: "Bratislavský kraj",
        districts: ["Bratislava", "Malacky", "Pezinok", "Senec"],
    },
    {
        name: "Trnavský kraj",
        districts: [
            "Trnava", "Dunajská Streda", "Galanta", "Hlohovec",
            "Piešťany", "Senica", "Skalica",
        ],
    },
    {
        name: "Trenčiansky kraj",
        districts: [
            "Trenčín", "Bánovce nad Bebravou", "Ilava", "Myjava",
            "Nové Mesto nad Váhom", "Partizánske", "Považská Bystrica",
            "Prievidza", "Púchov",
        ],
    },
    {
        name: "Nitriansky kraj",
        districts: [
            "Nitra", "Komárno", "Levice", "Nové Zámky",
            "Šaľa", "Topoľčany", "Zlaté Moravce",
        ],
    },
    {
        name: "Žilinský kraj",
        districts: [
            "Žilina", "Bytča", "Čadca", "Dolný Kubín",
            "Kysucké Nové Mesto", "Liptovský Mikuláš", "Martin",
            "Námestovo", "Ružomberok", "Turčianske Teplice", "Tvrdošín",
        ],
    },
    {
        name: "Banskobystrický kraj",
        districts: [
            "Banská Bystrica", "Banská Štiavnica", "Brezno", "Detva",
            "Krupina", "Lučenec", "Poltár", "Revúca", "Rimavská Sobota",
            "Veľký Krtíš", "Zvolen", "Žarnovica", "Žiar nad Hronom",
        ],
    },
    {
        name: "Prešovský kraj",
        districts: [
            "Prešov", "Bardejov", "Humenné", "Kežmarok", "Levoča",
            "Medzilaborce", "Poprad", "Sabinov", "Snina",
            "Stará Ľubovňa", "Stropkov", "Svidník", "Vranov nad Topľou",
        ],
    },
    {
        name: "Košický kraj",
        districts: [
            "Košice", "Gelnica", "Michalovce", "Rožňava",
            "Sobrance", "Spišská Nová Ves", "Trebišov",
        ],
    },
];

/** Vráti všetky mestá zo všetkých krajov — celé Slovensko (79 miest). */
export function allCities(): string[] {
    return SK_REGIONS.flatMap((r) => r.districts);
}

/** Vráti zoznam miest pre vybrané kraje. */
export function citiesFromRegions(regionNames: string[]): string[] {
    const set = new Set(regionNames);
    return SK_REGIONS.filter((r) => set.has(r.name)).flatMap((r) => r.districts);
}

export const DEFAULT_CATEGORIES = [
    "kaderníctvo", "kozmetický salón", "reštaurácia", "pekáreň",
    "fyzioterapeut", "zubná ambulancia", "autoservis", "kvetinárstvo",
    "lekáreň", "cukráreň", "fitnescentrum", "jazyková škola",
    "účtovník", "právnik", "realitná kancelária", "čistiareň",
    "hodinárstvo", "elektrikár", "inštalatér", "strechár",
    "taxislužba", "svadobný salón", "pohrebná služba", "veterinár",
    "masáže",
];
