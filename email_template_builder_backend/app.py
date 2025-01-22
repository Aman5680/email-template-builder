from flask import Flask, request, jsonify, send_file, render_template_string
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

# Define the base directory of the project
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Define paths for uploads and layout
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
LAYOUT_FILE = os.path.join(BASE_DIR, 'layout.html')

# Ensure the uploads folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Configure Flask app
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# MongoDB setup (optional, for saving email configurations)
client = MongoClient('mongodb://localhost:27017/')
db = client.email_template_builder
configs_collection = db.configurations

# Route: Serve the layout.html file
@app.route('/getEmailLayout', methods=['GET'])
def get_email_layout():
    """Serves the base layout HTML file."""
    return send_file(LAYOUT_FILE, mimetype='text/html')

# Route: Upload an image
@app.route('/uploadImage', methods=['POST'])
def upload_image():
    """Handles image uploads and returns the file URL."""
    if 'image' not in request.files:
        return jsonify({"error": "No image file found"}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Secure and save the file
    filename = secure_filename(image.filename)
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image.save(image_path)

    # Return the image URL
    return jsonify({"url": f"http://127.0.0.1:5000/uploads/{filename}"})

# Route: Serve uploaded images
@app.route('/uploads/<filename>')
def serve_image(filename):
    """Serves uploaded images."""
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    return send_file(file_path)

# Route: Render and download the updated email template
@app.route('/renderAndDownloadTemplate', methods=['POST'])
def render_and_download_template():
    """Render the updated HTML template and make it downloadable."""
    # Load the base layout HTML
    with open(LAYOUT_FILE, 'r') as f:
        layout_html = f.read()

    # Get user-submitted data
    config = request.json

    # Render the template
    rendered_html = render_template_string(layout_html, **config)

    # Save the rendered HTML to a file
    output_file = os.path.join(app.config['UPLOAD_FOLDER'], 'updated_email.html')
    with open(output_file, 'w') as f:
        f.write(rendered_html)

    # Return the rendered HTML file as a downloadable response
    return send_file(output_file, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
