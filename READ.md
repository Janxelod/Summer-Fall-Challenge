Challenge Creative Developer BeTomorrow été 2022

Implémentation d'une simulation de fluide de type Lattice Boltzmann.
Techno : threejs + GLSL avec un rendu en 3 passes.

Détails d'implémentation : 
- passe 1 (Collision) : initialisation du système (iFrame == 0), ou récupération de l'état du système en provenance de la passe 2 (Stream), puis calcul des collisions afin de répartir les particules selon Navier-Stokes.
- passe 2 (Stream) : répartition des particules par simple diffusion
- passe 3 passe de visualisation densité -> palette de couleurs

Stockage : 1 pixel = 1 lattice node = 9 momentums (masse*vitesse), soit 9 floats encodés sur un pixel RGBA.
