# الذكاء الاصطناعي في خدمة المدرسة الجمهورية

Site vitrine de l’initiative nationale « L’IA au service de l’école républicaine », sous le haut patronage de la Première Dame.

Site 100 % statique : HTML, CSS et un petit script (`assets/dc-lite.js`, sans dépendance). Aucune compilation n’est nécessaire.

## Pages

| Fichier | Page |
|---|---|
| `index.html` | Accueil (arabe) |
| `fr.html` | Accueil (français) |
| `about.html` | عن المبادرة |
| `goals.html` | الأهداف والمبادئ |
| `first-lady.html` | السيدة الأولى |
| `news.html` | الأخبار |
| `partners.html` | كن شريكًا / تواصل |

Les images sont dans `assets/`.

## Tester en local

Ouvrir un terminal dans ce dossier, puis :

```bash
python3 -m http.server 8000
```

Ensuite ouvrir http://localhost:8000

## Déployer sur GitHub Pages

1. Créer un dépôt sur GitHub, puis y envoyer le contenu de ce dossier :
   ```bash
   git init
   git add .
   git commit -m "Site de l'initiative"
   git branch -M main
   git remote add origin https://github.com/<compte>/<depot>.git
   git push -u origin main
   ```
2. Sur GitHub : **Settings › Pages › Build and deployment** : Source = *Deploy from a branch*, Branch = `main`, dossier `/ (root)`, puis **Save**.
3. Le site est en ligne après une minute à l’adresse `https://<compte>.github.io/<depot>/`.

Domaine personnalisé : dans **Settings › Pages › Custom domain**, saisir le domaine (par exemple `www.educationia.mr`), puis créer chez l’hébergeur DNS un enregistrement `CNAME` vers `<compte>.github.io`.

Le site fonctionne aussi tel quel sur Netlify, Vercel ou Cloudflare Pages (glisser-déposer le dossier, sans commande de build).

## À compléter avant la mise en ligne

- Les actualités entre crochets `[...]` : remplacer par les vraies publications de la page Facebook et leurs photos.
- Le formulaire de partenariat (`partners.html`) est une maquette : il n’envoie rien. Pour le brancher, utiliser par exemple Formspree ou un service de formulaire, ou un lien `mailto:Contact@educationia.mr`.
