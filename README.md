
# Projet PRID2122-G03

## Heroku
Site sur Heroku : https://prid2122-g03.herokuapp.com/

## Les utilisateurs encodés dans le système:

1)  Email: bl@epfc.eu
    Password: bruno
    Title : Manager

2)  Email: bp@epfc.eu
    Password: ben
    Title : Manager

3)  Email: as@epfc.eu
    Password: admin
    Title : AdminSystem

4)  Email: ib@epfc.eu
    Password: ines
    Title : Consultant

5)  Email: ss@epfc.eu
    Password: sev
    Title : Consultant

6)  Email: c7@epfc.eu
    Password: consul
    Title : Consultant

## Fonctionnalité supplémentaire
- Un administrateur existe dans le système : il a encore un peu plus de droits que le manager (il peut, par exemple, voir l'ensemble des utilisateurs et des catégories). Il peut également modifier quelques données signalétiques chez d'autres utilisateurs (même chez les managers).

## Notes de livraison
- Lors de l'édition des skills, un point d'exclamation apparait à coté de la skill qui ne totalise pas assez d'expérience pour le niveau sélectionné:
    - Starter et Junior : pas besoin d'avoir de l'expérience (auto-apprentissage)
    - Medior : besoin d'avoir minimum 2 ans d'expérience (dans les trainings et/ou missions)
    - Senior : besoin d'avoir minimum 4 ans d'expérience (dans les trainings et/ou missions)
    - Expert : besoin d'avoir minimum 6 ans d'expérience (dans les trainings et/ou missions)
- Quand les skills sont en mode édition et que l'utilisateur vient d'éditer ou d'ajouter une mission ou une formation, les skills ne se rafraichissent pas automatiquement (il faut d'abord sortir du mode d'édition: soit cliquer sur le bouton "Back to CV", soit cliquer sur la rubrique Skills).
- Un bug d'affichage a été détecté sur firefox lorsqu'un utilisateur ajoute une skill (dans la rubrique Skills): "Required" apparait en-dessous des cases "Skill" et "Level" pour l'ajout d'une nouvelle skill (cela n'est pas le cas dans chrome et edge).
- Les diagrammes se trouvent dans le dossier "Diagrams" :
    - Un diagramme de Use cases a été fait à l'origine pour visualiser comment agencer les écrans à l'origine du projet. Il n'est plus tout à fait représentatif du projet mais il nous a semblé pertinent de le garder.
    - ModelClasses.png est le diagramme de classes complet du modèle "as-built" demandé dans l'énoncé.
