const URL = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com";
let savedKey = null;

// Fonction asynchrone pour récupérer la clé API
export const getApiKey = async () => {

    // Vérifie si une clé API est déjà enregistrée en mémoire (évite de refaire plusieurs requêtes inutiles)
    if (savedKey) return savedKey;

    try {
        // Envoie une requête POST à l'API pour récupérer une clé
        const res = await fetch(`${URL}/keys`, {
            method: "POST",
            headers: { "Content-Type": "application/json" } // Spécifie que l'on envoie des données JSON
        });

        // Vérifie si la requête a échoué
        if (!res.ok) throw new Error("Erreur lors de la récupération de la clé API: " + res.statusText);

        // Extrait la clé API de la réponse et la sauvegarde
        savedKey = await res.json().then(data => data.key);
        return savedKey;

    } catch (error) {
        // Gère les erreurs en affichant un message d'erreur
        throw new Error(`Erreur API: ${error.message}`);
    }
};

// Fonction pour créer un tenant (espace utilisateur) si aucun n'existe déjà
export const createTenant = async (apiKey) => {
    // Vérifie si un tenantId est déjà enregistré dans le localStorage
    const storedTenant = localStorage.getItem("tenantId");
    if (storedTenant) return storedTenant; // Si un tenant existe déjà, le retourner directement

    try {
        // Envoie une requête POST à l'API pour créer un tenant
        const response = await fetch(`${URL}/tenants`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "x-zocom": apiKey // Utilisation de la clé API pour s'authentifier
            },
            body: JSON.stringify({ name: "Cote d'Azure" }) // Envoie le nom du tenant
        });

        // Vérifie si la requête a échoué
        if (!response.ok) return null;

        // Récupère l'ID du tenant dans la réponse et l'enregistre dans le localStorage
        const { id } = await response.json();
        localStorage.setItem("tenantId", id);
        return id;

    } catch (err) {
        // Affiche une erreur si la création du tenant échoue
        console.error("Erreur lors de la création du tenant:", err);
        throw err;
    }
};

// Fonction pour récupérer le menu du tenant
export const fetchMenu = async () => {
    try {
        // Obtient la clé API pour s'authentifier
        const key = await getApiKey();
        
        // Vérifie si un tenantId est enregistré, sinon utilise "Cote d'Azure" par défaut
        const tenantId = localStorage.getItem("tenantId") || "Cote d'Azure";

        // Liste des catégories d'articles à récupérer
        const categories = ["wonton", "dip"];

        // Effectue plusieurs requêtes pour récupérer le menu de chaque catégorie
        const menuData = await Promise.all(
            categories.map((category) =>
                fetch(`${URL}/menu?tenant=${tenantId}&type=${category}`, { 
                    headers: { "x-zocom": key } // Authentification avec la clé API
                })
                .then((res) => res.json()) // Convertit la réponse en JSON
            )
        );

        // Regroupe tous les items des différentes catégories dans un seul tableau et les retourne
        return menuData.flatMap((data) => data.items || []);

    } catch (error) {
        // Affiche une erreur si la récupération du menu échoue
        console.error("Erreur lors de la récupération du menu:", error);
        throw error;
    }
};
