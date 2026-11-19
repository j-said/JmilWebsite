"""SQS calls. boto3 is blocking, so each call (and creating the client) runs in a thread."""

import asyncio
import json
from functools import lru_cache
from typing import Any

import boto3

from app.core.config import settings


@lru_cache
def sqs_client():
    return boto3.client("sqs", region_name=settings.AWS_REGION)


def is_enabled() -> bool:
    return bool(settings.ORDER_QUEUE_URL)


async def send_message(body: dict[str, Any]) -> None:
    await asyncio.to_thread(
        lambda: sqs_client().send_message(
            QueueUrl=settings.ORDER_QUEUE_URL, MessageBody=json.dumps(body)
        )
    )


async def receive_messages(max_messages: int, wait_seconds: int) -> list[dict[str, Any]]:
    resp = await asyncio.to_thread(
        lambda: sqs_client().receive_message(
            QueueUrl=settings.ORDER_QUEUE_URL,
            MaxNumberOfMessages=max_messages,
            WaitTimeSeconds=wait_seconds,
            MessageSystemAttributeNames=["ApproximateReceiveCount"],
        )
    )
    return resp.get("Messages", [])


async def delete_message(receipt_handle: str) -> None:
    await asyncio.to_thread(
        lambda: sqs_client().delete_message(
            QueueUrl=settings.ORDER_QUEUE_URL, ReceiptHandle=receipt_handle
        )
    )
