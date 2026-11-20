"""real product photos instead of placeholders

Existing databases were seeded with placehold.co URLs, and the seed script never
touches tables that already have rows, so the new image paths have to be written
here. On a fresh database this updates nothing and the seed inserts the same
paths from seed_data.json.

Revision ID: c3d4e5f6a7b8
Revises: b7c1d2e3f4a5
Create Date: 2026-11-20 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY


revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = 'b7c1d2e3f4a5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Files live in client/public/products and are served by the frontend (S3 + CloudFront).
IMAGES: dict[str, tuple[str, list[str]]] = {
    'DJI Mavic 3 Pro': ('/products/dji-mavic-3-pro-1.webp', ['/products/dji-mavic-3-pro-2.webp', '/products/dji-mavic-3-pro-3.webp']),
    'Autel Robotics Evo Lite+': ('/products/autel-evo-lite-plus-1.webp', []),
    'DJI Inspire 3': ('/products/dji-inspire-3-1.webp', ['/products/dji-inspire-3-2.webp']),
    'iFlight Nazgul Evoque F5': ('/products/iflight-nazgul-evoque-f5-1.webp', []),
    'BetaFPV Cetus Pro Kit': ('/products/betafpv-cetus-pro-kit-1.webp', ['/products/betafpv-cetus-pro-kit-2.webp']),
    'GEPRC Mark5 HD': ('/products/geprc-mark5-hd-1.webp', []),
    'DJI Mini 4 Pro': ('/products/dji-mini-4-pro-1.webp', ['/products/dji-mini-4-pro-2.webp', '/products/dji-mini-4-pro-3.webp']),
    'Autel Robotics Evo Nano+': ('/products/autel-evo-nano-plus-1.webp', []),
    'Holy Stone HS720G': ('/products/holy-stone-hs720g-1.webp', []),
    'DJI Tello': ('/products/dji-tello-1.webp', ['/products/dji-tello-2.webp']),
    'Ryze Tech Tello Boost Combo': ('/products/ryze-tello-boost-combo-1.webp', ['/products/ryze-tello-boost-combo-2.webp']),
    'Holy Stone HS175': ('/products/holy-stone-hs175-1.webp', []),
    'DJI Smart Controller': ('/products/dji-smart-controller-1.webp', []),
    'FPV Goggles V2': ('/products/dji-fpv-goggles-v2-1.webp', ['/products/dji-fpv-goggles-v2-2.webp']),
    'Professional Drone Backpack': ('/products/drone-backpack-1.webp', []),
    'DJI Mavic 3 Pro Battery': ('/products/dji-mavic-3-pro-battery-1.webp', []),
    'Propeller Set (4 Pairs)': ('/products/propeller-set-1.webp', []),
    'FPV Drone Frame Kit': ('/products/fpv-frame-kit-1.webp', []),
    'Multi-Battery Charging Hub': ('/products/charging-hub-1.webp', []),
    'Car Charger Adapter': ('/products/car-charger-1.webp', []),
    'Battery Maintenance Kit': ('/products/battery-maintenance-kit-1.webp', ['/products/battery-maintenance-kit-2.webp']),
    'ND Filter Set': ('/products/nd-filter-set-1.webp', []),
    'Camera Gimbal Protector': ('/products/gimbal-protector-1.webp', []),
    'PolarPro Cinema Series': ('/products/polarpro-cinema-series-1.webp', []),
}

products = sa.table(
    'products',
    sa.column('name', sa.String),
    sa.column('image_url', sa.Text),
    sa.column('images', ARRAY(sa.Text)),
)


def upgrade() -> None:
    for name, (image_url, images) in IMAGES.items():
        op.execute(
            products.update()
            .where(products.c.name == name)
            .values(image_url=image_url, images=images)
        )


def downgrade() -> None:
    # Data-only change: the old placeholder URLs are not worth restoring.
    pass
