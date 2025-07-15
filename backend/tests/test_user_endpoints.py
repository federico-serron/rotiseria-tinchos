import pytest
from app import create_app, db
from app.models import User
from datetime import timedelta
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
    

def test_login(client):
    
    client.post('/user/signup', json={
        "email": "test@example.com",
        "password": "123456",
        "name": "Login User",
        "phone": "11111111",
        "address": "Login Street"
    })
    
    response = client.post('/user/login', json={
        "email": "test@example.com",
        "password": "123456"
    })
    assert response.status_code == 200
    data = response.get_json()
    assert 'access_token' in data
    assert data['msg'] == "Has iniciado sesion exitosamente"
    
    
def test_edit_user(client):
    # Crear user y obtener token
    signup = client.post('/user/signup', json={
        "email": "edit@example.com",
        "password": "123456",
        "name": "Edit User",
        "phone": "99999999",
        "address": "Edit Ave"
    })
    user_id = signup.get_json()['user']['id']
    expires = timedelta(days=1)
    token = create_access_token(identity=str(user_id), expires_delta=expires, additional_claims={"role": 'admin'})

    response = client.put(
        '/user/edit',
        json={"name": "Nuevo Nombre"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data['user']['name'] == "Nuevo Nombre"
    
    
def test_show_users(client):
    signup = client.post('/user/signup', json={
        "email": "show@example.com",
        "password": "123456",
        "name": "Show User",
        "phone": "88888888",
        "address": "Show Ave"
    })
    
    user_id = signup.get_json()['user']['id']
    expires = timedelta(days=1)
    token = create_access_token(identity=str(user_id), expires_delta=expires, additional_claims={"role": 'user'})

    response = client.get(
        '/user/users',
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)