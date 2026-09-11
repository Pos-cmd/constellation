# Constellation personnelle

Une carte du ciel où chaque événement marquant de ta vie devient une étoile,
reliée aux autres dans l'ordre chronologique pour former ta propre constellation.

## Stack

- **Vite + React**, en JavaScript (pas TypeScript, pour rester simple — tu
  pourras toujours migrer plus tard si tu veux).
- **Tailwind CSS** pour le style (formulaire, panneau de détails).
- Le ciel lui-même est dessiné en **Canvas 2D natif** (`<canvas>` +
  `CanvasRenderingContext2D`) piloté depuis React via `useRef`/`useEffect` —
  c'est le seul bout "bas niveau" du projet, tout le reste (état, formulaire,
  liste) est du React classique.
- **Framer Motion** (optionnel, issue 7) pour animer le panneau de détails et
  les interactions — la lib d'animation la plus utilisée en React, ça vaut
  le coup de la pratiquer.
- Persistance en `localStorage`, aucun backend.
- Déploiement prévu sur Netlify ou Vercel — les deux détectent Vite tout
  seuls, aucune config nécessaire.

## Modèle de données

Un événement :

```js
{
  id: string,      // crypto.randomUUID()
  title: string,   // ex: "Premier appart"
  date: string,    // ISO "YYYY-MM-DD"
  note: string,    // optionnel
  x: number,       // position sur le canvas, générée une fois puis figée
  y: number
}
```

Stocké dans `localStorage` sous une seule clé, ex. `constellation.events`,
en tant que tableau JSON.

## Structure cible

```
constellation/
  PLAN.md
  index.html          -> généré par Vite
  src/
    main.jsx
    App.jsx            -> compose tout, détient l'état `events`
    components/
      Sky.jsx           -> le <canvas>, dessine étoiles + lignes
      EventForm.jsx      -> formulaire d'ajout
      EventDetails.jsx   -> panneau de détails de l'événement sélectionné
```

---

## Backlog

Fais les tâches dans l'ordre, une à la fois. Quand t'en finis une, avant de
commit, montre-moi le diff et je te dis ce qui est bien / ce qui pourrait
être mieux. Si tu bloques sur une tâche, viens me voir — donne-moi le
message d'erreur ou ce que tu as essayé, ça va plus vite.

### Issue 1 — Setup Vite + React + Tailwind
Commandes à lancer toi-même, dans le dossier `constellation` :

1. `npm create vite@latest . -- --template react` (si ça prévient que le
   dossier n'est pas vide à cause de `PLAN.md`/`.git`, continue quand même).
2. `npm install`
3. Installe Tailwind en suivant leur guide officiel "Vite" (cherche
   "tailwindcss vite react install") — ça revient à installer le paquet,
   ajouter le plugin dans `vite.config.js`, et importer Tailwind dans
   `src/index.css`.
4. `npm run dev` et vérifie que la page par défaut de Vite s'affiche dans le
   navigateur.
5. Nettoie `App.jsx` : vire le contenu par défaut (logo, compteur de clics),
   garde un composant qui affiche juste un fond plein écran façon nuit
   étoilée (une `div` avec une couleur de fond sombre via une classe
   Tailwind, ex. `bg-slate-950`).
6. Crée les trois fichiers vides dans `src/components/` (`Sky.jsx`,
   `EventForm.jsx`, `EventDetails.jsx`) — même s'ils ne font rien encore,
   ça pose la structure.

**Critère de fin** : `npm run dev` affiche une page avec un fond sombre
plein écran, sans erreur dans la console du navigateur.

**Si tu bloques, cherche** : scaffolding Vite, structure d'un projet React
(JSX, composants, props), installation de Tailwind avec Vite.

---

### Issue 2 — État et formulaire
Dépend de #1.

- Dans `App.jsx` : `const [events, setEvents] = useState([])`.
- `EventForm.jsx` reçoit une prop `onAdd` (une fonction). Il gère ses propres
  champs (titre, date, note) avec `useState`, et au submit du formulaire :
  valide que titre + date sont remplis, construit un objet événement avec un
  id via `crypto.randomUUID()`, appelle `onAdd(nouvelEvenement)`, puis vide
  les champs.
- Dans `App.jsx`, la fonction passée à `onAdd` fait
  `setEvents(prev => [...prev, nouvelEvenement])`.
- Affiche temporairement `events` sous forme de liste texte simple
  (`events.map(e => <li key={e.id}>{e.title} — {e.date}</li>)`) pour vérifier
  que les données circulent. Cette liste sera retirée à l'issue 3.

**Critère de fin** : remplir le formulaire et valider fait apparaître le
titre dans la liste, instantanément. Un refresh de page perd tout, c'est
normal, la persistance vient à l'issue #6.

**Si tu bloques, cherche** : `useState`, formulaires contrôlés en React
(`value` + `onChange`), "lifting state up" / passer des callbacks en props,
`crypto.randomUUID()`.

---

### Issue 3 — Le ciel étoilé (canvas)
Dépend de #2.

- `Sky.jsx` reçoit `events` en prop, et rend `<canvas ref={canvasRef} />`.
- Un `useEffect(() => { ... }, [events])` qui, à chaque changement de
  `events` :
  1. récupère le contexte : `const ctx = canvasRef.current.getContext('2d')`
  2. efface le canvas : `ctx.clearRect(0, 0, canvas.width, canvas.height)`
  3. pour chaque event, dessine un cercle à sa position :
     `ctx.beginPath(); ctx.arc(x, y, rayon, 0, Math.PI * 2); ctx.fill();`
- Le point délicat : chaque événement a besoin d'un `x`/`y` **stable** (pas
  recalculé à chaque redraw, sinon les étoiles sautent partout). Génère la
  position une seule fois, au moment où l'événement est créé (dans
  `EventForm.jsx` ou dans le `onAdd` de `App.jsx`), et stocke-la directement
  sur l'objet événement — pas besoin de la recalculer dans `Sky.jsx`.

**Critère de fin** : ajouter un événement fait apparaître une nouvelle étoile
à une position aléatoire ; les étoiles déjà là ne bougent pas.

**Si tu bloques, cherche** : `useRef` pour accéder à un élément DOM,
`useEffect` et son tableau de dépendances, les méthodes de base de
`CanvasRenderingContext2D` (`arc`, `fill`, `clearRect`, `fillStyle`).

---

### Issue 4 — Les lignes de constellation
Dépend de #3.

- Dans `Sky.jsx`, avant de dessiner, trie une copie de `events` par date
  (`[...events].sort((a, b) => a.date.localeCompare(b.date))` marche bien
  pour des dates au format ISO).
- Relie les étoiles consécutives dans cet ordre trié avec une ligne :
  `ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();`

**Critère de fin** : ajouter un événement avec une date antérieure aux
autres insère sa ligne au bon endroit dans la chaîne (pas juste à la fin).

**Si tu bloques, cherche** : `Array.prototype.sort`, `moveTo`/`lineTo`/
`stroke` du canvas.

---

### Issue 5 — Sélectionner une étoile
Dépend de #4.

- Dans `App.jsx` : `const [selected, setSelected] = useState(null)`.
- Sur `Sky.jsx`, écoute le clic sur le canvas (`onClick`), récupère la
  position du clic relative au canvas avec `getBoundingClientRect()`, puis
  trouve l'événement dont le `x`/`y` est le plus proche (distance :
  `Math.hypot(x - event.x, y - event.y)`). Si la distance est sous un seuil
  (ex. 20px), appelle une prop `onSelect(event)` ; sinon `onSelect(null)`.
- `EventDetails.jsx` reçoit `selected` en prop et affiche titre / date /
  note quand il n'est pas `null`, rien sinon.

**Critère de fin** : cliquer près d'une étoile affiche ses infos dans
`EventDetails.jsx` ; cliquer ailleurs les cache.

**Si tu bloques, cherche** : `getBoundingClientRect`, `Math.hypot`, rendu
conditionnel en React (`{selected && <...>}`).

---

### Issue 6 — Persistance (localStorage)
Dépend de #5.

- Au lieu de `useState([])`, initialise `events` avec une fonction :
  `useState(() => JSON.parse(localStorage.getItem('constellation.events')) || [])`
  — l'initialiseur "paresseux" ne tourne qu'au premier rendu.
- Un `useEffect(() => { localStorage.setItem(...) }, [events])` qui
  sauvegarde `events` (via `JSON.stringify`) à chaque changement.

**Critère de fin** : ajoute quelques événements, rafraîchis la page, la
constellation (positions comprises) est identique.

**Si tu bloques, cherche** : `localStorage.getItem`/`setItem`,
`JSON.stringify`/`parse`, initialiseur paresseux de `useState`.

---

### Issue 7 — Polish (à faire si t'as le temps)
Dépend de #6.

- Canvas responsive : écoute le resize de la fenêtre, ajuste `canvas.width`/
  `height` en conséquence (attention à multiplier par `window.devicePixelRatio`
  pour un rendu net).
- Scintillement léger des étoiles : dans la boucle de dessin, fais varier
  l'opacité de chaque étoile avec `Math.sin(Date.now() / 1000 + i)`, pilotée
  par `requestAnimationFrame`. Désactive-le si
  `window.matchMedia('(prefers-reduced-motion: reduce)').matches` est vrai.
- `npm install framer-motion` : enveloppe `EventDetails.jsx` dans
  `<AnimatePresence>` + `<motion.div>` pour une apparition/disparition en
  fondu plutôt qu'un affichage brutal.
- Un état vide sympa quand `events` est vide (message + ciel sans étoiles).
- Un bouton pour supprimer un événement (retire l'id du tableau `events`,
  l'étoile et ses lignes disparaissent).

**Si tu bloques, cherche** : `requestAnimationFrame`, `devicePixelRatio`,
doc de Framer Motion (`AnimatePresence`, `motion.div`).

---

### Issue 8 — Déploiement (à faire si t'as le temps)
Dépend de #6 (ou #7 si fait).

- `npm run build` génère le dossier `dist/`.
- Connecte le repo GitHub à Netlify ou Vercel — les deux reconnaissent Vite
  automatiquement (build command `npm run build`, output `dist`).
- Vérifie que le site déployé fonctionne et que la persistance marche bien
  en ligne.

---

## Notes ouvertes

- Taille des étoiles : uniforme, ou varie selon un critère (longueur du
  titre, ancienneté...) ? À décider librement à l'issue 3 ou 5.
- Le tri chronologique aux issues 4/6 suppose des dates uniques ; si deux
  événements ont la même date, l'ordre entre elles n'est pas défini —
  pas grave pour ce projet, mais bon à savoir.
