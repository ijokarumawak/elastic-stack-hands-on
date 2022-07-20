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
    is_answer: Union[bool, None] = False


class Question(BaseModel):
    timestamp: datetime
    user: str
    tags: list = []
    title: str
    body: str
    comments: list[Comment] = []
    status: str = "open"


class SearchOptions(BaseModel):
    query: Union[str, None] = None
    tags: list = []
    status: Union[str, None] = None
    user: Union[str, None] = None


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
def get_questions(options: Union[SearchOptions, None] = None):
    return search_questions(options)


@app.post("/qa/questions/_search")
def get_questions(options: SearchOptions):
    return search_questions(options)


def search_questions(options: Union[SearchOptions, None] = None):
    must = []
    filter = []
    if options:
        if options.query:
            must.append({"multi_match": {
                "fields": [
                    "title",
                    "body",
                    "user",
                    "comments.comment",
                    "comments.user"
                ],
                "query": options.query
            }})

        if options.user:
            filter.append({"match": {
                "user": options.user
            }})

        if options.status:
            filter.append({"match": {
                "status": options.status
            }})

    resp = es.search(index=qa_index, sort=[{"timestamp": {"order": "desc"}}],
                     query={"bool": {"must": must, "filter": filter}})
    return resp

