# derroitte.com

## Flask

Je pense que j'ai une app qui run parce que ça me 403 mais je suis pas sûr

## DNS
IP > derroitte.com. Permet d'enregistrer le nom sur un DNS.

Quand t'as payé ton .com, il a été enregistré sur le serveur .com. Quand tu googles derroitte.com, si il est pas dans ton cache, le DNS de voo va contacter le DNS .com pour savoir où il est stocké.

## SSL

C'est le certificat qui permet de HTTPS son site. Moi j'ai payé un Positive SSL payant comme un pigeon mais tu peux en faire des gratuits genre Let's Encrypt

Update 2025 ; on est passé en Let's encrypt : https://community.letsencrypt.org/t/certsage-acme-client-version-2-1-0-easy-webpage-interface-optimized-for-cpanel-no-commands-to-type-root-not-required-fully-automated-certificate-renewals/236149

## Hosting

C'est le serveur où est host le siteweb. 

Name4cheap utilise le CPanel pour l'associer. Stellar c'est leur plan Shared Host donc tu partages un serveurt avec plein de gens de bonne chance pour les ressources (:

## Security

https://owasp.org/www-project-top-ten/

Mis en place place :
* robots.txt
* Content-Security-Policy in .htaccess -> donne un 403 si on l'accède par URL direct, a changer ? 
* Header set X-Content-Type-Options "nosniff"x²