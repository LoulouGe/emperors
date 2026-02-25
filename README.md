# Le Jeu des Empereurs Romains

Un jeu de quiz interactif pour apprendre les dates de regne des 26 empereurs romains, d'Auguste a Severe Alexandre. Avec des portraits, du son et un score a la fin !

## Jouer en ligne

Le jeu est disponible ici : https://loulouge.github.io/emperors/

## Comment jouer

1. Ouvrir le lien ci-dessus (ou lancer `index.html` dans un navigateur avec Live Server)
2. Cliquer sur **Jeu des Empereurs Romains** pour commencer
3. Cliquer sur **Jouer**
4. Pour chaque empereur, choisir les bonnes dates de regne parmi 4 propositions
5. Un son pose la question et un feedback audio dit si la reponse est bonne ou pas
6. A la fin des 26 questions, un score final s'affiche avec un message adapte

## Structure du projet

```
emperors/
  index.html      <- la page HTML du jeu
  style.css       <- le style (couleurs, mise en page, responsive)
  game.js         <- la logique du jeu (questions, score, navigation)
  images/         <- les portraits des empereurs (JPG/WebP) + video d'accueil
  sounds/         <- les fichiers audio MP3 (questions et feedback vocal)
```

## Technologies

- HTML / CSS / JavaScript vanilla (pas de framework)
- Audio MP3 pour les questions et le feedback vocal
- Images JPG/WebP pour les portraits des empereurs
- Design responsive (adapte au mobile, tablette et PC)

## Auteur

Fait avec amour par Louise et son papa.
