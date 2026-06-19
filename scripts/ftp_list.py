#!/usr/bin/env python3
"""READ-ONLY: recursively list the server's public_html so we can diff it
against the local public_html. Deletes nothing."""
from ftplib import FTP_TLS
from dotenv import load_dotenv
import os

load_dotenv()

ftp = FTP_TLS()
ftp.connect(os.environ.get("FTP_HOST"), 21)
ftp.login(os.environ.get("FTP_USER"), os.environ.get("FTP_PASS"))
ftp.prot_p()

ROOT = "public_html"


def walk(path):
    entries = []
    try:
        items = list(ftp.mlsd(path))
    except Exception:
        return entries
    for name, facts in items:
        if name in (".", ".."):
            continue
        full = f"{path}/{name}"
        t = facts.get("type", "")
        if t == "dir":
            entries.append(full + "/")
            entries.extend(walk(full))
        else:
            entries.append(full)
    return entries


for e in sorted(walk(ROOT)):
    print(e)

ftp.quit()
