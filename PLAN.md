# Constellation personnelle

Une carte du ciel où chaque événement marquant de ta vie devient une étoile,
reliée aux autres dans l'ordre chronologique pour former ta propre constellation.

## Stack

- HTML + CSS + JS vanilla. Pas de framework, pas de build step.
- Rendu du ciel en `<canvas>` (2D context).
- Persistance en `localStorage`, aucun backend.
- Déploiement prévu sur Netlify ou Vercel (site statique, aucune config nécessaire).

## Modèle de données

Un événement :

```js
{
  id: string,      // ex: crypto.randomUUID()
  title: string,   // ex: "Premier appart"
  date: string,    // ISO "YYYY-MM-DD"
  note: string,    // optionnel
  x: number,       // position sur le canvas, générée une fois puis figée
  y: number
}
```

Stockés dans `localStorage` sous une seule clé, ex. `constellation.events`,
en tant que tableau JSON.

## Fichiers

```
constellation/
  index.html
  style.css
  script.js
  PLAN.md
```

---

## Backlog

Fais les tâches dans l'ordre, une à la fois. Quand t'en finis une, avant de
commit, montre-moi le diff et je te dis ce qui est bien / ce qui pourrait
être mieux. Si tu bloques sur une tâche, viens me voir.

### Issue 1 — Squelette du projet
- Crée `index.html`, `style.css`, `script.js`, bien liés entre eux.
- Structure de la page : un titre, un `<canvas>` pour le ciel, un formulaire
  (titre, date, note optionnelle) pour ajouter un événement, une zone pour
  les détails d'un événement sélectionné.
- **Critère de fin** : la page s'ouvre sur un fond façon nuit étoilée, sans
  erreur dans la console.

### Issue 2 — Données et formulaire
- Un tableau `events` en mémoire dans `script.js`.
- Le formulaire valide (titre + date obligatoires), crée un objet événement,
  l'ajoute au tableau, vide le formulaire.
- Affiche temporairement les événements sous forme de liste texte (juste
  pour vérifier que les données circulent — la vraie étoile vient après).
- **Critère de fin** : ajouter un événement met à jour la liste instantanément.
  Un refresh de page perd tout, c'est normal, la persistance vient plus tard.

### Issue 3 — Le ciel étoilé (canvas)
- Pour chaque événement sans position, génère un `x`/`y` aléatoire dans les
  limites du canvas (avec une marge) et fige-le sur l'objet.
- Dessine chaque événement comme un cercle ("étoile") à sa position.
- Redessine tout le canvas à chaque changement du tableau `events`.
- **Critère de fin** : ajouter un événement fait apparaître une nouvelle
  étoile à une position aléatoire, sans faire bouger les étoiles existantes.

### Issue 4 — Les lignes de constellation
- Trie les événements par date.
- Relie les étoiles consécutives (dans l'ordre chronologique, pas l'ordre
  d'ajout) par une ligne.
- **Critère de fin** : ajouter un événement avec une date *antérieure* aux
  autres insère correctement sa ligne au bon endroit dans la chaîne.

### Issue 5 — Interaction : sélectionner une étoile
- Détecte le clic sur le canvas, retrouve l'étoile la plus proche du clic
  (dans un rayon raisonnable).
- Affiche titre / date / note de l'événement sélectionné dans la zone de
  détails. Un clic dans le vide désélectionne.
- **Critère de fin** : cliquer près d'une étoile affiche ses infos ; cliquer
  ailleurs les cache.

### Issue 6 — Persistance (localStorage)
- Sauvegarde `events` dans `localStorage` à chaque ajout/suppression.
- Au chargement de la page, relis `localStorage` et reconstruit `events`
  (positions `x`/`y` comprises, pour que rien ne bouge au reload).
- **Critère de fin** : ajoute quelques événements, rafraîchis la page, la
  constellation est identique.

### Issue 7 — Polish (à faire si t'as le temps)
- Canvas responsive (s'adapte à la taille de la fenêtre).
- Léger scintillement des étoiles (animation d'opacité), en respectant
  `prefers-reduced-motion`.
- État vide sympa quand il n'y a aucun événement.
- Pouvoir supprimer un événement (l'étoile et sa ligne disparaissent).

### Issue 8 — Déploiement (à faire si t'as le temps)
- Pousse le repo sur GitHub, connecte-le à Netlify ou Vercel.
- Vérifie que le site déployé fonctionne et que la persistance marche
  bien en ligne.

---

## Notes ouvertes

- Taille des étoiles : uniforme, ou varie selon un critère (longueur du
  titre, ancienneté...) ? À décider librement à l'issue 3 ou 5.
- Le tri chronologique aux issues 4/6 suppose des dates uniques ; si deux
  événements ont la même date, l'ordre entre elles n'est pas défini —
  pas grave pour ce projet, mais bon à savoir.
