// --- 1. CENTRALIZED PRICE CONFIGURATION (Edit prices here) ---
const marketRates = {
    carrot: 250,
    tomato: 300,
    potato: 180,
    onion: 380,
    cabbage: 160,
    corn: 90,
    brinjal: 180,
    chili: 700,
    broccoli: 900,
    garlic: 600,
    pumpkin: 100,
    cucumber: 120,
    mushroom: 400,
    bellpepper: 800,
    greens: 80,
    apple: 900,
    banana: 140,
    mango: 300,
    watermelon: 150,
    orange: 800,
    lemon: 450,
    pineapple: 200,
    grapes: 1200,
    pear: 950,
    coconut: 100,
    strawberry: 1500,
    cherry: 2000,
    peach: 1100,
    kiwi: 1300,
    avocado: 400
};

// --- OPTIONAL: Remote / external prices loader ---
// If you prefer to keep prices in a separate file, update `data/prices.json`.
// The loader will override the inline `marketRates` and set a `pricesLastUpdated` timestamp.
async function loadPricesFromFile() {
    try {
        const resp = await fetch('data/prices.json', { cache: 'no-cache' });
        if (!resp.ok) throw new Error('Prices file not found');
        const json = await resp.json();
        if (json.rates) Object.assign(marketRates, json.rates);
        window.pricesLastUpdated = json.lastUpdated || new Date().toISOString();
        app.updateDynamicPrices();
        updateStatTime();
    } catch (e) {
        // Fallback: try to use the Last-Modified header of the page, else now()
        try {
            const head = await fetch(window.location.href, { method: 'HEAD' });
            const lm = head.headers.get('last-modified');
            window.pricesLastUpdated = lm ? new Date(lm).toISOString() : new Date().toISOString();
        } catch (_) {
            window.pricesLastUpdated = new Date().toISOString();
        }
        app.updateDynamicPrices();
        updateStatTime();
    }
}

function updateStatTime() {
    const el = document.getElementById('stat-update-time');
    if (!el) return;
    const iso = window.pricesLastUpdated || new Date().toISOString();
    const d = new Date(iso);
    el.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Trigger loader; harmless if the file doesn't exist
loadPricesFromFile().catch(() => {});

// --- 2. FLOATING ITEM CONFIG ---
const produceItems = [ 
    { id: "item_Tomato", icon: "🍅", key: "tomato" },
    { id: "item_Carrot", icon: "🥕", key: "carrot" },
    { id: "item_Banana", icon: "🍌", key: "banana" },
    { id: "item_Apple", icon: "🍎", key: "apple" },
    { id: "item_Cabbage", icon: "🥬", key: "cabbage" },
    { id: "item_GreenChili", icon: "🌶️", key: "chili" },
    { id: "item_BigOnion", icon: "🧅", key: "onion" },
    { id: "item_Potato", icon: "🥔", key: "potato" },
    { id: "item_Mango", icon: "🥭", key: "mango" },
    { id: "item_Beans", icon: "🫘", key: "greens" },
    { id: "item_Pumpkin", icon: "🎃", key: "pumpkin" },
    { id: "item_Brinjal", icon: "🍆", key: "brinjal" },
    { id: "item_Lime", icon: "🍋", key: "lemon" },
    { id: "item_Papaya", icon: "🍈", key: "avocado" },
    { id: "item_LeafyGreens", icon: "🍃", key: "greens" },
];

// --- 3. CENTRALIZED MARKET IMAGES (Edit recent images here) ---
let priceDataMap = {}; // Filled by generateDemoData for preview

// Helper for Date String
function getDateStr(daysOffset) {
    const date = new Date();
    date.setDate(date.getDate() - daysOffset);
    return date.toISOString().split('T')[0];
}

// --- TRANSLATIONS (i18n) ---
const translations = {
    en: {
        nav_home: "Home",
        nav_markets: "Markets",
        nav_about: "About",
        hero_title: "Daily Wholesale Vegetable Prices",
        site_title: "VeggiePrice - Sri Lankan Wholesale Market Prices",
        meta_description: "VeggiePrice provides daily wholesale vegetable prices from major Sri Lankan markets (Dambulla, Nuwara Eliya, Pettah). Updated daily to help farmers and buyers make informed decisions.",
        hero_highlight: "Vegetable",
        hero_subtitle: "Access daily wholesale vegetable prices directly from Dambulla, Nuwara Eliya, and Pettah. We provide real-time, accurate market updates to help farmers and consumers make smarter buying and selling decisions.",
        updated_label: "Updated:",
        today_text: "Today",
        yesterday_text: "Yesterday",
        days_ago: "Days Ago",
        select_market: "Select a Market",
        view_prices: "View Prices",
        back_markets: "Back to Markets",
        market_desc: "Browse the latest wholesale price lists below.",
        recent_updates: "Recent Updates",
        last_3_days: "Last 3 Days",
        no_updates: "No updates in the last 3 days.",
        view_past: "View Past Prices (Older than 3 days)",
        about_title: "About VeggiePrice",
        about_text_1: "VeggiePrice is a community project dedicated to bringing transparency to vegetable wholesale prices in Sri Lanka.",
        about_text_2: "We manually update price lists from major economic centers including Dambulla, Nuwara Eliya, and Pettah.",
        todays_rates: "Today's Rates",
        sample_prices: "Sample Wholesale",
        privacy: "Privacy",
        contact: "Contact",
        zoom_hint: "Tap to view list",
        nature_title: "Protect Nature, Preserve Life",

        // Trust & Stats
        trust_daily: "Updated Daily",
        trust_sl: "Sri Lankan Wholesale",
        stats_title: "Today at a Glance",
        stat_highest: "Highest",
        stat_dropped: "Dropped",
        stat_trending: "Trending",
        stat_time: "Time",
        stat_latest: "Latest Update",
        stat_high_demand: "High Demand",
        market_subtitle: "Choose a location to view detailed price lists.",
        update_time_msg: "Prices update between 11:00 AM - 1:00 PM daily.",
        thank_govt: "Special thanks to Department of Agriculture for price data.",

        // Updates
        msg_pending: "Update Pending (11am-1pm)",

        // Footer
        footer_desc: "Empowering Sri Lankan farmers and consumers with transparent, daily wholesale market data.",
        footer_quick: "Quick Links",
        footer_support: "Support",
        footer_contact: "Contact",
        footer_rights: "All rights reserved.",
        why_title: "Why use VeggiePrice?",
        why_subtitle: "Get reliable daily wholesale prices directly from major Sri Lankan markets, so farmers and buyers can make smarter decisions.",
        why_point_1: "Daily verified updates from local markets",
        why_point_1_sub: "Sourced and checked for accuracy.",
        why_point_2: "Easy-to-read prices & trends",
        why_point_2_sub: "Quick snapshots to guide decisions.",
        why_point_3: "Built for farmers & buyers",
        why_point_3_sub: "Practical tools designed locally.",
        why_point_4: "Transparent and community-driven",
        why_point_4_sub: "Open and accountable data sharing.",
        why_cta: "Explore Markets",

        // Stats Items
        stat_item_carrot: "Carrot",
        stat_item_tomato: "Tomato",
        stat_item_onion: "Big Onion",
        unit_kg: "/kg",
        text_today: "today",

        item_Tomato: "Tomato",
        item_Carrot: "Carrot",
        item_Banana: "Banana",
        item_Apple: "Apple",
        item_Cabbage: "Cabbage",
        item_GreenChili: "Green Chili",
        item_BigOnion: "Big Onion",
        item_Potato: "Potato",
        item_Mango: "Mango",
        item_Beans: "Beans",
        item_Pumpkin: "Pumpkin",
        item_Brinjal: "Brinjal",
        item_Lime: "Lime",
        item_Papaya: "Papaya",
        item_LeafyGreens: "Leafy Greens",

        // Vegetable Care Guide
        care_guide_title: "Vegetable Care Guide",
        care_guide_subtitle: "Learn about common diseases, symptoms, and organic fertilizers for healthy vegetables",
        select_vegetable: "Select a Vegetable",
        diseases: "Diseases",
        symptoms: "Symptoms",
        organic_fertilizers: "Organic Fertilizers",
        fertilizer_benefits: "Benefits",
        click_to_see: "Click to see diseases",
        click_disease: "Click disease to see treatments",
        recommended_fertilizers: "Recommended Organic Fertilizers",
        prevention_tips: "Prevention Tips",
        treatment_methods: "Treatment Methods"
    },
    si: {
        nav_home: "මුල් පිටුව",
        nav_markets: "වෙළඳපොල",
        nav_about: "අප ගැන",
        hero_title: "අද එළවළු තොග මිල",
        site_title: "VeggiePrice - ශ්‍රී ලංකා තොග මිල",
        meta_description: "VeggiePrice විසින් දඹුල්ල, නුවරඑළිය සහ පිටකොටුව ඇතුළු ප්‍රධාන වෙළඳපොලවල දෛනික තොග මිල දත්ත ලබාදේ. ගොවීන් සහ පාරිභෝගිකයින්ට හොඳ තීරණ ගැනීමට උපකාරී වේ.",
        hero_highlight: "එළවළු",
        hero_subtitle: "දඹුල්ල, නුවරඑළිය හා පිටකොටුව ආර්ථික මධ්‍යස්ථානවලින් සෘජුව ලබාගන්නා දෛනික තොග මිල. අපි නිවැරදි හා යාවත්කාලීන දත්ත ලබා දීමෙන් ගොවීන්ට සහ මිලදීගන්නන්ට ඉක්මන් තීරණ ගැනීමට උපකාර කරමු.",
        updated_label: "වේලාව:",
        today_text: "අද",
        yesterday_text: "ඊයේ",
        days_ago: "දිනකට පෙර",
        select_market: "වෙළඳපොල තෝරන්න",
        view_prices: "මිල බලන්න",
        back_markets: "ආපසු",
        market_desc: "නවතම තොග මිල ලැයිස්තු.",
        recent_updates: "නව මිල",
        last_3_days: "පසුගිය දින 3",
        no_updates: "යාවත්කාලීන කිරීම් නොමැත.",
        view_past: "පැරණි මිල ගණන්",
        about_title: "VeggiePrice ගැන",
        about_text_1: "VeggiePrice යනු එළවළු තොග මිල ගණන් පිළිබඳ විනිවිදභාවයක් ලබා දීම සඳහා වූ ව්‍යාපෘතියකි.",
        about_text_2: "දඹුල්ල, නුවරඑළිය සහ පිටකොටුව මධ්‍යස්ථානවලින් මිල ලැයිස්තු යාවත්කාලීන කරමු.",
        todays_rates: "අද මිල",
        sample_prices: "සාම්පල මිල",
        privacy: "රහස්‍යතා",
        contact: "සම්බන්ධ",
        zoom_hint: "විශාල කිරීමට",
        nature_title: "පරිසරය සුරකිමු",

        trust_daily: "දිනපතා යාවත්කාලීනයි",
        trust_sl: "ශ්‍රී ලංකා තොග වෙළඳපොල",
        stats_title: "වෙළඳපොල තත්ත්වය",
        stat_highest: "වැඩිම මිල",
        stat_dropped: "මිල අඩු වූ",
        stat_trending: "ඉහළ ඉල්ලුම",
        stat_time: "වේලාව",
        stat_latest: "නවතම යාවත්කාලීන",
        stat_high_demand: "ඉහළ ඉල්ලුමක්",
        market_subtitle: "මිල ගණන් බැලීමට ස්ථානයක් තෝරන්න.",
        update_time_msg: "මිල යාවත්කාලීන කිරීම: පෙ.ව. 11 - ප.ව. 1",
        thank_govt: "රාජ්‍ය කෘෂිකර්ම අමාත්‍යාංශයට විශේෂ ස්තූතිය.",

        msg_pending: "තවම යාවත්කාලීන කර නොමැත",

        footer_desc: "ගොවීන් සහ පාරිභෝගිකයින් සඳහා විශ්වාසවන්ත තොග මිල තොරතුරු.",
        footer_support: "සහාය",
        footer_contact: "අමතන්න",
        footer_rights: "සියලු හිමිකම් ඇවිරිණි.",
        why_title: "VeggiePrice භාවිතා කළ යුත්තේ ඇයි?",
        why_subtitle: "ප්‍රධාන ශ්‍රී ලංකා වෙළඳපොලවලින් දිනපතා විශ්වාසදායී තොග මිල ලබා ගෙන ගොවීන් හා මිලදීගන්නන්ට හොඳ තීරණ ගැනීමට උපකාරී වේ.",
        why_point_1: "දිනපතා සහතික යාවත්කාලීන",
        why_point_1_sub: "ස්ථානික වෙළඳපොලවලින් සම්ප්‍රේෂණ වේ.",
        why_point_2: "සරල මිල සහ රැළි දර්ශන",
        why_point_2_sub: "ඉක්මන් තීරණ ගන්න පහසු.",
        why_point_3: "ගොවීන් සහ මිලදීගන්නන් සඳහා නිර්මාණය",
        why_point_3_sub: "ප්‍රායෝගික, ප්‍රදේශීය මෙවලම්.",
        why_point_4: "විවෘත සහ ප්‍රජාවට යොමුවූ",
        why_point_4_sub: "දත්ත පැහැදිලි හා වගකිවයුතුයි.",
        why_cta: "වෙළඳපොල් බලන්න",

        stat_item_carrot: "කැරට්",
        stat_item_tomato: "තක්කාලි",
        stat_item_onion: "ලොකු ලූනු",
        unit_kg: "/කිලෝ",
        text_today: "අද",

        item_Tomato: "තක්කාලි",
        item_Carrot: "කැරට්",
        item_Banana: "කෙසෙල්",
        item_Apple: "ඇපල්",
        item_Cabbage: "ගෝවා",
        item_GreenChili: "අමු මිරිස්",
        item_BigOnion: "ලොකු ලූනු",
        item_Potato: "අල",
        item_Mango: "අඹ",
        item_Beans: "බෝංචි",
        item_Pumpkin: "වට්ටක්කා",
        item_Brinjal: "වම්බටු",
        item_Lime: " දෙහි",
        item_Papaya: "පැපොල්",
        item_LeafyGreens: "පලා වර්ග",

        // Vegetable Care Guide
        care_guide_title: "එළවළු පෙර්බඩු නිර්දේශ",
        care_guide_subtitle: "සුස්ථ එළවළු සඳහා සාමාන්‍ය රෝගයන්, රෝග ලක්ෂණ සහ කාබනිකව පෝෂිත ගස් ඉගෙන ගන්න",
        select_vegetable: "එළවළුවක් තෝරන්න",
        diseases: "රෝගයන්",
        symptoms: "රෝග ලක්ෂණ",
        organic_fertilizers: "කාබනිකව පෝෂිත ගස්",
        fertilizer_benefits: "ප්‍රතිලාභ",
        click_to_see: "രോഗുകാണാൻ ക്ലിക്ക്",
        click_disease: "চিকিৎসা දেখতে রোগে ক্লিক করুন",
        recommended_fertilizers: "නිර්දේශිත කාබනිකව පෝෂිත ගස්",
        prevention_tips: "වැළැක්වීමේ ඉඟි",
        treatment_methods: "ප්‍රතිකාර ක්‍රම"

const natureAdvice = {
    en: ["Reduce plastic usage in markets.", "Support organic farming practices.", "Keep our water sources clean.", "Minimize food waste.", "Plant a tree for every harvest."],
    si: ["වෙළඳපොලේ ප්ලාස්ටික් භාවිතය අවම කරමු.", "කාබනික ගොවිතැනට සහාය වෙමු.", "ජල මූලාශ්‍ර පිරිසිදුව තබා ගනිමු.", "ආහාර නාස්තිය අවම කරමු.", "අස්වැන්නක් පාසා පැළයක් සිටුවමු."]
};

const markets = [
    { id: 'dambulla', name: 'Dambulla DEC', nameSi: 'දඹුල්ල ආර්ථික මධ්‍යස්ථානය', location: 'Matale District', locationSi: 'මාතලේ දිස්ත්‍රික්කය', image: 'assets//imgs//d icon.png' },
    { id: 'nuwaraeliya', name: 'Nuwara Eliya DEC', nameSi: 'නුවරඑළිය ආර්ථික මධ්‍යස්ථානය', location: 'Nuwara Eliya', locationSi: 'නුවරඑළිය', image: 'assets//imgs//n icon.png' },
    { id: 'thambuttegama', name: 'Thambuttegama DEC', nameSi: 'තඹුත්තේගම ආර්ථික මධ්‍යස්ථානය', location: 'Anuradhapura', locationSi: 'අනුරාධපුර', image: 'assets//imgs//t icon.png' },
    { id: 'bandarawela', name: 'Bandarawela', nameSi: 'බණ්ඩාරවෙල', location: 'Badulla', locationSi: 'බදුල්ල', image: 'assets//imgs//b icon.png' },
    { id: 'keppetipola', name: 'Keppetipola DEC', nameSi: 'කැප්පෙටිපොල ආර්ථික මධ්‍යස්ථානය', location: 'Keppetipola', locationSi: 'කැප්පෙටිපොල', image: 'assets//imgs//k icon.png' }
];

// --- VEGETABLE CARE GUIDE DATA (Diseases & Organic Fertilizers) ---
const vegetableCareGuide = {
    tomato: {
        en: { name: 'Tomato', icon: '🍅' },
        si: { name: 'තක්කාලි', icon: '🍅' },
        diseases: [
            {
                en: { name: 'Leaf Spot', symptoms: 'Brown/yellow spots on leaves, yellowing' },
                si: { name: 'පත්‍ර තිබුඩු', symptoms: 'පත්‍රවලට දුඹුරු/කහ පැහැ තිබුඩු' }
            },
            {
                en: { name: 'Early Blight', symptoms: 'Lower leaves turn yellow, brown spots appear' },
                si: { name: 'මුල් ගිලීම', symptoms: 'පහළ පත්‍ර කහ පැහැ වෙයි, දුඹුරු තිබුඩු' }
            },
            {
                en: { name: 'Powdery Mildew', symptoms: 'White powder on leaves, stunted growth' },
                si: { name: 'කුඩු පැහැ ශෙනුන්', symptoms: 'පත්‍රවල සුදු කුඩු, අවුරුද්ධ වර්ධනය' }
            }
        ]
    },
    carrot: {
        en: { name: 'Carrot', icon: '🥕' },
        si: { name: 'කැරට්', icon: '🥕' },
        diseases: [
            {
                en: { name: 'Flea Beetles', symptoms: 'Tiny holes in leaves, yellowing' },
                si: { name: 'කුඩු කෙටුම්', symptoms: 'පත්‍රවල කුඩු සිදුරු, කහ පැහැ වීම' }
            },
            {
                en: { name: 'Root Rot', symptoms: 'Roots become soft and mushy, wilting' },
                si: { name: 'මුල් කුණු', symptoms: 'මුල් සෙමෙන් දුර්වල වෙයි, නැතිවී යයි' }
            },
            {
                en: { name: 'Leaf Spot', symptoms: 'Dark spots on foliage, defoliation' },
                si: { name: 'පත්‍ර තිබුඩු', symptoms: 'කළු තිබුඩු පත්‍රවල, පත්‍ර ගිනී' }
            }
        ]
    },
    broccoli: {
        en: { name: 'Broccoli', icon: '🥦' },
        si: { name: 'බ්‍රොකලි', icon: '🥦' },
        diseases: [
            {
                en: { name: 'Clubroot', symptoms: 'Swollen deformed roots, stunted growth' },
                si: { name: 'මුල් පිළිබඳ රෝගය', symptoms: 'විෂ්කම්භ වූ මුල්, අවුරුද්ධ වර්ධනය' }
            },
            {
                en: { name: 'Downy Mildew', symptoms: 'Yellow patches on leaves, white mold underneath' },
                si: { name: 'ගිලි ශෙනුන්', symptoms: 'පත්‍রවල කහ ස්ථානයන්, පහළින් සුදු ශෙනුන්' }
            },
            {
                en: { name: 'Black Rot', symptoms: 'Black veins on leaves, edge browning' },
                si: { name: 'කළු කුණු', symptoms: 'কෙටුම්වල කළු නාඩි, කෙළවා දුඹුරු වීම' }
            }
        ]
    },
    chili: {
        en: { name: 'Chili Pepper', icon: '🌶️' },
        si: { name: 'මිරිස්', icon: '🌶️' },
        diseases: [
            {
                en: { name: 'Anthracnose', symptoms: 'Dark sunken spots on fruits, premature dropping' },
                si: { name: 'ඇන්තෝස්', symptoms: 'ගෙඩිවලට කළු සිදුරු, අකාල පතනය' }
            },
            {
                en: { name: 'Bacterial Spot', symptoms: 'Water-soaked spots, yellow halos' },
                si: { name: 'බැක්ටීරිය තිබුඩු', symptoms: 'ජල ශෝෂිත තිබුඩු, කහ හලෝ' }
            },
            {
                en: { name: 'Whitefly Infestation', symptoms: 'Yellowing leaves, sticky residue, wilting' },
                si: { name: 'සුදු පැණිගැටුම්', symptoms: 'කහ පත්‍ර, ස්ටිකි අවශේෂ, නැතිවීම' }
            }
        ]
    },
    onion: {
        en: { name: 'Onion', icon: '🧅' },
        si: { name: 'ලූනු', icon: '🧅' },
        diseases: [
            {
                en: { name: 'Purple Blotch', symptoms: 'Purple/brown spots on leaves and stems' },
                si: { name: 'දම්වල ලප්පු', symptoms: 'දම්වල/දුඹුරු ලප්පු පත්‍ර සහ කඩු' }
            },
            {
                en: { name: 'Basal Rot', symptoms: 'Rotting at base, mushy appearance' },
                si: { name: 'ඉතුරු කුණු', symptoms: 'පතුලින් කුණු ගැබෙයි, සිමිත පෙනුම' }
            },
            {
                en: { name: 'Thrips Damage', symptoms: 'Silvery streaks on leaves, distorted growth' },
                si: { name: 'තිරිස් හානිය', symptoms: 'පත්‍රවල ලිහිසි ඉරි, විකෘති වර්ධනය' }
            }
        ]
    },
    potato: {
        en: { name: 'Potato', icon: '🥔' },
        si: { name: 'අල', icon: '🥔' },
        diseases: [
            {
                en: { name: 'Late Blight', symptoms: 'Water-soaked spots, white mold on undersides' },
                si: { name: 'ප්‍රලම්බ ගිලීම', symptoms: 'ජල ශෝෂිත තිබුඩු, පහළින් සුදු ශෙනුන්' }
            },
            {
                en: { name: 'Early Blight', symptoms: 'Target-like spots on leaves, stem damage' },
                si: { name: 'මුල් ගිලීම', symptoms: 'ඉලක්කය හැඩැති තිබුඩු, කඩු හානිය' }
            },
            {
                en: { name: 'Scab', symptoms: 'Corky brown spots on tubers, cracked skin' },
                si: { name: 'ගිබුණු', symptoms: 'බීජ තුඩුවලට කිරුණු දුඹුරු ලප්පු' }
            }
        ]
    },
    spinach: {
        en: { name: 'Spinach', icon: '🥬' },
        si: { name: 'පෙතා', icon: '🥬' },
        diseases: [
            {
                en: { name: 'Downy Mildew', symptoms: 'Yellow patches on upper surface, white mold below' },
                si: { name: 'ගිලි ශෙනුන්', symptoms: 'ඉහළ මතුපිට කහ ස්ථානයන්, පහළින් සුදු ශෙනුන්' }
            },
            {
                en: { name: 'Leaf Miners', symptoms: 'Wiggly trails in leaves, transparent patterns' },
                si: { name: 'පත්‍ර ගුවන්නින්', symptoms: 'පත්‍රවල වක්‍ර මාර්ගයන්, ඼ස්වචක රටා' }
            },
            {
                en: { name: 'Crown Rot', symptoms: 'Plants wilt suddenly, base becomes mushy' },
                si: { name: 'කිරුණු රෝගය', symptoms: 'පළතුරු හඩु වැඩුතාවින්, පතුල සිමිතයි' }
            }
        ]
    },
    cabbage: {
        en: { name: 'Cabbage', icon: '🥬' },
        si: { name: 'ගෝවා', icon: '🥬' },
        diseases: [
            {
                en: { name: 'Black Rot', symptoms: 'Yellow veins, V-shaped yellowing on edges' },
                si: { name: 'කළු කුණු', symptoms: 'කහ නාඩු, V-හැඩැති කහ පැහැ' }
            },
            {
                en: { name: 'Clubroot', symptoms: 'Swollen distorted roots, yellowing leaves' },
                si: { name: 'මුල් පිළිබඳ රෝගය', symptoms: 'විෂ්කම්භ වූ විකෘති මුල්, කහ පත්‍ර' }
            },
            {
                en: { name: 'Cabbage Worm', symptoms: 'Green worms in leaves, large holes, frass' },
                si: { name: 'ගෝවා කෙටුම්', symptoms: 'පත්‍රවල කිරුණු කෙටුම්, විශාල සිදුරු' }
            }
        ]
    },
    cucumber: {
        en: { name: 'Cucumber', icon: '🥒' },
        si: { name: 'පිტිකරු', icon: '🥒' },
        diseases: [
            {
                en: { name: 'Powdery Mildew', symptoms: 'White powder coating on leaves and stems' },
                si: { name: 'කුඩු පැහැ ශෙනුන්', symptoms: 'පත්‍ර සහ කඩුවල සුදු කුඩු ආවරණය' }
            },
            {
                en: { name: 'Downy Mildew', symptoms: 'Yellow spots above, white mold below leaves' },
                si: { name: 'ගිලි ශෙනුන්', symptoms: 'ඉහළින් කහ තිබුඩු, පත්‍ර පහළින් සුදු ශෙනුන්' }
            },
            {
                en: { name: 'Anthracnose', symptoms: 'Brown sunken spots on fruits, premature drop' },
                si: { name: 'ඇන්තෝස්', symptoms: 'ගෙඩිවලට දුඹුරු සිදුරු, අකාල පතනය' }
            }
        ]
    }
};

// --- ORGANIC FERTILIZERS DATABASE ---
const organicFertilizers = {
    en: [
        { name: 'Neem Oil', benefits: 'Controls fungi, insects, and mites. Natural pesticide alternative.' },
        { name: 'Compost Tea', benefits: 'Rich in nutrients and beneficial microbes. Improves soil health.' },
        { name: 'Vermicompost', benefits: 'Slow-release nutrients. Improves soil structure and water retention.' },
        { name: 'Bone Meal', benefits: 'High in phosphorus. Promotes flowering and fruiting.' },
        { name: 'Fish Emulsion', benefits: 'Complete nutrient profile. Quick nutrient uptake by plants.' },
        { name: 'Seaweed Extract', benefits: 'Growth promoter with trace minerals. Boosts immunity.' },
        { name: 'Cow Manure', benefits: 'Rich in nitrogen. Improves soil fertility over time.' },
        { name: 'Wood Ash', benefits: 'Potassium source. Repels certain pests naturally.' },
        { name: 'Crushed Eggshells', benefits: 'Calcium source. Prevents blossom end rot in tomatoes.' },
        { name: 'Coffee Grounds', benefits: 'Nitrogen and organic matter. Improves soil texture.' },
        { name: 'Garlic Spray', benefits: 'Natural fungicide and insecticide. Deters many pests.' },
        { name: 'Mulch (Leaves/Straw)', benefits: 'Retains moisture, controls weeds, adds organic matter.' }
    ],
    si: [
        { name: 'නිම් තෙල්', benefits: 'බිම්බුල්, කෙටුම් සහ එකෝ දෙහි දිරවයි. ස්වාභාවික පිටින්ට එකතු.' },
        { name: 'කොම්පෝස්ට් තෙ', benefits: 'පෝෂක සහ ප්‍රයෝජනවත් ඉතුරුපිසි සමසතව. පසු සෙබඳතා දෙයි.' },
        { name: 'වර්මිකොම්පෝස්ට්', benefits: 'සෝම සිට පෝෂක. පසු ව්‍යුහය සහ ජල රඳවාගැනීම දෙයි.' },
        { name: 'බෝන් ඩුස්ට්', benefits: 'ෆොස්පෝරසින් පුර. ගුල් සහ ඉතුරුපිසි ප්‍රවර්ධනය.' },
        { name: 'මාළු ඉමුසිතුම්', benefits: 'සම්පූර්ණ පෝෂක පිටිසනроссии. ඉක්මන් පෝෂක ගතිසාර.' },
        { name: 'මිටි බීජ නිස්සාරණ', benefits: 'වර්ධන දියවඩුවක්. නිම්නතාවය අයිතුන්ගේ ඝටකයි.' },
        { name: 'ගවේ නිසුදු', benefits: 'නයිට්‍රජන් මිදුයි. පසු සෞභාග්‍ය කාලයක් වින්යාසිතයි.' },
        { name: 'ලwood තිරුබිම් ගිම්බ්', benefits: 'ක්‍රියාකිරීමේ ලක්ෂ්‍යසිටුවක්. ස්වාභාවිකව ඇතැම් පිටින්ට ප්‍රතිරෝධ.' },
        { name: 'කුඩු මිටි ශක්තිමත්', benefits: 'කැල්සියම් ඉතුරුපිසි. තක්කාලි පිkenny අවසානයට කුණු නතුර පාලනය.' },
        { name: 'කෝපි දැඩිය', benefits: 'නයිට්‍රජන් සහ කාබනසිතු කරුණු. පසු ව්‍යුහය දිරවයි.' },
        { name: 'සුණින් ස්පෙරි', benefits: 'ස්වාභාවික බිම්බුල්යිස සහ කෙටුම් තිරුබිම්. බොහෝ පිටින්ට ශුද්ධ.' },
        { name: 'මැල්ච් (පත්‍ර/ගල්)', benefits: 'ජල රඳවාගැනීම, කඩතුරු අතිනිසි පාලනය, කාබනසිතු කරුණු එකතු.' }
    ]
};

// --- APPLICATION LOGIC ---

const app = {
    currentLang: 'en',
    adviceInterval: null,
    adviceIndex: 0,

    updatePageTitle: (titleKey) => {
        const t = translations[app.currentLang];
        const titleEl = document.getElementById('page-title-text');
        const pageBar = document.getElementById('mobile-page-title');
        
        if (!titleEl || !pageBar) return;

        const title = t[titleKey] || titleKey;
        titleEl.textContent = title;
        pageBar.classList.remove('hidden');
    },

    hidePageTitle: () => {
        const pageBar = document.getElementById('mobile-page-title');
        if (pageBar) pageBar.classList.add('hidden');
    },

    init: () => {
        app.generateDemoData();
        app.renderMarkets();

        // --- 1. Load Saved View State ---
        const savedState = sessionStorage.getItem('vp_view_state');
        if (savedState) {
            const state = JSON.parse(savedState);
            if (state.view === 'market' && state.id) {
                app.showMarket(state.id, true); // true = restoring
            } else {
                // Default Home View
                // Restore Home Scroll immediately if on home
                const savedScroll = sessionStorage.getItem('vp_home_scroll');
                if (savedScroll) {
                    // Small timeout to allow DOM paint
                    setTimeout(() => window.scrollTo(0, parseInt(savedScroll)), 10);
                }
            }
        } else {
            // Check URL params fallback
            const urlParams = new URLSearchParams(window.location.search);
            const marketParam = urlParams.get('market');
            if (marketParam) {
                app.showMarket(marketParam, false);
            }
        }

        // --- 2. Restore Refresh Scroll Position ---
        // If the user refreshed, we want them to stay exactly where they were
        // regardless of view.
        const refreshScroll = sessionStorage.getItem('vp_refresh_scroll');
        if (refreshScroll) {
            setTimeout(() => window.scrollTo(0, parseInt(refreshScroll)), 20);
            sessionStorage.removeItem('vp_refresh_scroll'); // Clean up
        }

        app.updateDynamicPrices();
        floatingFx.init();
        emojiInteraction.init(); emojiController.init();
        app.updateTranslations();
        app.startNatureCarousel();

        // Add Scroll Saver for Refresh
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('vp_refresh_scroll', window.scrollY);
        });
    },

    // Load market data from prices.json
    generateDemoData: async () => {
        priceDataMap = {};
        
        try {
            const response = await fetch('data/prices.json', { cache: 'no-cache' });
            if (!response.ok) throw new Error('Failed to load prices.json');
            
            const data = await response.json();
            if (!data.marketPrices) return;
            
            const today = getDateStr(0);
            const yesterday = getDateStr(1);
            const day2 = getDateStr(2);
            const day4 = getDateStr(4);
            const day10 = getDateStr(10);
            
            // Map the JSON data to date keys
            if (data.marketPrices.today) priceDataMap[today] = data.marketPrices.today;
            if (data.marketPrices.yesterday) priceDataMap[yesterday] = data.marketPrices.yesterday;
            if (data.marketPrices.day2) priceDataMap[day2] = data.marketPrices.day2;
            if (data.marketPrices.day4) priceDataMap[day4] = data.marketPrices.day4;
            if (data.marketPrices.day10) priceDataMap[day10] = data.marketPrices.day10;
            
        } catch (error) {
            console.warn('Could not load market data from prices.json:', error);
            // Fallback to empty map - app will still work
        }
    },

    updateDynamicPrices: () => {
        const heroPrice = document.getElementById('hero-price-carrot');
        if (heroPrice) heroPrice.textContent = marketRates.carrot;

        const statPrice = document.getElementById('stat-price-carrot');
        if (statPrice) statPrice.textContent = marketRates.carrot;

        // Update visible timestamp (from prices file or fallback)
        if (typeof updateStatTime === 'function') updateStatTime();
    },

    startNatureCarousel: () => {
        const updateAdvice = () => {
            const adviceList = natureAdvice[app.currentLang];
            const textEl = document.getElementById('nature-advice-text');
            const dotsContainer = document.getElementById('nature-dots');

            if (!textEl || !dotsContainer) return;

            textEl.style.opacity = '0';
            textEl.style.transform = 'translateY(10px)';

            setTimeout(() => {
                textEl.textContent = `"${adviceList[app.adviceIndex]}"`;
                textEl.style.opacity = '1';
                textEl.style.transform = 'translateY(0)';
            }, 300);

            dotsContainer.innerHTML = adviceList.map((_, i) => `
                <div class="h-1.5 rounded-full transition-all duration-300 ${i === app.adviceIndex ? 'w-8 bg-green-400' : 'w-2 bg-white/30'}"></div>
            `).join('');

            app.adviceIndex = (app.adviceIndex + 1) % adviceList.length;
        };

        updateAdvice();
        if (app.adviceInterval) clearInterval(app.adviceInterval);
        app.adviceInterval = setInterval(updateAdvice, 4000);
    },

    toggleLanguage: () => {
        app.currentLang = app.currentLang === 'en' ? 'si' : 'en';
        const body = document.body;

        const btnText = document.getElementById('lang-text');
        const btnIcon = document.getElementById('lang-icon');
        if (app.currentLang === 'en') {
            btnText.textContent = "SINHALA";
            btnIcon.textContent = "🇱🇰";
            body.classList.remove('lang-si');
        } else {
            btnText.textContent = "ENGLISH";
            btnIcon.textContent = "🇺🇸";
            body.classList.add('lang-si');
        }

        app.updateTranslations();
        app.renderMarkets();
        floatingFx.init();
        emojiInteraction.init();
        app.startNatureCarousel();
        careGuide.updateLanguage(app.currentLang);

        if (!document.getElementById('view-market').classList.contains('hidden')) {
            const currentMarketName = document.getElementById('detail-market-name').dataset.id;
            if (currentMarketName) app.showMarket(currentMarketName, true); // true keeps us on market view
        }
    },

    updateTranslations: () => {
        const t = translations[app.currentLang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            // Hero title uses inline HTML for the marker — handle it separately
            if (key === 'hero_title') return;
            if (t[key]) el.textContent = t[key];
        });
        const lastUpdatedEl = document.getElementById('last-updated-text');
        if (lastUpdatedEl) lastUpdatedEl.textContent = t.today_text;

        // Update hero title with highlight preserved
        app.setHeroTitle();

        // Update page metadata for SEO & accessibility
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && t.meta_description) metaDesc.setAttribute('content', t.meta_description);
        if (t.site_title) document.title = t.site_title;
        // Update html lang attribute for accessibility and SEO
        document.documentElement.setAttribute('lang', app.currentLang === 'en' ? 'en' : 'si');
    },

    setHeroTitle: () => {
        const el = document.querySelector('[data-i18n="hero_title"]');
        if (!el) return;
        const t = translations[app.currentLang];
        const title = t.hero_title || '';
        const highlight = t.hero_highlight || '';
        const highlightSVG = '<svg class="absolute w-full h-5 -bottom-2 left-0 -z-10" viewBox="0 0 120 24" preserveAspectRatio="none" aria-hidden="true"><path d="M6 16 Q40 4 114 14" stroke="#bbf7d0" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.98"></path></svg>';

        if (highlight && title.includes(highlight)) {
            const wrapped = title.replace(highlight, `<span class="highlight-pen text-green-700 relative inline-block">${highlight}${highlightSVG}</span>`);
            el.innerHTML = wrapped;
        } else {
            el.textContent = title;
        }
    },

    goHome: () => {
        document.getElementById('view-home').classList.remove('hidden');
        document.getElementById('view-market').classList.add('hidden');

        // Update State
        sessionStorage.setItem('vp_view_state', JSON.stringify({ view: 'home' }));

        // Restore Home Scroll
        const savedScroll = sessionStorage.getItem('vp_home_scroll');
        if (savedScroll) {
            window.scrollTo(0, parseInt(savedScroll));
        } else {
            window.scrollTo(0, 0);
        }
    },

    scrollToSection: (id) => {
        const el = document.getElementById(id);
        if (el) {
            // If we are in market view, go home first
            if (!document.getElementById('view-market').classList.contains('hidden')) {
                app.goHome();
                // Small delay to allow home rendering
                setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
            } else {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    },

    toggleMobileMenu: () => {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    },

    toggleAbout: () => {
        const overlay = document.getElementById('about-overlay');
        const wasHidden = overlay.classList.contains('hidden');
        overlay.classList.toggle('hidden');
        const isNowOpen = !overlay.classList.contains('hidden');
        if (isNowOpen) {
            if (window.veggieHistory && typeof window.veggieHistory.pushViewState === 'function') {
                window.veggieHistory.pushViewState('about', {}, '#about');
            }
        } else {
            // When user closes About via UI, pop the about history entry if present
            if (history.state && history.state.app === 'veggie' && history.state.view === 'about') {
                history.back();
            }
        }
    },

    togglePastPrices: () => {
        const container = document.getElementById('past-prices-container');
        const arrow = document.getElementById('past-arrow');
        container.classList.toggle('hidden');

        if (container.classList.contains('hidden')) {
            arrow.style.transform = 'rotate(0deg)';
        } else {
            arrow.style.transform = 'rotate(180deg)';
        }
    },

    renderMarkets: () => {
        const grid = document.getElementById('market-grid');
        
        // Professional market icons - modern design
        const marketIcons = {
            'dambulla': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="market-icon"><defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#16a34a;stop-opacity:1" /><stop offset="100%" style="stop-color:#15803d;stop-opacity:1" /></linearGradient></defs><rect x="15" y="25" width="70" height="50" rx="4" stroke="url(#grad1)" stroke-width="2.5" fill="none"/><circle cx="30" cy="38" r="4" fill="#16a34a"/><circle cx="50" cy="38" r="4" fill="#16a34a"/><circle cx="70" cy="38" r="4" fill="#16a34a"/><path d="M18 50 L82 50" stroke="#16a34a" stroke-width="1.5" opacity="0.5"/><path d="M20 58 L35 65 M50 58 L65 65 M75 58 L82 65" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/></svg>',
            'nuwaraeliya': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="market-icon"><defs><linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#16a34a;stop-opacity:1" /><stop offset="100%" style="stop-color:#15803d;stop-opacity:1" /></linearGradient></defs><path d="M20 45 L35 25 L50 30 L65 25 L80 45 L75 45 L75 70 L25 70 L25 45 Z" stroke="url(#grad2)" stroke-width="2.5" fill="none" stroke-linejoin="round"/><line x1="35" y1="45" x2="35" y2="70" stroke="#16a34a" stroke-width="1.5" opacity="0.6"/><line x1="50" y1="45" x2="50" y2="70" stroke="#16a34a" stroke-width="1.5" opacity="0.6"/><line x1="65" y1="45" x2="65" y2="70" stroke="#16a34a" stroke-width="1.5" opacity="0.6"/></svg>',
            'thambuttegama': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="market-icon"><defs><linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#16a34a;stop-opacity:1" /><stop offset="100%" style="stop-color:#15803d;stop-opacity:1" /></linearGradient></defs><circle cx="50" cy="50" r="30" stroke="url(#grad3)" stroke-width="2" fill="none"/><path d="M50 25 L62 40 L78 42 L68 50 L70 66 L50 58 L30 66 L32 50 L22 42 L38 40 Z" fill="#16a34a" opacity="0.3"/><path d="M50 25 L62 40 L78 42 L68 50 L70 66 L50 58 L30 66 L32 50 L22 42 L38 40 Z" stroke="#16a34a" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>',
            'bandarawela': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="market-icon"><defs><linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#16a34a;stop-opacity:1" /><stop offset="100%" style="stop-color:#15803d;stop-opacity:1" /></linearGradient></defs><path d="M50 20 L80 45 L72 45 L72 75 L28 75 L28 45 L20 45 Z" stroke="url(#grad4)" stroke-width="2.5" fill="none" stroke-linejoin="round"/><rect x="38" y="50" width="10" height="15" stroke="#16a34a" stroke-width="1.5" fill="none"/><rect x="52" y="50" width="10" height="15" stroke="#16a34a" stroke-width="1.5" fill="none"/><circle cx="43" cy="57" r="1.5" fill="#16a34a"/><circle cx="57" cy="57" r="1.5" fill="#16a34a"/><circle cx="43" cy="62" r="1.5" fill="#16a34a"/><circle cx="57" cy="62" r="1.5" fill="#16a34a"/></svg>',
            'keppetipola': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="market-icon"><defs><linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#16a34a;stop-opacity:1" /><stop offset="100%" style="stop-color:#15803d;stop-opacity:1" /></linearGradient></defs><path d="M50 20 L75 50 L70 50 L70 75 L30 75 L30 50 L25 50 Z" stroke="url(#grad5)" stroke-width="2.5" fill="none" stroke-linejoin="round"/><path d="M40 55 L50 40 L60 55" stroke="#16a34a" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="50" cy="65" r="4" stroke="#16a34a" stroke-width="1.5" fill="none"/></svg>'
        };
        
        grid.innerHTML = markets.map(m => {
            const name = app.currentLang === 'si' ? m.nameSi : m.name;
            const loc = app.currentLang === 'si' ? m.locationSi : m.location;
            const btnText = translations[app.currentLang].view_prices;
            const icon = marketIcons[m.id] || marketIcons['dambulla'];

            return `
                    <div onclick="app.showMarket('${m.id}')" onkeydown="if(event.key==='Enter') app.showMarket('${m.id}')" role="button" tabindex="0" aria-label="${btnText} - ${name}" class="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-none cursor-pointer transition transform duration-300 hover:scale-105 hover:shadow-2xl market-card h-full md:h-[420px] flex flex-col w-full">
                <div class="h-32 md:h-56 overflow-hidden flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-25 to-green-50 relative">
                    <div class="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        ${icon}
                    </div>
                </div>

                <div class="bg-white px-4 py-3 md:px-6 md:py-4 flex flex-col justify-between flex-grow">
                    <div>
                        <h3 class="text-sm sm:text-base md:text-xl font-semibold text-gray-900 leading-snug break-words md:min-h-[56px]">${name}</h3>
                        <p class="text-xs sm:text-sm text-gray-600 mt-1.5 md:mt-2 max-w-full break-words">${loc}</p>
                    </div>

                    <div class="mt-3 md:mt-4 flex items-center">
                        <!-- Desktop/Tablet: full width text button -->
                        <div class="hidden md:block w-full">
                            <button class="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-2 shadow text-sm font-semibold flex items-center justify-center transition-colors" aria-label="${btnText} - ${name}">
                                <span>${btnText} <span aria-hidden="true">→</span></span>
                            </button>
                        </div>

                        <!-- Mobile: compact circular arrow aligned right -->
                        <div class="ml-auto md:hidden market-action-mobile">
                            <button class="w-10 h-10 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow transition-colors" aria-label="${btnText} - ${name}">
                                <i class="fa-solid fa-arrow-right text-sm" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `}).join('');
    },

    showMarket: (marketId, isRestoring = false) => {
        const market = markets.find(m => m.id === marketId);
        if (!market) return;
        // Push a history entry so Android / browser back navigates within the SPA
        if (!isRestoring && window.veggieHistory && typeof window.veggieHistory.pushViewState === 'function') {
            window.veggieHistory.pushViewState('market', { id: marketId }, '#market/' + marketId);
        }

        // --- SMART SCROLL SAVING ---
        // Only save home scroll if we are NOT restoring from a refresh (because restoring implies we handle scroll separately)
        // AND if the home view is currently active.
        const isHomeVisible = !document.getElementById('view-home').classList.contains('hidden');
        if (isHomeVisible && !isRestoring) {
            sessionStorage.setItem('vp_home_scroll', window.scrollY);
        }

        document.getElementById('view-home').classList.add('hidden');
        document.getElementById('view-market').classList.remove('hidden');

        // Save View State
        sessionStorage.setItem('vp_view_state', JSON.stringify({ view: 'market', id: marketId }));

        const name = app.currentLang === 'si' ? market.nameSi : market.name;
        const loc = app.currentLang === 'si' ? market.locationSi : market.location;

        const nameEl = document.getElementById('detail-market-name');
        nameEl.textContent = name;
        nameEl.dataset.id = marketId;
        nameEl.className = `text-2xl md:text-5xl font-bold text-gray-900 mb-2 ${app.currentLang === 'si' ? 'hero-title' : ''}`;

        document.getElementById('detail-market-loc').textContent = loc;
        document.getElementById('detail-market-img').src = market.image;

        if (!isRestoring) {
            window.scrollTo(0, 0);
        }

        const t = translations[app.currentLang];

        const todayStr = getDateStr(0);
        const yestStr = getDateStr(1);
        const day2Str = getDateStr(2);

        const recentCardsData = [
            { date: todayStr, label: t.today_text, isToday: true },
            { date: yestStr, label: t.yesterday_text, isToday: false },
            { date: day2Str, label: (app.currentLang === 'si' ? `2 ${t.days_ago}` : `2 ${t.days_ago}`), isToday: false }
        ];

        let recentHTML = '';

        recentCardsData.forEach(slot => {
            const dayData = priceDataMap[slot.date];
            const imageUrl = dayData ? dayData[marketId] : null;

            if (imageUrl) {
                recentHTML += `
                <div onclick="app.openModal('${imageUrl}', '${name}', '${slot.label}')" 
                     class="bg-white rounded-[1.5rem] shadow-sm border border-white hover:border-green-100 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer overflow-hidden relative group z-20 hover:-translate-y-1">
                    ${slot.isToday ? '<span class="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-10 animate-pulse">' + slot.label + '</span>' : ''}
                    <div class="h-48 overflow-hidden bg-gray-50 relative">
                        <img src="${imageUrl}" class="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition duration-500" onerror="this.src='https://placehold.co/400x300?text=No+Preview'">
                        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100">
                            <div class="bg-white/90 p-3 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition duration-300">
                                <i class="fa-solid fa-magnifying-glass-plus text-green-600 text-xl"></i>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 md:p-4 text-center bg-white border-t border-gray-50">
                         <div class="text-xs font-bold ${slot.isToday ? 'text-green-700' : 'text-gray-400'} uppercase tracking-wider mb-1 font-noto">
                            <i class="fa-regular fa-calendar mr-1"></i> ${slot.label}
                         </div>
                         <div class="text-[10px] text-gray-400 font-noto group-hover:text-green-600 transition font-medium">${t.zoom_hint}</div>
                    </div>
                </div>`;
            } else if (slot.isToday) {
                recentHTML += `
                <div class="bg-gray-50 rounded-[1.5rem] border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center h-full min-h-[250px]">
                    <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-3 animate-pulse">
                        <i class="fa-solid fa-clock text-xl"></i>
                    </div>
                    <h4 class="text-gray-600 font-bold text-sm mb-1">${t.today_text}</h4>
                    <p class="text-xs text-gray-400 max-w-[120px] mx-auto leading-relaxed">${t.msg_pending}</p>
                </div>`;
            }
        });

        document.getElementById('recent-prices-grid').innerHTML = recentHTML;

        const pastImages = [];
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 3);

        Object.keys(priceDataMap).forEach(dateStr => {
            if (new Date(dateStr) < cutoffDate && priceDataMap[dateStr][marketId]) {
                pastImages.push({
                    date: dateStr,
                    image: priceDataMap[dateStr][marketId]
                });
            }
        });

        pastImages.sort((a, b) => new Date(b.date) - new Date(a.date));
        const top5Past = pastImages.slice(0, 5);

        const pastHTML = top5Past.map(item => `
            <div onclick="app.openModal('${item.image}', '${name}', '${item.date}')" 
                 class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer overflow-hidden relative group">
                <div class="h-40 overflow-hidden bg-gray-100 relative">
                    <img src="${item.image}" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition">
                </div>
                <div class="p-3 text-center bg-white border-t border-gray-100">
                     <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        <i class="fa-regular fa-calendar mr-1"></i> ${item.date}
                     </div>
                </div>
            </div>
        `).join('');

        document.getElementById('past-prices-grid').innerHTML = pastHTML;
        document.getElementById('past-prices-container').classList.add('hidden');
        document.getElementById('past-arrow').style.transform = 'rotate(0deg)';
    },

    openModal: (imageSrc, marketName, dateStr) => {
        // Push modal state so Android / browser back closes the modal
        if (window.veggieHistory && typeof window.veggieHistory.pushViewState === 'function') {
            window.veggieHistory.pushViewState('modal', { type: 'image', src: imageSrc, marketName: marketName, dateStr: dateStr }, '#modal/image');
        }
        const modal = document.getElementById('image-modal');
        document.getElementById('modal-image').src = imageSrc;

        const nameEl = document.getElementById('modal-market-name');
        nameEl.textContent = marketName;
        if (app.currentLang === 'si') nameEl.classList.add('font-noto');
        else nameEl.classList.remove('font-noto');

        const dateEl = document.getElementById('modal-date');
        dateEl.textContent = dateStr;
        if (app.currentLang === 'si') dateEl.classList.add('font-noto');

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeModal: () => {
        const modal = document.getElementById('image-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};



const floatingFx = {
    container: document.getElementById('floating-container'),
    maxIcons: window.innerWidth < 768 ? 6 : 15,
    activeIcons: 0,
    interval: null,

    init: () => {
        const t = translations[app.currentLang];
        const list = document.getElementById('legend-list');

        list.innerHTML = produceItems.map(p => {
            const price = marketRates[p.key] || 0;
            const min = price - 20;
            const max = price + 20;

            const localizedName = t[p.id] || p.key;

            return `
            <li class="flex justify-between items-center py-2.5 border-b border-gray-100/50 last:border-0 hover:bg-green-50/50 transition px-3 rounded-lg cursor-default group/item">
                <span class="flex items-center gap-3">
                    <span class="text-lg filter drop-shadow-sm">${p.icon}</span> <span class="text-gray-600 font-noto text-xs font-semibold group-hover/item:text-green-700 transition-colors">${localizedName}</span>
                </span>
                <span class="font-bold text-orange-500 text-xs bg-orange-50 px-2 py-0.5 rounded-md">Rs.${min}-${max}</span>
            </li>
        `}).join('');

        if (floatingFx.interval) floatingFx.stop();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) floatingFx.stop();
            else floatingFx.start();
        });

        floatingFx.start();
    },

    start: () => {
        if (floatingFx.container.innerHTML === '') {
            for (let i = 0; i < 3; i++) setTimeout(floatingFx.spawn, i * 500);
        }

        floatingFx.interval = setInterval(() => {
            if (floatingFx.activeIcons < floatingFx.maxIcons) {
                floatingFx.spawn();
            }
        }, 2000);
    },

    stop: () => {
        clearInterval(floatingFx.interval);
    },

    spawn: () => {
        const item = produceItems[Math.floor(Math.random() * produceItems.length)];
        const t = translations[app.currentLang];
        const localizedName = t[item.id] || item.key;

        const price = marketRates[item.key] || 0;
        const min = price - 20;
        const max = price + 20;

        const el = document.createElement('div');
        el.classList.add('produce-icon');
        el.textContent = item.icon;

        const tooltip = document.createElement('div');
        tooltip.classList.add('produce-tooltip');
        if (app.currentLang === 'si') tooltip.classList.add('font-noto');

        tooltip.innerHTML = `
            ${localizedName}
            <span class="price-highlight">Rs. ${min} - ${max}</span>
        `;
        el.appendChild(tooltip);

        const leftPos = Math.random() * 90 + 5;
        const duration = Math.random() * 5 + 6;
        const delay = Math.random() * 2;

        el.style.left = `${leftPos}%`;
        el.style.animation = `floatUp ${duration}s ease-in-out ${delay}s forwards`;
        el.style.willChange = 'transform, opacity';

        floatingFx.container.appendChild(el);
        floatingFx.activeIcons++;

        const handleAnimationEnd = () => {
            el.removeEventListener('animationend', handleAnimationEnd);
            el.remove();
            floatingFx.activeIcons--;
        };
        
        el.addEventListener('animationend', handleAnimationEnd, { once: true });
    },

    toggleLegend: () => {
        const content = document.getElementById('legend-content');
        content.classList.toggle('hidden');
    }
};

// Emoji Interaction Controller (single/double/triple click behaviors)
const emojiController = {
    enabled: true,
    clickCount: 0,
    timer: null,
    init() {
        this.btn = document.getElementById('emoji-toggle-nav-btn');
        this.mobileBtn = document.getElementById('emoji-toggle-mobile');
        this.mobileNavBtn = document.getElementById('emoji-toggle-nav-mobile');
        if (this.mobileBtn) this.mobileBtn.addEventListener('click', (e) => this.handleClick(e));
        if (this.mobileNavBtn) this.mobileNavBtn.addEventListener('click', (e) => this.handleClick(e));
        this.updateUI();
    },
    updateUI() {
        if (!this.btn && !this.mobileBtn && !this.mobileNavBtn) return;
        if (this.enabled) {
            if (this.btn) { this.btn.classList.add('active'); this.btn.setAttribute('aria-pressed', 'true'); }
            if (this.mobileBtn) { this.mobileBtn.classList.add('active'); this.mobileBtn.setAttribute('aria-pressed', 'true'); }
            if (this.mobileNavBtn) { this.mobileNavBtn.classList.add('active'); this.mobileNavBtn.setAttribute('aria-pressed', 'true'); }
        } else {
            if (this.btn) { this.btn.classList.remove('active'); this.btn.setAttribute('aria-pressed', 'false'); }
            if (this.mobileBtn) { this.mobileBtn.classList.remove('active'); this.mobileBtn.setAttribute('aria-pressed', 'false'); }
            if (this.mobileNavBtn) { this.mobileNavBtn.classList.remove('active'); this.mobileNavBtn.setAttribute('aria-pressed', 'false'); }
        }
    },
    handleClick(e) {
        e.preventDefault();
        // Immediate tactile feedback (ripple + press + vibration)
        this.showClickFeedback(e);
        this.clickCount++;
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (this.clickCount === 1) this.singleClick();
            else if (this.clickCount === 2) this.doubleClick();
            else if (this.clickCount >= 3) this.tripleClick();
            this.clickCount = 0;
        }, 300);
    },
    showClickFeedback(e) {
        try {
            const btn = e.currentTarget || e.target.closest('button') || this.btn || this.mobileBtn;
            if (!btn) return;
            // pressed visual
            btn.classList.add('pressed');
            setTimeout(() => btn.classList.remove('pressed'), 200);
            // ripple
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX || (rect.left + rect.width / 2)) - rect.left;
            const y = (e.clientY || (rect.top + rect.height / 2)) - rect.top;
            const r = document.createElement('span');
            r.className = 'emoji-ripple';
            r.style.left = `${x}px`;
            r.style.top = `${y}px`;
            btn.appendChild(r);
            // trigger animation after append
            requestAnimationFrame(() => r.classList.add('animate'));
            setTimeout(() => r.remove(), 520);
            // vibration for supported devices
            if (navigator.vibrate) navigator.vibrate(20);
        } catch (err) {
            // ignore errors
        }
    },
    singleClick() {
        // Toggle animation on/off
        this.enabled = !this.enabled;
        if (this.enabled) floatingFx.start();
        else floatingFx.stop();
        this.updateUI();
    },
    doubleClick() {
        // Falling emojis
        for (let i = 0; i < 18; i++) {
            setTimeout(() => this.spawnFalling(), i * 80);
        }
    },
    tripleClick() {
        // Booms
        for (let i = 0; i < 32; i++) {
            setTimeout(() => this.spawnBoom(), i * 20);
        }
    },
    spawnFalling() {
        const icon = produceItems[Math.floor(Math.random() * produceItems.length)].icon;
        const el = document.createElement('div');
        el.className = 'falling-emoji';
        el.textContent = icon;
        el.style.left = `${Math.random() * 90 + 3}%`;
        const duration = 3 + Math.random() * 3;
        el.style.animation = `fallDown ${duration}s linear forwards`;
        el.style.willChange = 'transform, opacity';
        document.body.appendChild(el);
        
        const handleAnimationEnd = () => {
            el.removeEventListener('animationend', handleAnimationEnd);
            el.remove();
        };
        el.addEventListener('animationend', handleAnimationEnd, { once: true });
    },
    spawnBoom() {
        const icon = produceItems[Math.floor(Math.random() * produceItems.length)].icon;
        const el = document.createElement('div');
        el.className = 'boom-emoji';
        el.textContent = icon;
        el.style.left = `${Math.random() * 90 + 3}%`;
        el.style.top = `${Math.random() * 80 + 10}vh`;
        const duration = 0.7 + Math.random() * 0.8;
        el.style.animation = `boom ${duration}s ease-out forwards`;
        el.style.fontSize = `${20 + Math.random() * 40}px`;
        el.style.willChange = 'transform, opacity';
        document.body.appendChild(el);
        
        const handleAnimationEnd = () => {
            el.removeEventListener('animationend', handleAnimationEnd);
            el.remove();
        };
        el.addEventListener('animationend', handleAnimationEnd, { once: true });
    }
};

// Market Card Drag & Drop Controller (Mobile Reordering)
document.addEventListener('DOMContentLoaded', app.init);

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(() => loader.remove(), 300);
});

/* --- Android / Browser Back Integration (history-based SPA navigation) --- */
(function () {
    const BACK_SELECTOR = 'button[onclick^="app.goHome"]';

    // Make sure we have a base 'home' state
    try { history.replaceState({ app: 'veggie', view: 'home' }, '', location.pathname + location.search + location.hash); } catch (e) { }

    function pushViewState(view, data, url) {
        const state = { app: 'veggie', view: view, data: data || {} };
        const href = typeof url === 'string' ? url : ('#' + view + (data && data.id ? '/' + data.id : ''));
        try { history.pushState(state, '', href); } catch (err) { /* ignore */ }
    }

    window.veggieHistory = { pushViewState };

    // Prevent recursion when we programmatically click in-site back
    let suppressBackClick = false;

    // Intercept in-site back button clicks (e.g. app.goHome()) to use history.back()
    document.addEventListener('click', function (e) {
        const btn = e.target.closest(BACK_SELECTOR);
        if (!btn) return;
        if (suppressBackClick) { suppressBackClick = false; return; }
        e.preventDefault();
        history.back();
    }, { passive: false });

    // Map popstate entries to app behavior
    window.addEventListener('popstate', function (e) {
        const s = e.state;
        if (!s || s.app !== 'veggie') return; // let browser handle non-app states (exit)

        const marketView = document.getElementById('view-market');
        const aboutOverlay = document.getElementById('about-overlay');
        const imageModal = document.getElementById('image-modal');

        if (s.view === 'home') {
            if (marketView && !marketView.classList.contains('hidden')) {
                app.goHome();
            } else if (aboutOverlay && !aboutOverlay.classList.contains('hidden')) {
                app.toggleAbout();
            } else if (imageModal && (imageModal.classList.contains('active') || !imageModal.classList.contains('hidden'))) {
                app.closeModal();
            }
            return;
        }

        if (s.view === 'market') {
            if (marketView && marketView.classList.contains('hidden')) {
                app.showMarket(s.data && s.data.id ? s.data.id : undefined, true);
            }
            return;
        }

        if (s.view === 'modal') {
            if (s.data && s.data.type === 'image' && s.data.src) {
                app.openModal(s.data.src, s.data.marketName || '', s.data.dateStr || '');
            }
            return;
        }

        if (s.view === 'about') {
            if (aboutOverlay && aboutOverlay.classList.contains('hidden')) {
                app.toggleAbout();
            }
            return;
        }
    });
})();


// --- VEGETABLE CARE GUIDE MODULE ---
const careGuide = {
    currentLang: 'en',
    selectedVegetable: null,
    selectedDisease: null,

    init: () => {
        careGuide.currentLang = app.currentLang;
        careGuide.renderVegetableList();
    },

    renderVegetableList: () => {
        const list = document.getElementById('vegetable-list');
        if (!list) return;
        list.innerHTML = '';

        Object.keys(vegetableCareGuide).forEach(vegKey => {
            const veg = vegetableCareGuide[vegKey];
            const vegLang = careGuide.currentLang === 'en' ? veg.en : veg.si;
            
            const btn = document.createElement('button');
            btn.className = 'veg-list-item';
            btn.innerHTML = `
                <span class="icon">${vegLang.icon}</span>
                <span>${vegLang.name}</span>
            `;
            btn.onclick = () => careGuide.selectVegetable(vegKey);
            list.appendChild(btn);
        });
    },

    selectVegetable: (vegKey) => {
        careGuide.selectedVegetable = vegKey;
        careGuide.selectedDisease = null;

        // Update active state
        document.querySelectorAll('.veg-list-item').forEach((btn, idx) => {
            btn.classList.toggle('active', Object.keys(vegetableCareGuide)[idx] === vegKey);
        });

        // Show diseases
        careGuide.renderDiseases();
        
        // Hide empty state and show detail view
        document.getElementById('care-empty-state').classList.add('hidden');
        document.getElementById('care-detail-view').classList.remove('hidden');
        document.getElementById('disease-details').classList.add('hidden');
        
        // Close disease details
        careGuide.closeDiseaseDetail();
    },

    renderDiseases: () => {
        if (!careGuide.selectedVegetable) return;

        const veg = vegetableCareGuide[careGuide.selectedVegetable];
        const vegLang = careGuide.currentLang === 'en' ? veg.en : veg.si;
        
        // Update vegetable header
        document.getElementById('selected-veg-icon').textContent = vegLang.icon;
        document.getElementById('selected-veg-name').textContent = vegLang.name;

        // Render diseases
        const diseasesList = document.getElementById('diseases-list');
        diseasesList.innerHTML = '';

        veg.diseases.forEach((disease, idx) => {
            const diseaseLang = careGuide.currentLang === 'en' ? disease.en : disease.si;
            
            const card = document.createElement('div');
            card.className = 'disease-card';
            card.innerHTML = `
                <div class="disease-card-title">${diseaseLang.name}</div>
                <div class="disease-card-symptom">${diseaseLang.symptoms.substring(0, 50)}...</div>
            `;
            card.onclick = () => careGuide.selectDisease(idx);
            diseasesList.appendChild(card);
        });

        // Render fertilizers
        careGuide.renderFertilizers();
    },

    selectDisease: (diseaseIdx) => {
        if (!careGuide.selectedVegetable) return;

        careGuide.selectedDisease = diseaseIdx;
        const veg = vegetableCareGuide[careGuide.selectedVegetable];
        const disease = veg.diseases[diseaseIdx];
        const diseaseLang = careGuide.currentLang === 'en' ? disease.en : disease.si;

        // Update detail view
        document.getElementById('disease-name').textContent = diseaseLang.name;
        document.getElementById('disease-symptoms').textContent = diseaseLang.symptoms;

        // Update active disease card
        document.querySelectorAll('.disease-card').forEach((card, idx) => {
            card.classList.toggle('active', idx === diseaseIdx);
        });

        // Show disease details
        document.getElementById('disease-details').classList.remove('hidden');

        // Add treatment methods (generic for now)
        const treatmentList = document.getElementById('treatment-list');
        const treatments = [
            careGuide.currentLang === 'en' 
                ? '✓ Remove affected leaves and dispose safely' 
                : '✓ ගිනි ඇති පත්‍ර ඉවත් කරන්න',
            careGuide.currentLang === 'en' 
                ? '✓ Improve air circulation around plants' 
                : '✓ කුඩුවල වටා වාතය සිරුර දියවඩුවක්',
            careGuide.currentLang === 'en' 
                ? '✓ Use organic fungicide spray (Neem oil, Sulfur)' 
                : '✓ කාබනිකව පෝෂිත ශෙනුන්-නැතුවම ස්ප්‍රේ එක්',
            careGuide.currentLang === 'en' 
                ? '✓ Water at the base, avoid wetting leaves' 
                : '✓ පතුල හිමින් ජලය දෙන්න, පත්‍ර තෙතයට නොයන්න',
            careGuide.currentLang === 'en' 
                ? '✓ Apply organic compost for plant immunity' 
                : '✓ කුඩුවල ශක්තිය සඳහා කොම්පෝස්ට් යෙදවන්න'
        ];
        treatmentList.innerHTML = treatments.map(t => `<li>${t}</li>`).join('');
    },

    renderFertilizers: () => {
        const fertilizersList = document.getElementById('fertilizers-list');
        fertilizersList.innerHTML = '';

        const fertilizers = careGuide.currentLang === 'en' 
            ? organicFertilizers.en 
            : organicFertilizers.si;

        fertilizers.forEach(fert => {
            const card = document.createElement('div');
            card.className = 'fertilizer-card';
            card.innerHTML = `
                <div class="fertilizer-title">🌱 ${fert.name}</div>
                <div class="fertilizer-benefits">${fert.benefits}</div>
            `;
            fertilizersList.appendChild(card);
        });
    },

    closeDiseaseDetail: () => {
        careGuide.selectedDisease = null;
        document.getElementById('disease-details').classList.add('hidden');
        document.querySelectorAll('.disease-card').forEach(card => {
            card.classList.remove('active');
        });
    },

    updateLanguage: (lang) => {
        careGuide.currentLang = lang;
        if (careGuide.selectedVegetable) {
            careGuide.renderDiseases();
        } else {
            careGuide.renderVegetableList();
        }
    }
};

// Initialize care guide when page loads
document.addEventListener('DOMContentLoaded', () => {
    careGuide.init();
});
