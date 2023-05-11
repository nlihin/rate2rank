from flask import Blueprint, request, jsonify
from app import db
from app.models import Rank
from flask_jwt_extended import current_user, jwt_required

rank = Blueprint('rank', __name__)


@rank.route('/rank', methods=['POST'])
@jwt_required()
def rank_page():
    # user sends - number of questions, and new ranking list add table for which questions where asked

    user_rank = Rank.query.filter_by(username=current_user.username).first()
    user_rank.list_rank = request.json.get('list_rank')
    user_rank.number_questions += request.json.get('number_questions')
    db.session.commit()

    return jsonify(status=200)
