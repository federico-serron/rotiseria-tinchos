import pytest
from app import create_app, db
from app.models import User
from flask_jwt_extended import create_access_token

# Test: Signup
def test_signup(client):
    response = client.post('/user/signup', json={
        "email": "test@example.com",
        "password": "123456",
        "name": "Test User",
        "phone": "123456789",
        "address": "Fake Street 123"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert 'user' in data
    assert data['user']['email'] == "test@example.com"