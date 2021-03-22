CREATE DATABASE es_hands_on;

\c es_hands_on;

CREATE TABLE IF NOT EXISTS items (
id INTEGER PRIMARY KEY,
name VARCHAR(256) NOT NULL,
category VARCHAR(256) NOT NULL,
price integer NOT NULL,
description TEXT,
created_at TIMESTAMP NOT NULL
);

insert into items values (1, 'マットマグ', 'マグカップ', 1200, 'マットな質感のコップ、耐熱', TIMESTAMP WITH TIME ZONE '2020-12-24T10:12:23+09:00');
insert into items values (2, 'ツヤっとマグ', 'マグカップ', 500, 'つやつやなコップ、レンジ不可', TIMESTAMP WITH TIME ZONE '2021-02-01T15:51:33+09:00');
insert into items values (3, 'ブルゴーニュグラス', 'ワイングラス', 2300, '手に馴染む形状、割れやすいので注意', TIMESTAMP WITH TIME ZONE '2021-03-12T20:04:56+09:00');


CREATE TABLE IF NOT EXISTS orders (
id INTEGER PRIMARY KEY,
status VARCHAR(64) NOT NULL,
created_at TIMESTAMP NOT NULL,
updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
order_id INTEGER NOT NULL,
item_id INTEGER NOT NULL,
item_count INTEGER NOT NULL,
PRIMARY KEY(order_id, item_id),
CONSTRAINT fk_order FOREIGN KEY(order_id) REFERENCES orders(id),
CONSTRAINT fk_item FOREIGN KEY(item_id) REFERENCES items(id)
);

insert into orders values(1, '配達済', '2021-02-03T09:23:01+09:00', '2021-02-05T09:01:20+09:00');
insert into order_items values(1, 1, 2);
insert into order_items values(1, 2, 1);

insert into orders values(2, '受注済', '2021-03-20T18:25:31+09:00', null);
insert into order_items values(2, 2, 4);
insert into order_items values(2, 3, 4);

select o.id as id, o.status as status, coalesce(o.updated_at, o.created_at) as ts, oi.item_count as item_count,
 i.id as item_id, i.name as item_name, i.category as item_category, i.price as item_price, i.description as item_description, i.created_at as item_created_at
 from order_items oi, orders o, items i
where o.id = oi.order_id
and i.id = oi.item_id;

\copy (select o.id as id, o.status as status, coalesce(o.updated_at, o.created_at) as ts, oi.item_count as item_count, i.id as item_id, i.name as item_name, i.category as item_category, i.price as item_price, i.description as item_description, i.created_at as item_created_at from order_items oi, orders o, items i where o.id = oi.order_id and i.id = oi.item_id) to '/var/lib/postgresql/share/order_items.csv' with csv header