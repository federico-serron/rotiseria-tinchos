from app import db
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from typing import Optional


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(60), nullable=False)
    name: Mapped[str] = mapped_column(String(60), nullable=False)
    phone: Mapped[str] = mapped_column(String(40), nullable=False)
    address: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    role: Mapped[str] = mapped_column(String(10), nullable=False, default="user")
    last_login: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
    is_premium: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=False)
    
    invoices: Mapped[list['Invoice']] = relationship('Invoice', back_populates='user')
    
    media_id: Mapped[int] = mapped_column(ForeignKey('media.id'), nullable=True)
    media: Mapped['Media'] = relationship('Media', back_populates='users')
    
    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'phone': self.phone,
            'address': self.address,
            'role': self.role,
            'last_login': self.last_login,
            'is_active': self.is_active,
            'is_premium': self.is_premium,
            'invoices': [invoice.serialize() for invoice in self.invoices],
            'media_id': self.media_id
        }
    
    
class Menu(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    is_available: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
    
    category_id: Mapped[int] = mapped_column(ForeignKey('category.id'), nullable=False)
    category: Mapped['Category'] = relationship('Category', back_populates='menus')
    
    media_id: Mapped[int] = mapped_column(ForeignKey('media.id'), nullable=True)
    media: Mapped['Media'] = relationship('Media', back_populates='menus')
    
    invoice_menus: Mapped[list['InvoiceMenu']] = relationship('InvoiceMenu', back_populates='menu')
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'is_available': self.is_available,
            'category_id': self.category.id,
            'media_id': self.media.id,
            'invoice_menus': [invoice_menu.serialize() for invoice_menu in self.invoice_menus]
        }
    
    
class Category(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(60), nullable=False)
    note: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    
    menus: Mapped[list['Menu']] = relationship('Menu', back_populates='category')
    
    media_id: Mapped[int] = mapped_column(ForeignKey('media.id'), nullable=True)
    media: Mapped['Media'] = relationship('Media', back_populates='categories')
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'note': self.note,
            'menus': [menu.serialize() for menu in self.menus],
            'media_id': self.media_id
        }
    
    
class Invoice(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now(timezone.utc))
    total: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    user: Mapped['User'] = relationship('User', back_populates='invoices')
    
    invoice_menus: Mapped[list['InvoiceMenu']] = relationship('InvoiceMenu', back_populates='invoice')
    
    def serialize(self):
        return {
            'id': self.id,
            'date': self.date,
            'total': self.total,
            'user_id': self.user_id,
            'status': self.status,
            'invoice_menus': [invoice_menu.serialize() for invoice_menu in self.invoice_menus]
        }
        
class InvoiceMenu(db.Model):
    __tablename__ = 'invoice_menu'
    invoice_id: Mapped[int] = mapped_column(ForeignKey('invoice.id'), primary_key=True)
    menu_id: Mapped[int] = mapped_column(ForeignKey('menu.id'), primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    
    invoice: Mapped['Invoice'] = relationship('Invoice', back_populates='invoice_menus')
    menu: Mapped['Menu'] = relationship('Menu', back_populates='invoice_menus')
    
    def serialize(self):
        return {
            'invoice_id': self.invoice_id,
            'menu_id': self.menu_id,
            'quantity': self.quantity
        }
        
    
class Media(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(String(30), nullable=True)
    path: Mapped[str] = mapped_column(String(200), nullable=True)
    
    menus: Mapped[list['Menu']] = relationship('Menu', back_populates='media')
    categories: Mapped[list['Category']] = relationship('Category', back_populates='media')    
    users: Mapped[list['User']] = relationship('User', back_populates='media')    
    
    def serialize(self):
        return {
            'id': self.id,
            'type': self.type,
            'path': self.path,
            'menu_id': [menu.id for menu in self.menus],
            'category_id': [category.id for category in self.categories],
            'user_id': [user.id for user in self.users]
        }