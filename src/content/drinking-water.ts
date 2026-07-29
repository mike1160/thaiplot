export type DrinkTone = 'danger' | 'caution' | 'good' | 'info'

export type DrinkCard = {
  badge: string
  title: string
  body: string[]
  list?: string[]
  source?: string
  tone: DrinkTone
}

export type CostRow = {
  option: string
  cost: string
  safety: string
  tone: DrinkTone
}

export type DrinkSection = {
  heading: string
  alert?: { strong: string; body: string }
  cards: DrinkCard[]
  costRows?: CostRow[]
  monthlyTitle?: string
  monthlyHeading?: string
  monthlyItems?: { label: string; value: string; tone: DrinkTone }[]
  costConclusion?: DrinkCard
  verdict?: { title: string; body: string }
}

export type DrinkWaterContent = {
  situation: DrinkSection
  options: DrinkSection
  vending: DrinkSection
  costs: DrinkSection
  advice: DrinkSection
}

const nl: DrinkWaterContent = {
  situation: {
    heading: 'Thailand is geen Nederland',
    alert: {
      strong: 'Belangrijk:',
      body: 'In Nederland behoort kraanwater tot het beste ter wereld. In Thailand geldt het tegenovergestelde — kraanwater is niet veilig om direct te drinken. De hele wateranalyse verandert daardoor volledig.',
    },
    cards: [
      {
        tone: 'danger',
        badge: 'Kraanwater',
        title: 'Behandeld bij de bron — maar gevaarlijk onderweg',
        body: [
          'Thailand scoort een 42,7 EPI-score voor waterkwaliteit, wat het land op plek 98 van de wereld plaatst. Het water wordt bij de waterzuiveringsinstallatie wel behandeld, maar het probleem zit in de distributie: oude, soms gecorrodeerde leidingen en dakwatertanks bij gebouwen voegen bacteriën, zware metalen en sediment toe. Zelfs lokale Thais drinken kraanwater niet direct.',
        ],
        source: 'Bron: A Backpacker\'s World 2025 / JourneyBloom / AllAboutDrink',
      },
      {
        tone: 'info',
        badge: 'Wat doen lokale Thais?',
        title: 'RO-filters thuis, waterautomaten, of grote kannen',
        body: [
          'De meeste Thaise huishoudens gebruiken één van drie opties: een waterfilter thuis (steeds vaker RO), de coin-operated waterautomaten in de buurt, of 19-liter waterkannen die wekelijks worden bezorgd. Flesjes kopen is meer een toeristen- en expat-gewoonte — duurder en meer plastic.',
          'De Thaise waterfiltermarkt was in 2024 waard USD 310 miljoen en groeit met 10% per jaar — een directe weerspiegeling van hoe noodzakelijk filtering wordt geacht.',
        ],
        source: 'Bron: Olympian Water Testing / JourneyBloom 2025',
      },
      {
        tone: 'caution',
        badge: 'Bangkok vs. landelijk',
        title: 'Kwaliteit verschilt sterk per locatie',
        body: [
          'In Bangkok houdt de Metropolitan Waterworks Authority (MWA) toezicht en rapporteerde in 2025 dat behandeld water aan 21 parameters voldoet bij vertrek uit de fabriek. Maar op het moment dat het je kraan bereikt — via oude leidingen en dakwatertanks — is die garantie verdwenen. In rurale gebieden is de situatie nog onzekerder.',
        ],
        source: 'Bron: MWA Consumer Confidence Report 2025 / AllAboutDrink',
      },
    ],
  },
  options: {
    heading: 'Drinkwateropties in Thailand — risico\'s en feiten',
    cards: [
      {
        tone: 'danger',
        badge: 'Optie 1: Kraanwater koken',
        title: 'Doodt bacteriën — maar niet genoeg',
        body: [
          'Koken (minstens 1 minuut rollend koken) doodt watergebonden ziekteverwekkers zoals bacteriën en virussen. Maar het verwijdert geen zware metalen, chemische verontreinigingen of particulair materiaal — en kan die zelfs concentreren doordat water verdampt. In Thailand, waar loodverontreiniging via oude leidingen een reëel risico is, is koken alleen dus onvoldoende.',
        ],
        source: 'Bron: Perfect Homes Chiang Mai / DrinkWater Thailand Guide 2025',
      },
      {
        tone: 'good',
        badge: 'Optie 2: 19-liter waterkan (levering)',
        title: 'Populairste optie bij Thais — betrouwbaar en goedkoop',
        body: [
          'Grote plastic kannen van 19 liter van erkende merken (bijv. Crystal, Sprinkle, Singha water) worden wekelijks thuisbezorgd. Prijs: ฿20–40 per kan. Ze worden gebruikt in een waterkoeler/dispenser op aanrecht of vrijstaand. Voordeel: schaalgrootte, lage prijs per liter, weinig gedoe. Nadeel: zware kannen optillen, en de dispenser zelf moet schoon blijven.',
        ],
      },
      {
        tone: 'info',
        badge: 'Optie 3: Thuis RO-filter',
        title: 'Beste kwaliteit — mits onderhoud',
        body: [
          'Een omgekeerde osmose (RO) systeem filtert bacteriën, virussen, zware metalen, chemicaliën en microplastics. In Thailand is dit de meest gekozen thuisfilteroplossing voor expats. Aanschafprijs: ฿3.000–8.000. Maar een RO-systeem vereist strikte filtervervanging. Onderzoek in Bangkok toonde aan dat waterautomaten met filters die minder dan 3× per jaar worden schoongemaakt, 14,5× meer kans hebben op coliformenbesmetting. Hetzelfde geldt voor thuissystemen die worden verwaarloosd.',
        ],
        source: 'Bron: Public Health of Indonesia / Bangkok vending machine study 2020',
      },
      {
        tone: 'good',
        badge: 'Optie 4: Huurfilter (Coway, etc.)',
        title: 'Onderhoud inbegrepen — ideaal voor expats',
        body: [
          'Merken als Coway (grote speler in Bangkok, 15%+ jaarlijkse groei) verhuren waterfilters inclusief periodiek onderhoud en filtervervanging. Kosten: ±฿599–900 per maand. Voordeel: je hoeft zelf niets bij te houden — precies het risico van verwaarloosde filters valt weg.',
        ],
        source: 'Bron: Olympian Water Testing Bangkok 2025',
      },
      {
        tone: 'caution',
        badge: 'Optie 5: Flessenwater',
        title: 'Veilig — maar duur en vol microplastics',
        body: [
          'Kleine flesjes (฿7–20) zijn overal verkrijgbaar en microbiologisch veilig. Onderzoek van Columbia University vond echter 110.000–400.000 micro- en nanoplasticdeeltjes per liter in flessenwater. Bovendien is het de duurste optie per liter en de meest belastende voor het milieu — zeker in een land waar plasticafval al een groot probleem is.',
        ],
      },
    ],
  },
  vending: {
    heading: 'De waterautomaat — ฿1 per 2 liter',
    cards: [
      {
        tone: 'good',
        badge: 'Wat is het?',
        title: 'Coin-operated RO + UV-automaten — overal in Thailand',
        body: [
          'Door heel Thailand staan buiten bij winkels, appartementen en op straathoeken blauwe of witte waterautomaten. Voor ฿1 krijg je circa 2 liter water, gefilterd via omgekeerde osmose (RO) én UV-sterilisatie. Thais komen met grote flessen en vullen ze bij voor dagelijks gebruik. Prijs per liter: ฿0,50 — een van de goedkoopste opties.',
        ],
        source: 'Bron: ExpatInsurance.com / Water-Insider.com 2026',
      },
      {
        tone: 'danger',
        badge: 'Het risico',
        title: 'Besmetting bij 28,5% van de geteste machines',
        body: [
          'Wetenschappelijk onderzoek testte 123 watermonsters uit automaten in Bangkok. Resultaat: bij 28,5% van de machines werden coliformbacteriën aangetroffen. De directe oorzaak? Filteronderhoud. Machines waarvan de filters minder dan 3 keer per jaar werden schoongemaakt hadden 14,5× meer kans op besmetting.',
          'Een journalist testte een machine naast een 7-Eleven en ontdekte dat er in het geheel geen onderhoud had plaatsgevonden. Stilstaand water in een warme tank zonder UV = bacteriegroei.',
        ],
        source: 'Bron: Public Health of Indonesia 2020 / Water-Insider 2026',
      },
      {
        tone: 'info',
        badge: 'Betrouwbare automaat kiezen',
        title: 'Checklist van de Thaise Dienst Volksgezondheid',
        body: [],
        list: [
          'Zoek een onderhoudslabel op de machine met naam bedrijf + datum laatste service',
          'Machine moet schoon ogen en ver van afvalcontainers staan',
          'Het water moet helder zijn en niet ruiken',
          'De binnenkant van de spuit moet van roestvrij staal zijn (geen plastic)',
          'UV-lamp aanwezig = extra veiligheid',
          'Drukke locaties = vaker gebruik = minder stilstaand water = veiliger',
        ],
        source: 'Bron: ExpatInsurance.com / Dr. Danai, Dept. of Public Health Thailand',
      },
    ],
  },
  costs: {
    heading: 'Kostenvergelijk — Thailand (2 personen, ~3L/dag)',
    cards: [],
    costRows: [
      { option: 'Kraanwater (direct drinken)', cost: 'Bijna gratis', safety: 'Niet veilig', tone: 'danger' },
      { option: 'Kraanwater gekookt', cost: 'Elektra ~฿20/mnd', safety: 'Bacteriën ok, zware metalen niet', tone: 'caution' },
      { option: 'Waterautomaat (coin-op)', cost: '฿1 per 2 liter', safety: 'Mits goed onderhouden', tone: 'good' },
      { option: 'Grote waterkan (19L levering)', cost: '฿20–40 per kan', safety: 'Betrouwbaar merk', tone: 'good' },
      { option: 'Flessenwater (0,5L winkel)', cost: '฿7–20 per fles', safety: 'Veilig / microplastics', tone: 'caution' },
      { option: 'Thuis RO-filter (installatie)', cost: '฿3.000–8.000 aanschaf + onderhoud', safety: 'Mits filters op schema', tone: 'info' },
      { option: 'Huurfilter (bijv. Coway)', cost: '฿599–900/mnd incl. service', safety: 'Onderhoud inbegrepen', tone: 'good' },
    ],
    monthlyTitle: 'Wat kost het per maand?',
    monthlyHeading: '2 personen, 3L/dag = 180L/mnd',
    monthlyItems: [
      { label: 'Flesjes (0,5L à ฿12)', value: '360 × ฿12 = ฿4.320/mnd', tone: 'danger' },
      { label: 'Waterautomaat', value: '180L × ฿0,50 = ฿90/mnd', tone: 'good' },
      { label: '19L kannen (฿30/kan)', value: '9–10 kannen = ฿270–300/mnd', tone: 'good' },
      { label: 'Huurfilter Coway e.d.', value: '฿599–900/mnd (alles inbegrepen)', tone: 'info' },
    ],
    costConclusion: {
      tone: 'caution',
      badge: 'Conclusie kosten',
      title: 'Flesjes zijn 48× duurder dan de waterautomaat',
      body: [
        'Bij 180 liter per maand kost de waterautomaat ฿90. Flesjes kopen kost ฿4.320 — 48 keer zoveel. Een huurfilter is bij langer verblijf de meest stabiele keuze: voorspelbare kosten, geen gedoe, professioneel onderhoud inbegrepen.',
      ],
    },
  },
  advice: {
    heading: 'Praktisch advies voor Thailand',
    cards: [
      {
        tone: 'good',
        badge: 'Kort verblijf / reizend',
        title: 'Flesjes of waterautomaten (gecontroleerd)',
        body: [
          'Koop flesjes van bekende merken (Singha, Crystal, Nestlé Pure Life) of gebruik een goed onderhouden waterautomaat. Controleer altijd het onderhoudslabel op de machine. Vermijd automaten zonder servicedatum of met troebel/geurend water.',
        ],
      },
      {
        tone: 'good',
        badge: 'Langer verblijf / expat',
        title: 'Huurfilter of 19L-kanlevering — de beste balans',
        body: [
          'Een huurfilter (Coway of lokale merken) met inbegrepen onderhoud lost precies het verwaarlozingsrisico op. Alternatief: wekelijkse levering van 19L-kannen van een erkend merk. Goedkoopst per liter: waterautomaat — maar alleen bij een machine met aantoonbaar onderhoud.',
          'Koopt u liever een eigen RO-systeem? Zet dan een kalenderherinnering voor filtervervanging (doorgaans elke 6–12 maanden afhankelijk van het type filter). Verwaarlozing is erger dan geen filter.',
        ],
      },
      {
        tone: 'caution',
        badge: 'Extra aandachtspunten',
        title: 'Wat veel mensen vergeten',
        body: [],
        list: [
          'IJsblokjes in restaurants: cilindrisch ijs met gat = fabrieksijs van gefilterd water (veiliger)',
          'Zelfgemaakt ijs of platte ijsblokjes = mogelijk onveilig',
          'Tanden poetsen: in grote steden relatief laag risico; bij twijfel gefilterd water gebruiken',
          'Groenten/fruit wassen: gebruik gefilterd of gekookt water als je het rauw eet',
          'Dakwatertanks: laat de eigenaar/beheerder regelmatig reinigen — een vergeten bron van besmetting',
        ],
        source: 'Bron: JourneyBloom / AllAboutDrink Thailand 2025',
      },
    ],
    verdict: {
      title: 'Kort samengevat',
      body: 'In Thailand kun je kraanwater sowieso niet drinken. Waterfilters en automaten werken goed in het begin, maar worden bij slecht onderhoud een risicobron — bevestigd door onderzoek waarbij 28,5% van de geteste Bangkok-automaten besmet bleek. Flessenwater is veilig maar duur, vol microplastics, en slecht voor het milieu. De slimste keuze hangt af van hoe lang je blijft en wat je bereid bent te betalen.',
    },
  },
}

const en: DrinkWaterContent = {
  situation: {
    heading: 'Thailand is not the Netherlands',
    alert: {
      strong: 'Important:',
      body: 'In the Netherlands, tap water ranks among the best in the world. In Thailand the opposite is true — tap water is not safe to drink directly. That changes the whole analysis.',
    },
    cards: [
      {
        tone: 'danger',
        badge: 'Tap water',
        title: 'Treated at the plant — risky on the way',
        body: [
          'Thailand scores 42.7 on the EPI for water quality (roughly 98th worldwide). Water is treated at the plant, but the problem is distribution: old, sometimes corroded pipes and rooftop tanks add bacteria, heavy metals and sediment. Even locals do not drink tap water straight from the tap.',
        ],
        source: 'Source: A Backpacker\'s World 2025 / JourneyBloom / AllAboutDrink',
      },
      {
        tone: 'info',
        badge: 'What locals do',
        title: 'Home RO filters, vending machines, or large jugs',
        body: [
          'Most Thai households use one of three options: a home filter (increasingly RO), nearby coin-operated water machines, or weekly delivered 19-litre jugs. Buying small bottles is more a tourist/expat habit — costlier and more plastic.',
          'Thailand’s water-filter market was worth USD 310 million in 2024 and grows about 10% a year — a clear sign that filtration is seen as necessary.',
        ],
        source: 'Source: Olympian Water Testing / JourneyBloom 2025',
      },
      {
        tone: 'caution',
        badge: 'Bangkok vs rural',
        title: 'Quality varies a lot by location',
        body: [
          'In Bangkok the Metropolitan Waterworks Authority (MWA) reported in 2025 that treated water meets 21 parameters leaving the plant. By the time it reaches your tap — via old pipes and rooftop tanks — that guarantee is gone. In rural areas the picture is even less certain.',
        ],
        source: 'Source: MWA Consumer Confidence Report 2025 / AllAboutDrink',
      },
    ],
  },
  options: {
    heading: 'Drinking-water options in Thailand — risks and facts',
    cards: [
      {
        tone: 'danger',
        badge: 'Option 1: Boiling tap water',
        title: 'Kills bacteria — but not enough',
        body: [
          'Boiling (at least 1 minute at a rolling boil) kills waterborne pathogens. It does not remove heavy metals, chemical contaminants or particles — and can concentrate them as water evaporates. Where lead from old pipes is a real risk, boiling alone is not enough.',
        ],
        source: 'Source: Perfect Homes Chiang Mai / DrinkWater Thailand Guide 2025',
      },
      {
        tone: 'good',
        badge: 'Option 2: 19-litre jug delivery',
        title: 'Most popular with Thais — reliable and cheap',
        body: [
          'Large 19-litre plastic jugs from known brands (e.g. Crystal, Sprinkle, Singha) are delivered weekly. Price: ฿20–40 per jug, used with a countertop or freestanding dispenser. Pros: scale, low cost per litre, little hassle. Cons: heavy jugs, and the dispenser must stay clean.',
        ],
      },
      {
        tone: 'info',
        badge: 'Option 3: Home RO filter',
        title: 'Best quality — if maintained',
        body: [
          'Reverse osmosis (RO) filters bacteria, viruses, heavy metals, chemicals and microplastics. It is the most common home setup for expats in Thailand. Purchase: ฿3,000–8,000. Strict filter replacement is essential. Research in Bangkok found vending machines cleaned fewer than 3× a year had 14.5× higher odds of coliform contamination — the same risk applies to neglected home systems.',
        ],
        source: 'Source: Public Health of Indonesia / Bangkok vending machine study 2020',
      },
      {
        tone: 'good',
        badge: 'Option 4: Rental filter (Coway, etc.)',
        title: 'Maintenance included — ideal for expats',
        body: [
          'Brands like Coway rent filters with scheduled maintenance and filter changes. Cost: about ฿599–900 per month. You do not have to track service yourself — which removes the neglect risk.',
        ],
        source: 'Source: Olympian Water Testing Bangkok 2025',
      },
      {
        tone: 'caution',
        badge: 'Option 5: Bottled water',
        title: 'Safe — but expensive and full of microplastics',
        body: [
          'Small bottles (฿7–20) are everywhere and microbiologically safe. Columbia University research found 110,000–400,000 micro- and nanoplastic particles per litre in bottled water. It is also the costliest per litre and hardest on the environment — especially where plastic waste is already a major issue.',
        ],
      },
    ],
  },
  vending: {
    heading: 'Water vending machines — ฿1 for ~2 litres',
    cards: [
      {
        tone: 'good',
        badge: 'What is it?',
        title: 'Coin-operated RO + UV machines — everywhere in Thailand',
        body: [
          'Across Thailand you find blue or white machines outside shops, apartments and on street corners. For ฿1 you get about 2 litres, filtered with reverse osmosis and UV sterilisation. Locals refill large bottles for daily use. Cost per litre: ฿0.50 — among the cheapest options.',
        ],
        source: 'Source: ExpatInsurance.com / Water-Insider.com 2026',
      },
      {
        tone: 'danger',
        badge: 'The risk',
        title: 'Contamination in 28.5% of tested machines',
        body: [
          'A study of 123 samples from Bangkok machines found coliform bacteria in 28.5%. The cause: filter maintenance. Machines cleaned fewer than three times a year had 14.5× higher odds of contamination.',
          'A journalist tested a machine next to a 7-Eleven and found no maintenance at all. Stagnant water in a warm tank without UV means bacterial growth.',
        ],
        source: 'Source: Public Health of Indonesia 2020 / Water-Insider 2026',
      },
      {
        tone: 'info',
        badge: 'Choosing a reliable machine',
        title: 'Checklist from Thailand’s public health guidance',
        body: [],
        list: [
          'Look for a maintenance label with company name and last service date',
          'Machine should look clean and stand away from waste bins',
          'Water should be clear and odourless',
          'Nozzle interior should be stainless steel (not plastic)',
          'UV lamp present = extra safety',
          'Busy locations = more use = less stagnant water = safer',
        ],
        source: 'Source: ExpatInsurance.com / Dr. Danai, Dept. of Public Health Thailand',
      },
    ],
  },
  costs: {
    heading: 'Cost comparison — Thailand (2 people, ~3L/day)',
    cards: [],
    costRows: [
      { option: 'Tap water (drink directly)', cost: 'Almost free', safety: 'Not safe', tone: 'danger' },
      { option: 'Boiled tap water', cost: 'Electricity ~฿20/mo', safety: 'Bacteria ok, heavy metals not', tone: 'caution' },
      { option: 'Vending machine (coin-op)', cost: '฿1 per 2 litres', safety: 'If well maintained', tone: 'good' },
      { option: 'Large jug (19L delivery)', cost: '฿20–40 per jug', safety: 'Trusted brand', tone: 'good' },
      { option: 'Bottled (0.5L shop)', cost: '฿7–20 per bottle', safety: 'Safe / microplastics', tone: 'caution' },
      { option: 'Home RO filter', cost: '฿3,000–8,000 + upkeep', safety: 'If filters on schedule', tone: 'info' },
      { option: 'Rental filter (e.g. Coway)', cost: '฿599–900/mo incl. service', safety: 'Maintenance included', tone: 'good' },
    ],
    monthlyTitle: 'Monthly cost?',
    monthlyHeading: '2 people, 3L/day = 180L/month',
    monthlyItems: [
      { label: 'Bottles (0.5L at ฿12)', value: '360 × ฿12 = ฿4,320/mo', tone: 'danger' },
      { label: 'Vending machine', value: '180L × ฿0.50 = ฿90/mo', tone: 'good' },
      { label: '19L jugs (฿30/jug)', value: '9–10 jugs = ฿270–300/mo', tone: 'good' },
      { label: 'Rental filter (Coway etc.)', value: '฿599–900/mo (all-in)', tone: 'info' },
    ],
    costConclusion: {
      tone: 'caution',
      badge: 'Cost takeaway',
      title: 'Bottles are ~48× more expensive than the vending machine',
      body: [
        'At 180 litres a month, a vending machine costs about ฿90. Bottles cost ฿4,320 — about 48 times more. For longer stays a rental filter is the most stable choice: predictable cost, no hassle, professional maintenance included.',
      ],
    },
  },
  advice: {
    heading: 'Practical advice for Thailand',
    cards: [
      {
        tone: 'good',
        badge: 'Short stay / travelling',
        title: 'Bottles or checked vending machines',
        body: [
          'Buy known brands (Singha, Crystal, Nestlé Pure Life) or use a well-maintained vending machine. Always check the service label. Avoid machines without a service date or with cloudy/smelly water.',
        ],
      },
      {
        tone: 'good',
        badge: 'Longer stay / expat',
        title: 'Rental filter or 19L delivery — best balance',
        body: [
          'A rental filter (Coway or local brands) with included maintenance removes neglect risk. Alternative: weekly 19L jugs from a trusted brand. Cheapest per litre: vending — only with proven maintenance.',
          'Prefer owning an RO system? Set calendar reminders for filter changes (typically every 6–12 months). Neglect is worse than no filter.',
        ],
      },
      {
        tone: 'caution',
        badge: 'Extra points people forget',
        title: 'Details that matter',
        body: [],
        list: [
          'Restaurant ice: cylindrical ice with a hole = factory ice from filtered water (safer)',
          'Homemade or flat ice cubes = possibly unsafe',
          'Brushing teeth: relatively low risk in big cities; use filtered water if unsure',
          'Washing produce: use filtered or boiled water if eating raw',
          'Rooftop tanks: ask owners/managers to clean regularly — a forgotten contamination source',
        ],
        source: 'Source: JourneyBloom / AllAboutDrink Thailand 2025',
      },
    ],
    verdict: {
      title: 'In short',
      body: 'You cannot drink tap water in Thailand. Filters and vending machines work well at first, but poor maintenance turns them into a risk — confirmed by research finding 28.5% of tested Bangkok machines contaminated. Bottled water is safe but expensive, full of microplastics, and hard on the environment. The smartest choice depends on how long you stay and what you will pay.',
    },
  },
}

const byLocale: Record<string, DrinkWaterContent> = {
  nl,
  en,
  de: en,
  th: en,
  sv: en,
  da: en,
  fr: en,
  ru: en,
  zh: en,
  ja: en,
}

export function getDrinkWaterContent(locale: string): DrinkWaterContent {
  return byLocale[locale] ?? en
}
