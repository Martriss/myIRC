Projet réalisé dans le cadre de la piscine de l'ETNA. Le but était de créer en une semaine un chat IRC avec différentes fonctionnalités clés.
J'ai principalement travaillé sur les fonctions liées à la base de données et leur intégration.

Sujet
<html><body>
</div><div class="panel-heading panel-objective">Objectifs</div><div class="panel-body"><ul>
<li>Réaliser un projet de groupe</li>
<li>Collaborer en utilisant Git</li>
<li>Utiliser une base de données</li>
<li>Développer une application cli</li>
</ul>
</div><div class="panel-heading panel-project">Consignes</div><div class="panel-body"><p>En utilisant du TypeScript, vous devez développer un IRC-like.</p>
<p>Voici la liste des fonctionnalités demandées :</p>
<ul>
<li>Implémentation du protocole<ul>
<li>La communication doit respecter le norme <a target="_blank" href="http://abcdrfc.free.fr/rfc-vf/rfc1459.html" title="null">RFC 1459</a></li>
<li>La communication réseau doit se faire avec <a target="_blank" href="https://socket.io" title="null">socket.io</a></li>
</ul>
</li>
<li>Gestion des comptes utilisateurs<ul>
<li>Un utilisateur doit pouvoir s'authentifier en cli. L'authentification doit pouvoir se faire par des paramètres donnés au programme comme mysql.(-u / -p)</li>
<li>Il doit être possible de modifier le mot de passe d'un utilisateur depuis un utilisateur admin.</li>
</ul>
</li>
<li>IRC<ul>
<li>One To One <ul>
<li>Il doit être possible de communiquer directement avec un utilisateur.</li>
</ul>
</li>
<li>Group Chat<ul>
<li>Il doit être possible de créer et supprimer un canal de communication</li>
<li>Il doit être possible de lister les canaux de communication</li>
<li>Il doit être possible de rejoindre un/des canaux de communications</li>
<li>Il doit être possible d'envoyer et lire des messages sur les canaux de communications (à vous de définir comment vous souhaitez implémenter cette feature)</li>
</ul>
</li>
</ul>
</li>
<li>Export de données <ul>
<li>Il doit être possible d'exporter l'ensemble des conversations réalisées entre deux périodes de temps données.</li>
<li>Il doit être possible d'exporter l'historique des conversations de l'utilisateur connecté.</li>
<li>L'administrateur doit pouvoir exporter l'ensemble des conversations d'un utilisateur donné.</li>
</ul>
</li>
</ul>
<p>Tant que la fonctionnalité est accessible et que le parcours utilisateur est pensé, vous pouvez effectuer des changements dans ce qui a été présenté dans la vidéo.</p>
<p>Pour ce projet, nous vous imposons l'utilisation de&nbsp;socket.io&nbsp;pour la communication entre le serveur et les clients.</p>
<p>Vous pouvez utiliser d'autres librairies avec l'accord du responsable de votre module.</p>
<p>D'autres part, vous pouvez utiliser les bases de données suivantes pour ce projet :</p>
<ul>
<li>MariaDB</li>
<li>MongoDB</li>
<li>MySQL</li>
</ul>
</div><div class="panel-heading panel-project">Mise en place et Suivis</div><div class="panel-body"><p>Nous vous demanderons de mettre en place et réaliser :</p>
<ul>
<li>Un UML de base de données</li>
<li>Un gestionnaire de tâches pour votre groupe de projet (Un Board, Trello, Keep...)</li>
</ul>
</div></body></html>
