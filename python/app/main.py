import os
from typing import Union
from datetime import datetime

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

from elasticsearch import Elasticsearch

app = FastAPI()
es = Elasticsearch(cloud_id=os.getenv("ELASTIC_CLOUD_ID"),
                   basic_auth=[os.getenv("ELASTIC_USERNAME"), os.getenv("ELASTIC_PASSWORD")])

qa_index = "es-hands-on-qa-" + os.getenv("HANDS_ON_KEY")

@app.get("/")
def read_root():
    return {"Hello": "World!!"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


class Question(BaseModel):
    timestamp: datetime
    user: str
    tags: list = []
    title: str
    body: str


@app.post("/qa/questions/")
def add_question(question: Question):
    resp = es.index(index=qa_index, document=jsonable_encoder(question))
    return resp