"""orders.request_id for queue-created orders

Revision ID: b7c1d2e3f4a5
Revises: 66aef0f67d06
Create Date: 2026-11-19 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'b7c1d2e3f4a5'
down_revision: Union[str, Sequence[str], None] = '66aef0f67d06'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('orders', sa.Column('request_id', sa.String(length=64), nullable=True))
    op.create_unique_constraint(op.f('uq_orders_request_id'), 'orders', ['request_id'])


def downgrade() -> None:
    op.drop_constraint(op.f('uq_orders_request_id'), 'orders', type_='unique')
    op.drop_column('orders', 'request_id')
