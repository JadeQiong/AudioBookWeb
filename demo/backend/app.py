from flask import Flask, jsonify, request, Blueprint
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:5432/audiobook'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the database models
class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    cover_url = db.Column(db.String(500))
    category = db.Column(db.String(100))
    author = db.Column(db.String(255))
    audioSrc = db.Column(db.String(500))
    play_count = db.Column(db.Integer, default=0)

class PlaybackLog(db.Model):
    __tablename__ = 'playback_logs'
    log_id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    user_id = db.Column(db.String(100))
    play_timestamp = db.Column(db.DateTime, default=db.func.now())
    duration = db.Column(db.Integer)

# Initialize the database
with app.app_context():
    db.create_all()

# Create a Blueprint for playback-related routes
playback_bp = Blueprint('playback', __name__, url_prefix='/api/playback')

# API: Record playback log
@playback_bp.route('/record', methods=['POST'])
def record_play():
    data = request.json
    book_id = data.get('book_id')
    user_id = data.get('user_id', 'guest')
    duration = data.get('duration', 0)

    # Insert playback log
    playback_log = PlaybackLog(book_id=book_id, user_id=user_id, duration=duration)
    db.session.add(playback_log)

    # Update the number of times a book is played
    book = Book.query.get(book_id)
    if book:
        book.play_count += 1
        db.session.commit()

    return jsonify({"message": "Playback recorded successfully"})

# API: Get the number of times a book is played
@playback_bp.route('/count/<int:book_id>', methods=['GET'])
def get_book_play_count(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    return jsonify({"play_count": book.play_count})

# Register the Blueprint with the main app
app.register_blueprint(playback_bp)

if __name__ == '__main__':
    app.run(debug=True)
