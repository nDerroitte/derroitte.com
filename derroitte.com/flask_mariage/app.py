from flask import Flask, render_template, request, redirect, url_for, session, send_from_directory, abort, flash
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

app = Flask(__name__)



load_dotenv()

app.secret_key = os.getenv('SECRET_KEY') 
PASSWORD = os.getenv("PASSWORD")
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploads/<path:filename>')
def uploads(filename):
    return send_from_directory('uploads', filename)

@app.route('/upload', methods=['POST'])
def upload():
    folder_path = app.config['UPLOAD_FOLDER']

    os.makedirs(folder_path, exist_ok=True) 

    files = request.files.getlist('file')
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(folder_path, filename)
            file.save(filepath)

    return redirect(url_for('index'))


@app.route('/delete/<filename>', methods=['POST'])
def delete_photo(filename):
    if not session.get('authenticated', False):
        abort(403)

    import os
    from werkzeug.utils import secure_filename

    filename = secure_filename(filename)
    path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(path):
        os.remove(path)
        flash('Photo supprimée.')
    else:
        flash('Fichier introuvable.')

    return redirect(url_for('index'))


@app.route('/', methods=['GET', 'POST'])
def index():
    folder_path = app.config['UPLOAD_FOLDER']
    if not os.path.exists(folder_path):
        images = []
    else:
        images = os.listdir(folder_path)

    return render_template('mariage.html', images=images)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] == 'admin' and request.form['password'] == PASSWORD:
            session['authenticated'] = True
            flash('Connecté.')
            return redirect(url_for('index'))  # ta page d'accueil
        else:
            flash('Échec de la connexion.')
    return render_template('login.html')


@app.route('/logout')
def logout():
    session['authenticated'] = False
    flash('Déconnecté.')
    return redirect(url_for('index'))


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