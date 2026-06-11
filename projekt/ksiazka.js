const API_URL = "https://openlibrary.org";

const powrot = document.querySelector("#powrot");
const statusKsiazki = document.querySelector("#statusKsiazki");
const widokKsiazki = document.querySelector("#widokKsiazki");
const okladkaKsiazki = document.querySelector("#okladkaKsiazki");
const autorKsiazki = document.querySelector("#autorKsiazki");
const tytulKsiazki = document.querySelector("#tytulKsiazki");
const rokWydania = document.querySelector("#rokWydania");
const tematyKsiazki = document.querySelector("#tematyKsiazki");
const opisKsiazki = document.querySelector("#opisKsiazki");
const linkOpenLibrary = document.querySelector("#linkOpenLibrary");

powrot.addEventListener("click", (event) => {
    if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
        event.preventDefault();
        window.history.back();
    }
});

function pokazBlad(tekst) {
    statusKsiazki.innerHTML = `<h3>Nie udało się wczytać książki</h3><p>${tekst}</p>`;
    statusKsiazki.hidden = false;
    widokKsiazki.hidden = true;
}

function pobierzOpis(description) {
    if (typeof description === "string") {
        return description;
    }

    return description?.value || "Brak opisu.";
}

async function pobierzAutorow(authors = []) {
    const zapytania = authors.slice(0, 3).map(async ({ author }) => {
        const odpowiedz = await fetch(`${API_URL}${author.key}.json`);

        if (!odpowiedz.ok) {
            return null;
        }

        const dane = await odpowiedz.json();
        return dane.name;
    });

    const nazwy = await Promise.all(zapytania);
    return nazwy.filter(Boolean);
}

async function wczytajKsiazke() {
    const key = new URLSearchParams(window.location.search).get("key");

    if (!key || !key.startsWith("/works/")) {
        pokazBlad("Brakuje identyfikatora książki.");
        return;
    }

    try {
        const odpowiedz = await fetch(`${API_URL}${key}.json`);

        if (!odpowiedz.ok) {
            throw new Error(`Błąd API: ${odpowiedz.status}`);
        }

        const dane = await odpowiedz.json();
        const autorzy = await pobierzAutorow(dane.authors);

        tytulKsiazki.textContent = dane.title || "Bez tytułu";
        autorKsiazki.textContent = autorzy.join(", ") || "Autor nieznany";
        rokWydania.textContent = dane.first_publish_date || "Brak danych";
        tematyKsiazki.textContent = dane.subjects?.slice(0, 3).join(", ") || "Brak danych";
        opisKsiazki.textContent = pobierzOpis(dane.description);
        linkOpenLibrary.href = `${API_URL}${key}`;

        if (dane.covers?.[0]) {
            const obraz = document.createElement("img");
            obraz.src = `https://covers.openlibrary.org/b/id/${dane.covers[0]}-L.jpg`;
            obraz.alt = `Okładka książki ${dane.title || ""}`;
            okladkaKsiazki.replaceChildren(obraz);
        }

        document.title = `${dane.title || "Książka"} - Szybka Książka`;
        statusKsiazki.hidden = true;
        widokKsiazki.hidden = false;
    } catch (error) {
        pokazBlad("Sprawdź połączenie z internetem i spróbuj ponownie.");
    }
}

wczytajKsiazke();
