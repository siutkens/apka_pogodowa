const API_URL = "https://openlibrary.org/search.json";
const LICZBA_WYNIKOW_NA_STRONE = 12;

const formularz = document.querySelector(".formularz");
const wyszukiwanie = document.querySelector("#formularz-input");
const sekcjaZnalezionych = document.querySelector(".znalezione");
const liczbaZnalezionych = document.querySelector("#liczbaZnalezionych");
const status = document.querySelector(".status");
const wynikiWyszukiwania = document.querySelector(".wynikiWyszukiwania");
const nawigacja = document.querySelector(".nawigacja");
const poprzedniaStrona = document.querySelector("#poprzedniaStrona");
const nastepnaStrona = document.querySelector("#nastepnaStrona");
const numerStrony = document.querySelector("#liczbaStron");

let zapytanie = "";
let aktualnaStrona = 1;
let liczbaWynikow = 0;
let aktywneZapytanie;


function dodajKarte(book) {
    const karta = document.createElement("article");
    const pudelko = document.createElement("div");
    const info = document.createElement("div");
    const tytul = document.createElement("h3");
    const autor = document.createElement("p");
    const metadane = document.createElement("div");
    const link = document.createElement("a");

    karta.className = "karta";
    pudelko.className = "pudelko";
    info.className = "info";
    autor.className = "autor";
    metadane.className = "metadane";

    if (book.cover_i) {
        const image = document.createElement("img");
        image.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg?default=false`;
        image.loading = "lazy";
        image.addEventListener("error", () => {
            const pudelko = rezerwujPrzestrzen(book.title);
            image.replaceWith(pudelko);
        });
        pudelko.append(image);
    } else {
        pudelko.append(rezerwujPrzestrzen(book.title));
    }

    tytul.textContent = book.title || "Bez tytułu";
    autor.textContent = book.author_name?.slice(0, 2).join(", ") || "Autor nieznany";
    link.href = `./ksiazka.html?key=${encodeURIComponent(book.key)}`;
    link.textContent = "Szczegóły";
    link.setAttribute("aria-label", `Zobacz szczegóły książki ${book.title}`);

    metadane.append(link);
    info.append(tytul, autor, metadane);
    karta.append(pudelko, info);

    return karta;
}

function rezerwujPrzestrzen(title) {
    const pudelko = document.createElement("div");
    pudelko.className = "okladka";
    pudelko.textContent = title || "Brak okładki";
    return pudelko;
}

function wypiszWiadomosc(naglowek, tekst) {
    status.innerHTML = `<h3>${naglowek}</h3><p>${tekst}</p>`;
    status.hidden = false;
    wynikiWyszukiwania.replaceChildren();
    nawigacja.hidden = true;
}

async function wyszukiwanieKsiazek(zapytanie, liczbaStron = 1) {
    aktywneZapytanie?.abort();
    aktywneZapytanie = new AbortController();
    aktualnaStrona = liczbaStron;

    wypiszWiadomosc("Przeszukuję bibliotekę...", "To powinno zająć tylko chwilę.");
    liczbaZnalezionych.textContent = "Ładowanie wyników...";

    const parametry = new URLSearchParams({
        q: zapytanie,
        page: String(liczbaStron),
        limit: String(LICZBA_WYNIKOW_NA_STRONE),
        lang: "pl",
        fields: "key,title,author_name,first_publish_year,cover_i,edition_count"
    });

    try {
        const odpowiedz = await fetch(`${API_URL}?${parametry}`, {
            signal: aktywneZapytanie.signal
        });

        if (!odpowiedz.ok) {
            throw new Error(`Błąd API: ${odpowiedz.status}`);
        }

        const dane = await odpowiedz.json();
        liczbaWynikow = dane.numFound ?? dane.num_found ?? 0;
        liczbaZnalezionych.textContent = liczbaWynikow
            ? `Znaleziono ${liczbaWynikow} wyników`
            : "Brak wyników";

        if (!dane.docs.length) {
            wypiszWiadomosc("Nic nie znaleziono", "Sprawdź pisownię lub wyszukaj na podstawie autora");
            return;
        }

        status.hidden = true;
        wynikiWyszukiwania.replaceChildren(...dane.docs.map(dodajKarte));
        
        const strony = Math.ceil(liczbaWynikow / LICZBA_WYNIKOW_NA_STRONE);
        poprzedniaStrona.disabled = aktualnaStrona <= 1;
        nastepnaStrona.disabled = aktualnaStrona >= strony;
        numerStrony.textContent = `Strona ${aktualnaStrona} z ${Intl.NumberFormat("pl-PL").format(strony)}`;
        nawigacja.hidden = strony <= 1;

        if (liczbaStron > 1) {
            sekcjaZnalezionych.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    } catch (error) {
        if (error.name === "AbortError") {
            return;
        }

        liczbaZnalezionych.textContent = "Nie udało się pobrać wyników";
        wypiszWiadomosc(
            "Wystąpił problem z połączeniem",
            "Sprawdź internet i spróbuj ponownie za chwilę."
        );
    }
}

formularz.addEventListener("submit", (event) => {
    event.preventDefault();
    zapytanie = wyszukiwanie.value.trim();

    if (zapytanie.length < 3) {
        wyszukiwanie.setCustomValidity("Wyszukiwana fraza musi mieć conajmniej 3 znaki");
        wyszukiwanie.reportValidity();
        return;
    }

    wyszukiwanie.setCustomValidity("");
    wyszukiwanieKsiazek(zapytanie);
});

wyszukiwanie.addEventListener("input", () => wyszukiwanie.setCustomValidity(""));

document.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
        wyszukiwanie.value = button.dataset.query;
        wyszukiwanieKsiazek(button.dataset.query);
    });
});

poprzedniaStrona.addEventListener("click", () => wyszukiwanieKsiazek(zapytanie, aktualnaStrona - 1));
nastepnaStrona.addEventListener("click", () => wyszukiwanieKsiazek(zapytanie, aktualnaStrona + 1));
