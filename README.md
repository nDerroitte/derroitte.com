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

## Flask

Y'a une python app qui tourne sur le serveur qui lance app.py
Tout ce qui est dans le folder flaks_app est pas servit donc pas de prob de sécurité avec le .env

### Bugs

- App qui est bloqué a "It works", c'est parce qu'ils overwrittent app.py avec un bete python, suffit de redeploy

## SEO

Objectif : ranker sur "derroitte" (requête de marque, faible concurrence).

Fait :
* `robots.txt` : `Disallow: /` -> `Allow: /` (le site etait totalement bloque pour Google)
* `robots.txt` : exclusions des apps privees `/mariage/`, `/jeansimon/`, alias `/js/`, et `/files/` (CV non indexe)
* `.htaccess` : redirect `/js/` -> `/jeansimon/` (URL exacte, les scripts /js/*.js restent servis)
* `sitemap.xml` cree (page d'accueil uniquement) + reference dans `robots.txt`
* Google Search Console : propriete "Domaine" derroitte.com validee (TXT DNS dans cPanel Zone Editor)
* Search Console : sitemap soumis + indexation de l'accueil demandee
* On-page (dans le `<head>`, aucun impact visuel) : `<meta description>`, `<link canonical>`, balises Open Graph (titre `<title>` garde le nom seul)
* Donnees structurees JSON-LD `Person` (relie le nom au site + GitHub + LinkedIn)

A faire :
* Surveiller l'indexation : `site:derroitte.com` dans Google (qq jours), puis suivre la requete "derroitte" dans Search Console
* Optionnel : og:image pour les apercus de partage (LinkedIn) - pas d'image dediee pour l'instant
* Optionnel : Google Analytics si on veut le total des visites (Search Console ne montre que les clics depuis Google)
* Liens entrants coherents (LinkedIn, GitHub -> derroitte.com)

### Notes infra (pour ref)
* DNS gere par l'hebergeur (NS `dns1/dns2.namecheaphosting.com`), pas par Namecheap BasicDNS -> les enregistrements DNS se font dans cPanel > Zone Editor
* Deploiement du site : `python deploy.py` (FTPS, envoie `derroitte.com/public_html` -> `public_html/`)