# myIRC
Dernier projet réalisé dans le cadre de la piscine de l'ETNA, en groupe de 4. Le but était de créer en une semaine un chat IRC avec différentes fonctionnalités clés.
J'ai principalement travaillé sur les fonctions liées à la base de données et leur intégration.

## Sujet
### Voici la liste des fonctionnalités demandées :

- Implémentation du protocole
  - La communication doit respecter le norme [RFC 1459](http://abcdrfc.free.fr/rfc-vf/rfc1459.html)
  - La communication réseau doit se faire avec [socket.io](https://socket.io)

 - Gestion des comptes utilisateurs
  - Un utilisateur doit pouvoir s'authentifier en cli. L'authentification doit pouvoir se faire par des paramètres donnés au programme comme mysql.(-u / -p)
  - Il doit être possible de modifier le mot de passe d'un utilisateur depuis un utilisateur admin.
- IRC
  - One To One
    - Il doit être possible de communiquer directement avec un utilisateur.
  - Group Chat
    - Il doit être possible de créer et supprimer un canal de communication
    - Il doit être possible de lister les canaux de communication
    - Il doit être possible de rejoindre un/des canaux de communications
    - Il doit être possible d'envoyer et lire des messages sur les canaux de communications
- Export de données
  - Il doit être possible d'exporter l'ensemble des conversations réalisées entre deux périodes de temps données.
  - Il doit être possible d'exporter l'historique des conversations de l'utilisateur connecté.
  - L'administrateur doit pouvoir exporter l'ensemble des conversations d'un utilisateur donné.
