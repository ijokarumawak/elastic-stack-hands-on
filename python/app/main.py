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
    return {"message": "Not implemented yet."}


@app.put("/qa/questions/{id}")
def put_question(id, question: Question):
    return {"message": "Not implemented yet."}


@app.post("/qa/questions/_search")
def get_questions(options: SearchOptions):
    return {"message": "Not implemented yet."}


