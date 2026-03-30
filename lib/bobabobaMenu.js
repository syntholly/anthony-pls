const BOBABOBA_MENU_URL = 'https://bobaboba.com.au/menu/';
const MENU_REVALIDATE_SECONDS = 60 * 60;

const MENU_SECTION_HEADINGS = {
    drinks: 'Our Drinks',
    toppings: 'Toppings',
};

const IGNORED_HEADING_TEXT = new Set([
    'Most popular',
    'Fixed Sweetness',
    'Fixed Ice Level',
    'Fixed Ice LEvel',
    'Milk options available',
    'User Login',
    'Franchise login',
]);

const decodeHtmlEntities = (value) => {
    return value
        .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&egrave;/g, 'è')
        .replace(/&rsquo;/g, "'")
        .replace(/&ndash;/g, '-');
};

const getHeadingText = (rawValue) => {
    return decodeHtmlEntities(rawValue.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
};

const pushUnique = (target, seen, value) => {
    const normalizedValue = value.trim();

    if (!normalizedValue || seen.has(normalizedValue)) {
        return;
    }

    seen.add(normalizedValue);
    target.push(normalizedValue);
};

const parseBobabobaMenu = (html) => {
    const headings = [...html.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)];
    const drinks = [];
    const toppings = [];
    const seenDrinks = new Set();
    const seenToppings = new Set();
    let currentSection = null;

    for (const [, tagName, rawText] of headings) {
        const headingText = getHeadingText(rawText);

        if (!headingText) {
            continue;
        }

        if (headingText === MENU_SECTION_HEADINGS.drinks) {
            currentSection = 'drinks';
            continue;
        }

        if (headingText === MENU_SECTION_HEADINGS.toppings) {
            currentSection = 'toppings';
            continue;
        }

        if (IGNORED_HEADING_TEXT.has(headingText)) {
            continue;
        }

        if (tagName.toLowerCase() !== 'h3') {
            continue;
        }

        if (currentSection === 'drinks') {
            pushUnique(drinks, seenDrinks, headingText);
        }

        if (currentSection === 'toppings') {
            pushUnique(toppings, seenToppings, headingText);
        }
    }

    if (!drinks.length) {
        throw new Error('No Bobaboba drink options were parsed');
    }

    return {
        drinks,
        toppings,
        source: BOBABOBA_MENU_URL,
    };
};

export const fetchBobabobaMenu = async () => {
    const response = await fetch(BOBABOBA_MENU_URL, {
        next: {revalidate: MENU_REVALIDATE_SECONDS},
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Bobaboba menu: ${response.status}`);
    }

    const html = await response.text();
    return parseBobabobaMenu(html);
};
