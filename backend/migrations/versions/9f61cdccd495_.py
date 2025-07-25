"""empty message

Revision ID: 9f61cdccd495
Revises: a21328a0e8a9
Create Date: 2025-06-26 16:34:33.787524

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9f61cdccd495'
down_revision = 'a21328a0e8a9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('media',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(length=30), nullable=True),
    sa.Column('path', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('category',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=60), nullable=False),
    sa.Column('note', sa.String(length=200), nullable=True),
    sa.Column('media_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['media_id'], ['media.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('invoice',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('total', sa.Float(), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('menu',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('description', sa.String(length=200), nullable=True),
    sa.Column('is_available', sa.Boolean(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('media_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['category.id'], ),
    sa.ForeignKeyConstraint(['media_id'], ['media.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('invoice_menu',
    sa.Column('invoice_id', sa.Integer(), nullable=False),
    sa.Column('menu_id', sa.Integer(), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['invoice_id'], ['invoice.id'], ),
    sa.ForeignKeyConstraint(['menu_id'], ['menu.id'], ),
    sa.PrimaryKeyConstraint('invoice_id', 'menu_id')
    )
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('phone', sa.String(length=40), nullable=False))
        batch_op.add_column(sa.Column('address', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('role', sa.String(length=10), nullable=False))
        batch_op.add_column(sa.Column('last_login', sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column('is_active', sa.Boolean(), nullable=False))
        batch_op.add_column(sa.Column('is_premium', sa.Boolean(), nullable=False))
        batch_op.add_column(sa.Column('media_id', sa.Integer(), nullable=True))
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(length=100),
               type_=sa.String(length=60),
               nullable=False)
        batch_op.alter_column('password',
               existing_type=sa.VARCHAR(length=255),
               type_=sa.String(length=60),
               nullable=False)
        batch_op.alter_column('name',
               existing_type=sa.VARCHAR(length=50),
               type_=sa.String(length=60),
               nullable=False)
        batch_op.create_foreign_key(None, 'media', ['media_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.alter_column('name',
               existing_type=sa.String(length=60),
               type_=sa.VARCHAR(length=50),
               nullable=True)
        batch_op.alter_column('password',
               existing_type=sa.String(length=60),
               type_=sa.VARCHAR(length=255),
               nullable=True)
        batch_op.alter_column('email',
               existing_type=sa.String(length=60),
               type_=sa.VARCHAR(length=100),
               nullable=True)
        batch_op.drop_column('media_id')
        batch_op.drop_column('is_premium')
        batch_op.drop_column('is_active')
        batch_op.drop_column('last_login')
        batch_op.drop_column('role')
        batch_op.drop_column('address')
        batch_op.drop_column('phone')

    op.drop_table('invoice_menu')
    op.drop_table('menu')
    op.drop_table('invoice')
    op.drop_table('category')
    op.drop_table('media')
    # ### end Alembic commands ###
