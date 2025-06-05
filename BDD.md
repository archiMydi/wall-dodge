# ===============================

# Fonctionnalité : Déplacement de la balle

# ===============================

**Fonctionnalité: Déplacement de la balle**

En tant que joueur, je veux pouvoir déplacer la balle dans les quatre directions (haut/bas/gauche/droite) afin d’esquiver les obstacles

**Scénario: La balle se déplace vers la droite**

Étant donné que le jeu a démarré et que la balle est au centre de l’écran  
Quand j’appuie sur la flèche « Droite »  
Alors la position X de la balle augmente d’une unité de déplacement

**Scénario: La balle se déplace vers la gauche**

Étant donné que le jeu est en cours et que la balle n’est pas sur le bord gauche
Quand j’appuie sur la flèche « Gauche »
Alors la position X de la balle diminue d’une unité de déplacement

**Scénario: La balle se déplace vers le haut**

Étant donné que le jeu est en cours et que la balle n’est pas sur le bord supérieur  
Quand j’appuie sur la flèche « Haut »  
Alors la position Y de la balle diminue d’une unité de déplacement

**Scénario: La balle se déplace vers le bas**

Étant donné que le jeu est en cours et que la balle n’est pas sur le bord inférieur  
Quand j’appuie sur la flèche « Bas »  
Alors la position Y de la balle augmente d’une unité de déplacement

# ===============================

# Fonctionnalité : Génération et défilement d’obstacles

# ===============================

**Fonctionnalité: Génération et défilement d’obstacles**

En tant que jeu  
Je veux générer des obstacles en haut de l’écran à intervalles réguliers  
Pour qu’ils défilent vers le bas et soient confrontés à la balle

**Scénario: Génération périodique d’un obstacle**

Étant donné que le jeu est en cours et que la dernière génération d’obstacle date de T0  
Quand le temps actuel atteint T0 + intervalle_de_base  
Alors un nouvel obstacle est créé en haut de l’écran avec une ouverture aléatoire

**Scénario: Défilement continu de l’obstacle**

Étant donné qu’un obstacle est présent à la position Y = Y0  
Quand on avance d’une frame (ou d’un delta_t)  
Alors la position Y de l’obstacle augmente de (vitesse × delta_t)

**Scénario: Augmentation progressive de la vitesse**

Étant donné que le temps total de jeu est supérieur à seuil_augmentation  
Quand on génère un nouvel obstacle  
Alors la vitesse de défilement des obstacles est augmentée de x%

**Scénario: Réduction progressive de la taille de l’ouverture**

Étant donné que le temps total de jeu est supérieur à un seuil de difficulté  
Quand on génère un nouvel obstacle  
Alors la largeur (ou la zone de passage) de l’ouverture est réduite d’un facteur y%

# ===============================

# Fonctionnalité : Détection de collision

# ===============================

**Fonctionnalité: Détection de collision entre la balle et un obstacle**

En tant que moteur de jeu  
Je veux vérifier, à chaque mise à jour, si la balle touche un obstacle  
Pour déclencher la fin de partie en cas de collision

**Scénario: La balle traverse l’ouverture sans collision**

Étant donné qu’un obstacle est en position Y_obs, avec une ouverture allant de X1 à X2  
Et que la balle est en position X_balle ∈ [X1, X2] et Y_balle juste avant Y_obs  
Quand l’obstacle continue de défiler et atteint la ligne Y_balle  
Alors il n’y a pas de collision et la partie continue

**Scénario: La balle entre en collision avec l’obstacle**

Étant donné qu’un obstacle est en position Y_obs, avec une ouverture allant de X1 à X2  
Et que la balle est en position X_balle < X1 ou X_balle > X2  
Quand l’obstacle atteint la ligne Y_balle  
Alors on détecte une collision et la partie se termine

# ===============================

# Fonctionnalité : Scoring et écran de fin

# ===============================

**Fonctionnalité: Gestion du score et de la fin de partie**

En tant que jeu  
Je veux calculer le score en fonction du temps de survie  
Et afficher un écran de fin lorsque la balle est touchée

**Scénario: Comptabiliser le score en temps réel**

Étant donné que la partie a commencé à l’instant T_début  
Quand le temps actuel est T_courant  
Alors le score affiché est égal à (T_courant – T_début) en secondes (ou en unités de frame)

**Scénario: Affichage de l’écran de fin**

Étant donné qu’une collision a été détectée à l’instant T_fin  
Quand la boucle de jeu détecte la collision  
Alors le moteur arrête de générer de nouveaux obstacles  
Et l’écran de fin est affiché avec le score final (T_fin – T_début)

# ===============================

# Fonctionnalité : Redémarrage de la partie

# ===============================

**Fonctionnalité: Redémarrage de la partie après game over**

En tant que joueur  
Je veux pouvoir relancer une nouvelle partie depuis l’écran de fin  
Pour retenter d’améliorer mon score

**Scénario: Appuyer sur “Rejouer” remet la balle à sa position initiale**

Étant donné que l’écran de fin est affiché et que j’ai cliqué sur “Rejouer”  
Quand je confirme mon choix  
Alors la balle est remise au centre initial  
Et tous les compteurs (score, vitesse, difficulté) sont remis à zéro  
Et la partie redémarre

**Scénario: Appuyer sur “Quitter” ferme le jeu ou revient au menu principal**

Étant donné que l’écran de fin est affiché et que j’ai cliqué sur “Quitter”  
Quand je confirme mon choix  
Alors je suis renvoyé au menu principal ou le jeu se ferme

# ===============================

# Fonctionnalité : Pause et reprise

# ===============================

**Fonctionnalité: Pause et reprise du jeu**

En tant que joueur  
Je veux pouvoir mettre le jeu en pause pour effectuer une pause ou traiter une interruption  
Pour reprendre exactement au même point ensuite

**Scénario: Mettre le jeu en pause**

Étant donné que le jeu est en cours et qu’aucune collision n’est détectée  
Quand j’appuie sur “Pause” (touche Échap ou bouton dédié)  
Alors la boucle de jeu est suspendue (toutes les animations et la génération d’obstacles s’arrêtent)  
Et un overlay “En pause” apparaît

**Scénario: Reprendre le jeu après pause**

Étant donné que le jeu est en pause et qu’un overlay “En pause” est visible  
Quand j’appuie de nouveau sur “Pause” (ou “Reprendre”)  
Alors la boucle de jeu reprend exactement à l’état précédent (positions, timers, score continuent)
