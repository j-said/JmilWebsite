from datetime import datetime

from app.schemas.common import CamelModel


class NewsPostRead(CamelModel):
    id: int
    title: str
    content: str
    image_url: str | None
    created_at: datetime
