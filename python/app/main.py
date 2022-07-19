import os
from typing import List, Union
from datetime import datetime

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

from elasticsearch import Elasticsearch

app = FastAPI()
es = Elasticsearch(cloud_id=os.getenv("ELASTIC_CLOUD_ID"),
                   basic_auth=[os.getenv("ELASTIC_USERNAME"), os.getenv("ELASTIC_PASSWORD")])

qa_index = "es-hands-on-qa"

@app.get("/")
def read_root():
    return {"Hello": "World!!"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


class Comment(BaseModel):
    timestamp: datetime
    user: str
    comment: str


class Question(BaseModel):
    timestamp: datetime
    user: str
    tags: list = []
    title: str
    body: str
    comments: list[Comment] = []


@app.post("/qa/questions")
def add_question(question: Question):
    resp = es.index(index=qa_index, refresh="wait_for", document=jsonable_encoder(question))
    return resp


@app.put("/qa/questions/{id}")
def add_question(id, question: Question):
    resp = es.index(index=qa_index, id=id, refresh="wait_for", document=jsonable_encoder(question))
    return resp


@app.get("/qa/questions/{id}")
def get_question(id):
    resp = es.get(index=qa_index, id=id)
    return resp


@app.get("/qa/questions")
def search_questions():
    resp = es.search(index=qa_index, sort=[{"timestamp": {"order": "desc"}}])
    return resp

