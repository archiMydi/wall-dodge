# Wall Dodge

Wall Dodge est un jeu d’arcade où vous contrôlez une balle qui doit esquiver des murs et obstacles descendant du haut de l’écran. Le but est de survivre le plus longtemps possible en évitant les collisions.

## Fonctionnalités

- **Déplacement fluide de la balle** : Utilisez les flèches directionnelles ou ZQSD pour déplacer la balle dans toutes les directions.
- **Obstacles variés** : Deux types d’obstacles sont générés aléatoirement :
  - Murs rectangulaires avec ouverture aléatoire
  - Murs sinueux avec tunnel mouvant
- **Difficulté progressive** : La vitesse et la difficulté des obstacles augmentent avec le temps.
- **Détection de collision précise** : La partie s’arrête dès que la balle touche un mur.
- **Score basé sur la survie** : Le score correspond au temps de survie affiché en temps réel.
- **Écran de démarrage et de fin** : Interface simple pour démarrer, recommencer ou quitter la partie.
- **Redémarrage rapide** : Appuyez sur “r” ou cliquez sur “Rejouer” pour relancer une partie.

## Contrôles

- **Déplacement** : Flèches directionnelles ou ZQSD
- **Rejouer** : Touche `r` ou bouton “Rejouer” à l’écran de fin
- **Pause** : (À implémenter) Touche `Échap` ou bouton dédié

## Installation & Lancement

1. **Cloner le dépôt**

```bash
git clone <url-du-repo> cd wall-dodge
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Lancer le jeu en mode développement**

```bash
npm run dev
```

Ouvrez ensuite l’URL indiquée (généralement http://localhost:5173) dans votre navigateur.

4. **Compiler pour la production**

```bash
npm run build
```

## Structure du projet

- `src/entities/` : Entités principales du jeu (`Ball`, `RectObstacle`, `SinuousObstacle`)
- `src/core/` : Gestion des entrées clavier
- `src/managers/` : Gestionnaire d’obstacles
- `src/main.ts` : Boucle principale du jeu et logique d’interface
- `src/tests/` : Tests unitaires (Jest ou Vitest)

## Tests

Pour lancer les tests unitaires :

```bash
npm run test
```

## Règles du jeu

- La balle commence au centre bas de l’écran.
- Des obstacles descendent du haut de l’écran à intervalles réguliers.
- Déplacez la balle pour passer à travers les ouvertures.
- Si la balle touche un mur, la partie s’arrête et votre score s’affiche.
- Essayez de survivre le plus longtemps possible !

## Scénarios BDD

Le fichier `BDD.md` contient des scénarios de tests comportementaux (Gherkin) pour toutes les fonctionnalités principales du jeu.

## Améliorations possibles

- Ajout d’un système de pause/reprise
- Tableaux des scores
- Effets sonores et visuels
- Obstacles et bonus supplémentaires

## Auteurs

- Projet réalisé dans le cadre du module “Qualité et tests” – MDSchool

---

Bon jeu !
