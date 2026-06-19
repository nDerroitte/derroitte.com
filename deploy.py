#!/usr/bin/env python3
"""Deploiement FTPS de derroitte.com.

Cibles:
    (defaut)        # le site -> public_html/
    --app           # l'app Flask jeansimon -> flask_app/ (+ restart auto)

Modes:
    python deploy.py            # push incremental (n'envoie que les fichiers modifies)
    python deploy.py --force    # re-envoie tout, meme inchange
    python deploy.py --mirror   # push + supprime cote serveur les reliques (site uniquement)
    python deploy.py --mirror --dry-run   # montre ce qui serait fait, SANS rien modifier
    python deploy.py --app      # deploie l'app jeansimon et la redemarre

Dependances: ftplib (stdlib) + python-dotenv. Rien d'autre.
"""
from ftplib import FTP_TLS
from dotenv import load_dotenv
import io
import os
import sys

load_dotenv()

# === Configuration ===
FTP_HOST = "ftp.derroitte.com"
FTP_USER = os.environ.get("FTP_USER")
FTP_PASS = os.environ.get("FTP_PASS")

APP = "--app" in sys.argv
if APP:
    LOCAL_DIR = "./derroitte.com/flask_app"   # app Flask jeansimon
    REMOTE_DIR = "flask_app"
else:
    LOCAL_DIR = "./derroitte.com/public_html"  # le site
    REMOTE_DIR = "public_html"

# En mode --mirror, ne JAMAIS supprimer ces entrees (relatives a REMOTE_DIR),
# meme si elles n'existent pas en local : SSL, outil de certif, montages d'apps.
PROTECTED = {".well-known", "certsage.php", "jeansimon", "flask", "flask2", "mariage"}

FORCE = "--force" in sys.argv or os.environ.get("FORCE") == "1"
MIRROR = "--mirror" in sys.argv or os.environ.get("MIRROR") == "1"
DRY = "--dry-run" in sys.argv or os.environ.get("DRY_RUN") == "1"

# Garde-fou : --mirror seulement pour le site. Sur l'app il supprimerait
# les uploads/ et le .env du serveur (absents en local) -> interdit.
if MIRROR and REMOTE_DIR != "public_html":
    sys.exit("Refus : --mirror est reserve au site (public_html). "
             "Sur l'app, un push simple suffit et ne supprime rien.")


def connect():
    ftp = FTP_TLS()
    ftp.connect(FTP_HOST, 21)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.prot_p()
    ftp.voidcmd("TYPE I")  # binaire, requis pour SIZE
    return ftp


def ensure_remote_dir(ftp, path):
    """Cree l'arborescence distante composant par composant (idempotent)."""
    cur = ""
    for part in path.strip("/").split("/"):
        cur = f"{cur}/{part}" if cur else part
        try:
            ftp.mkd(cur)
        except Exception:
            pass  # existe deja


def remote_size(ftp, path):
    try:
        return ftp.size(path)
    except Exception:
        return None


def upload_all(ftp):
    sent = skipped = 0
    made = set()
    for root, _dirs, files in os.walk(LOCAL_DIR):
        rel = os.path.relpath(root, LOCAL_DIR).replace("\\", "/")
        rdir = REMOTE_DIR if rel == "." else f"{REMOTE_DIR}/{rel}"
        if rdir not in made:
            ensure_remote_dir(ftp, rdir)
            made.add(rdir)
        for name in files:
            lpath = os.path.join(root, name)
            rpath = f"{rdir}/{name}"
            label = name if rel == "." else f"{rel}/{name}"
            if not FORCE and remote_size(ftp, rpath) == os.path.getsize(lpath):
                skipped += 1
                continue
            if DRY:
                print(f"  [dry] ^ {label}")
            else:
                with open(lpath, "rb") as fh:
                    ftp.storbinary(f"STOR {rpath}", fh)
                print(f"  ^ {label}")
            sent += 1
    print(f"Upload : {sent} envoye(s), {skipped} inchange(s)")


def local_sets():
    files, dirs = set(), set()
    for root, _ds, fs in os.walk(LOCAL_DIR):
        rel = os.path.relpath(root, LOCAL_DIR).replace("\\", "/")
        if rel != ".":
            dirs.add(rel)
        for f in fs:
            files.add(f if rel == "." else f"{rel}/{f}")
    return files, dirs


def remote_walk(ftp, base, rel=""):
    files, dirs = [], []
    path = f"{base}/{rel}" if rel else base
    try:
        items = list(ftp.mlsd(path))
    except Exception:
        return files, dirs
    for name, facts in items:
        if name in (".", ".."):
            continue
        r = f"{rel}/{name}".lstrip("/")
        if facts.get("type") == "dir":
            dirs.append(r)
            sf, sd = remote_walk(ftp, base, r)
            files += sf
            dirs += sd
        else:
            files.append(r)
    return files, dirs


def mirror(ftp):
    lfiles, ldirs = local_sets()
    rfiles, rdirs = remote_walk(ftp, REMOTE_DIR)
    protected = lambda rel: rel.split("/")[0] in PROTECTED

    delf = 0
    for rf in rfiles:
        if protected(rf) or rf in lfiles:
            continue
        if DRY:
            print(f"  [dry] x {rf}")
            delf += 1
            continue
        try:
            ftp.delete(f"{REMOTE_DIR}/{rf}")
            print(f"  x {rf}")
            delf += 1
        except Exception as e:
            print(f"  ! {rf} ({e})")

    deld = 0
    for rd in sorted(rdirs, key=lambda p: p.count("/"), reverse=True):
        if protected(rd) or rd in ldirs:
            continue
        if DRY:
            print(f"  [dry] x {rd}/")
            deld += 1
            continue
        try:
            ftp.rmd(f"{REMOTE_DIR}/{rd}")
            print(f"  x {rd}/")
            deld += 1
        except Exception as e:
            print(f"  ! {rd}/ ({e})")
    verb = "seraient supprime(s)" if DRY else "supprime(s)"
    print(f"Mirror : {delf} fichier(s) + {deld} dossier(s) {verb}")


def restart_app(ftp):
    """Redemarre l'app Passenger en touchant tmp/restart.txt."""
    ensure_remote_dir(ftp, f"{REMOTE_DIR}/tmp")
    ftp.storbinary(f"STOR {REMOTE_DIR}/tmp/restart.txt", io.BytesIO(b"restart\n"))
    print("App redemarree (tmp/restart.txt touche).")


def main():
    mode = ("force " if FORCE else "") + ("mirror" if MIRROR else "push")
    if DRY:
        mode += " [DRY-RUN, aucune modif]"
    print(f"=== Deploiement -> {REMOTE_DIR}/  ({mode.strip()}) ===")
    ftp = connect()
    upload_all(ftp)
    if MIRROR:
        print("--- Mirror : nettoyage des reliques ---")
        mirror(ftp)
    if APP and not DRY:
        restart_app(ftp)
    ftp.quit()
    print("Termine.")


if __name__ == "__main__":
    main()
