from app.models import User

def get_user_by_id(id):
    user = User.query.filter_by(id=id).first()
    
    if not user:
        raise Exception("User not found")
    else:
        return user.serialize()