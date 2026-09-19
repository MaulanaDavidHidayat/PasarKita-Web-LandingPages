/* =====================================================
    PASARKITA
    FRONTEND INTERACTION
===================================================== */

/* =====================================================
    1. MOBILE NAVIGATION
===================================================== */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("show");
        });
    });
}

/* =====================================================
    2. CATEGORY FILTER
===================================================== */

const categoryButtons = document.querySelectorAll(".category");
const productCards = document.querySelectorAll(".product-card");

categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        categoryButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedCategory = button.textContent.trim().toLowerCase();

        productCards.forEach((card) => {
            const category = card
                .querySelector(".product-category")
                ?.textContent.trim()
                .toLowerCase();

            if (selectedCategory === "semua" || category === selectedCategory) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});

/* =====================================================
    3. FAVORITE SYSTEM CORE
===================================================== */

const FAVORITE_KEY = "pasarkita_favorites";

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
    } catch (error) {
        console.error("Gagal membaca favorit:", error);
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
}

function createProductId(card) {
    const title = card.querySelector("h3")?.textContent.trim().toLowerCase();
    return title ? title.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : null;
}

/* =====================================================
    4. PRODUCT CARD FAVORITE BUTTON
===================================================== */

productCards.forEach((card) => {
    const productId = createProductId(card);

    if (!productId) return;

    let favoriteButton = card.querySelector(".product-favorite");

    if (!favoriteButton) {
        favoriteButton = document.createElement("button");
        favoriteButton.type = "button";
        favoriteButton.className = "product-favorite";
        favoriteButton.setAttribute("aria-label", "Tambah ke favorit");
        favoriteButton.innerHTML = "♡";

        const imageContainer = card.querySelector(".product-image");

        if (imageContainer) {
            imageContainer.style.position = "relative";
            imageContainer.appendChild(favoriteButton);
        }
    }

    updateFavoriteButton(favoriteButton, productId);

    favoriteButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(productId, favoriteButton);
    });
});

function updateFavoriteButton(button, productId) {
    const favorites = getFavorites();
    const isFavorite = favorites.includes(productId);

    if (isFavorite) {
        button.innerHTML = "♥";
        button.classList.add("is-favorite");
        button.setAttribute("aria-label", "Hapus dari favorit");
    } else {
        button.innerHTML = "♡";
        button.classList.remove("is-favorite");
        button.setAttribute("aria-label", "Tambah ke favorit");
    }
}

function toggleFavorite(productId, button) {
    let favorites = getFavorites();
    const index = favorites.indexOf(productId);

    if (index === -1) {
        favorites.push(productId);
    } else {
        favorites.splice(index, 1);
    }

    saveFavorites(favorites);
    updateFavoriteButton(button, productId);

    button.classList.add("favorite-click");

    setTimeout(() => {
        button.classList.remove("favorite-click");
    }, 250);
}

/* =====================================================
    5. NAVBAR FAVORITE
===================================================== */

const navbarFavorite = document.querySelector('.nav-icon[aria-label="Favorit"]');

if (navbarFavorite) {
    navbarFavorite.addEventListener("click", () => {
        window.location.href = "favorit.html";
    });
}

/* =====================================================
    6. NAVBAR SCROLL EFFECT
===================================================== */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

/* =====================================================
    7. IMAGE FALLBACK
===================================================== */

const images = document.querySelectorAll("img");

images.forEach((image) => {
    image.addEventListener("error", () => {
        console.warn(`Gambar tidak ditemukan: ${image.src}`);
    });
});

/* =====================================================
    8. PAGE TRANSITION
===================================================== */

const internalLinks = document.querySelectorAll('a[href$=".html"]');

internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const target = link.getAttribute("href");
        const currentPage = window.location.pathname.split("/").pop();

        if (!target || target === "#" || target === currentPage) {
            return;
        }

        event.preventDefault();
        document.body.classList.add("page-exit");

        setTimeout(() => {
            window.location.href = target;
        }, 180);
    });
});

/* =====================================================
    9. REVEAL ANIMATION
===================================================== */

const revealElements = document.querySelectorAll(
    ".product-card, .umkm-feature, .section-heading"
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });
}

/* =====================================================
    10. PRODUCT SEARCH BAR
===================================================== */

const productSearch = document.querySelector("#productSearch");
const emptySearch = document.querySelector("#emptySearch");

if (productSearch) {
    productSearch.addEventListener("input", () => {
        const keyword = productSearch.value.trim().toLowerCase();
        let found = false;

        productCards.forEach((card) => {
            const cardText = card.textContent.toLowerCase();

            if (!keyword || cardText.includes(keyword)) {
                card.style.display = "";
                found = true;
            } else {
                card.style.display = "none";
            }
        });

        if (emptySearch) {
            emptySearch.style.display = found ? "none" : "block";
        }
    });
}

/* =====================================================
    11. FAVORITE PAGE
===================================================== */

const favoriteGrid = document.querySelector("#favoriteGrid");
const favoriteEmpty = document.querySelector("#favoriteEmpty");

const favoriteProducts = {
    "keripik-pisang": {
        name: "Keripik Pisang",
        category: "Makanan",
        location: "Malang",
        price: "Rp15.000",
        rating: "4.9",
        image: "assets/produk/keripik.webp"
    },
    "kopi-lokal": {
        name: "Kopi Lokal",
        category: "Minuman",
        location: "Bondowoso",
        price: "Rp35.000",
        rating: "4.8",
        image: "assets/produk/kopi.jpg"
    },
    "batik-nusantara": {
        name: "Batik Nusantara",
        category: "Fashion",
        location: "Solo",
        price: "Rp120.000",
        rating: "5.0",
        image: "assets/produk/batik.jpg"
    },
    "anyaman-bambu": {
        name: "Anyaman Bambu",
        category: "Kerajinan",
        location: "Probolinggo",
        price: "Rp75.000",
        rating: "4.7",
        image: "assets/produk/anyaman.jpg"
    }
};

function renderFavorites() {
    if (!favoriteGrid) return;

    const favorites = getFavorites();
    favoriteGrid.innerHTML = "";

    if (favorites.length === 0) {
        favoriteGrid.style.display = "none";
        if (favoriteEmpty) {
            favoriteEmpty.style.display = "block";
        }
        return;
    }

    favoriteGrid.style.display = "grid";
    if (favoriteEmpty) {
        favoriteEmpty.style.display = "none";
    }

    favorites.forEach((productId) => {
        const product = favoriteProducts[productId];

        if (!product) {
            console.warn("Produk favorit tidak ditemukan:", productId);
            return;
        }

        const card = document.createElement("article");
        card.className = "product-card reveal";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button type="button" class="product-favorite is-favorite" aria-label="Hapus dari favorit">
                    ♥
                </button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <p class="product-location">${product.location}</p>
                <div class="product-bottom">
                    <strong>${product.price}</strong>
                    <span>★ ${product.rating}</span>
                </div>
            </div>
        `;

        const removeButton = card.querySelector(".product-favorite");
        removeButton.addEventListener("click", () => {
            let currentFavorites = getFavorites();
            currentFavorites = currentFavorites.filter(id => id !== productId);
            saveFavorites(currentFavorites);
            renderFavorites();
        });

        favoriteGrid.appendChild(card);
    });
}

renderFavorites();

/* =====================================================
    12. CONTACT FORM → EMAIL
===================================================== */

const contactForm = document.querySelector("#contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const message = document.querySelector("#message").value.trim();

        const myEmail = "davidnajib350@gmail.com";
        const subject = `Pesan dari ${name} - PasarKita`;
        const body = `Halo MauviiDev,\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`;

        const mailtoURL = `mailto:${myEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoURL;
    });
}

/* =====================================================
    13. CONSOLE INFORMATION
===================================================== */

console.log("PasarKita — Personal Frontend Project");
console.log("Designed & Developed by Maulana David Hidayat");