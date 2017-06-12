import { LABEL_LANGUAGES, LANGUAGE } from "./conf";

const PREFIXES = `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX ps: <http://www.wikidata.org/prop/statement/>
PREFIX pq: <http://www.wikidata.org/prop/qualifier/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX bd: <http://www.bigdata.com/rdf#>
`;

function claims(claims) {
    return claims.map(d => `?item wdt:${d.property.id} ${d.value.value} .`).join('\n');
}

function minus(minus) {
    if (!minus.length) {
        return '';
    } else {
        return `MINUS { ${claims(minus)} }`;
    }
}

// '0' equals no limit
function limit(limit) {
    return parseInt(limit) === 0 ? '' : `LIMIT ${limit}`
}

export default function query(view) {
    return `
${PREFIXES}

SELECT DISTINCT ?item ?itemLabel ?itemDescription ?image ?sitelink WHERE {
    ${claims(view.where)}
    ${minus(view.minus)}
    OPTIONAL { ?item wdt:P18 ?image }
    OPTIONAL {
        ?sitelink schema:about ?item .
        ?sitelink schema:isPartOf <https://${LANGUAGE}.wikipedia.org/> .
    }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "${LABEL_LANGUAGES}" }
} ${limit(view.limit)}`.trim();
};