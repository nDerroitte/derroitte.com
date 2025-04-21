from ftplib import FTP_TLS
from dotenv import load_dotenv
import os

load_dotenv()


# === Configuration ===
ftp_host = "ftp.derroitte.com"
ftp_user = os.environ.get("FTP_USER")
ftp_pass = os.environ.get("FTP_PASS")
remote_dir = "public_html/"   
local_dir = "./derroitte.com"    

def upload_dir(ftp, local_root, remote_root):
    def safe_mkdirs_and_cd(path):
        parts = path.strip("/").split("/")
        for part in parts:
            if part not in ftp.nlst():
                try:
                    ftp.mkd(part)
                    print(f"📁 Folder creation : {part}")
                except Exception:
                    pass  # déjà existant
            ftp.cwd(part)

    # Se placer dans le dossier de base distant (remote_root)
    ftp.cwd("/")
    safe_mkdirs_and_cd(remote_root)

    base_remote_path = ftp.pwd()  # on note l’endroit où on travaille

    for root, dirs, files in os.walk(local_root):
        rel_path = os.path.relpath(root, local_root)
        # Se repositionner sur le dossier de base
        ftp.cwd(base_remote_path)

        if rel_path != ".":
            safe_mkdirs_and_cd(rel_path.replace("\\", "/"))

        for f in files:
            local_file = os.path.join(root, f)
            with open(local_file, "rb") as file:
                print(f"📤 Uploading : {os.path.join(rel_path, f)}")
                ftp.storbinary(f"STOR {f}", file)

    ftp.cwd("/")  # on revient à la racine proprement




# Connexion FTPS (FTP sécurisé explicite)
ftp = FTP_TLS()
ftp.connect(ftp_host, 21)
ftp.login(ftp_user, ftp_pass)
ftp.prot_p()  # active le mode sécurisé
upload_dir(ftp, local_dir, remote_dir)
ftp.quit()

print("✅ Déploiement terminé !")
