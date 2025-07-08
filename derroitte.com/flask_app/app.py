from flask import Flask, render_template, request, redirect, url_for, session, send_from_directory, abort
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
    tab = request.form.get('tab', 'main') 
    folder_path = os.path.join(app.config['UPLOAD_FOLDER'], tab)

    os.makedirs(folder_path, exist_ok=True) 

    files = request.files.getlist('file')
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(folder_path, filename)
            file.save(filepath)

    return redirect(url_for('index', tab=tab))


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST' and 'password' in request.form:
        if request.form['password'] == PASSWORD:
            session['authenticated'] = True
            return redirect(url_for('index'))

    authenticated = session.get('authenticated', False)
    tab = request.args.get('tab', 'main')

    folder_path = os.path.join(app.config['UPLOAD_FOLDER'], tab)
    if not os.path.exists(folder_path):
        images = []
    else:
        images = os.listdir(folder_path)

    return render_template('js.html', images=images, authenticated=authenticated, current_tab=tab)


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