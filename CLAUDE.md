# CLAUDE.md

Guide pour travailler efficacement sur ce projet. (Voir aussi `README.md` pour les notes perso.)

## Projet

Site personnel **derroitte.com** : un site statique (portfolio) + une petite app Flask.
Hébergé chez Namecheap (cPanel / LiteSpeed, plan mutualisé Stellar).

## Structure

```
deploy.py                      # script de déploiement FTPS (voir ci-dessous)
scripts/                       # utilitaires (génération favicon/og-image, audit FTP)
derroitte.com/
  public_html/                 # LE SITE statique (déployé vers public_html/)
    index.html                 # page unique (portfolio)
    css/  js/  images/  files/ # assets ; favicon*.png, natan-og.png, robots.txt, sitemap.xml
  flask_app/                   # app Flask "jeansimon" (déployée vers flask_app/)
```

## Déploiement (`deploy.py`)

Dépendances : `ftplib` (stdlib) + `python-dotenv`. Identifiants FTP dans `.env` (`FTP_USER`, `FTP_PASS`) — **jamais commités**.

```bash
python deploy.py                      # site : push incrémental (compare la taille)
python deploy.py --force              # site : tout ré-envoyer
python deploy.py --mirror             # site : push + supprime les reliques serveur (site only)
python deploy.py --mirror --dry-run   # aperçu du mirror, sans rien modifier
python deploy.py --app                # app jeansimon : push + restart auto (tmp/restart.txt)
```

- `--mirror` est **refusé hors de public_html** (garde-fou) et respecte la liste `PROTECTED`
  (`.well-known`, `certsage.php`, `jeansimon`, `flask`, `flask2`, `mariage`).
- Les données des apps (uploads, `.env`) vivent **hors de public_html** (ex. `flask_app/uploads/`
  à la racine FTP) → jamais touchées par le déploiement du site.

## Environnement (important)

- Le repo est sur un **chemin WSL** (`/home/nderroitte/repos/derroitte.com`) accédé depuis Windows.
- **Lancer Python via WSL** : `wsl.exe -d ubuntu -- bash -lc "cd <repo> && .venv/bin/python <script>"`.
  Pillow (génération d'images) n'est dispo que dans `.venv`, pas dans le `python3` système.
- Git depuis Windows peut crier « dubious ownership » → exception déjà ajoutée via
  `git config --global --add safe.directory`.

## Hébergement & DNS

- Nameservers : `dns1/dns2.namecheaphosting.com` → **le DNS est géré dans cPanel → Zone Editor**,
  PAS dans le panneau Advanced DNS de Namecheap.
- SSL : Let's Encrypt via **CertSage** (`certsage.php`). Ne pas supprimer `.well-known/` ni `certsage.php`.
- App active : **jeansimon** → montée via Passenger sur `/jeansimon` (AppRoot `flask_app`).
  `/js/` redirige vers `/jeansimon/` (`.htaccess`).

## SEO

- `robots.txt` autorise le crawl et exclut `/jeansimon/`, `/js/`, `/files/` (CV non indexé).
- `sitemap.xml` = page d'accueil. Métadonnées + JSON-LD `Person` dans le `<head>` de `index.html`.
- Propriété Google Search Console « Domaine » validée.

## Conventions

- **Commits git : JAMAIS de ligne `Co-Authored-By` (ni mention de Claude).**
- Ne pas committer de secrets (`.env` est gitignoré). `__pycache__`/`*.pyc` gitignorés.
- Après une modif du site → `python deploy.py` ; après une modif de l'app → `python deploy.py --app`.
