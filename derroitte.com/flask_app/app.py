from flask import Flask, render_template, request, redirect, url_for, session, send_from_directory
import os
from dotenv import load_dotenv

app = Flask(__name__)


app.secret_key = os.getenv('SECRET_KEY') 

load_dotenv()
PASSWORD = os.getenv("PASSWORD")

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if not session.get('logged_in'):
        if request.method == 'POST':
            password = request.form.get('password')
            if password == PASSWORD:
                session['logged_in'] = True
                return redirect(url_for('upload'))  # rediriger après connexion
            else:
                return render_template('login.html', error="Mot de passe incorrect.")
        return render_template('login.html')

    # Ici, l'utilisateur est connecté
    if request.method == 'POST':
        if 'photo' not in request.files:
            return "Pas de fichier envoyé", 400
        
        file = request.files['photo']
        if file.filename == '':
            return "Fichier vide", 400

        upload_folder = 'uploads'
        os.makedirs(upload_folder, exist_ok=True)
        file.save(os.path.join(upload_folder, file.filename))
        return redirect(url_for('upload'))

    photos = os.listdir('uploads') if os.path.exists('uploads') else []
    return render_template('upload.html', photos=photos)

# Déconnexion (optionnel)
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('upload'))

@app.route('/')
def hello():
    return render_template('up.html')

# Gestion d'erreur 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

# Gestion d'erreur 403
@app.errorhandler(403)
def forbidden(e):
    return render_template('403.html'), 403

if __name__ == '__main__':
    app.run()