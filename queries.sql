select c.id, c.name from categories c;

select c.id, c.name
  from categories c
 where (select count(*)
          from offers_categories oc
          where oc.category_id = c.id) != 0;

select c.id,
       c.name,
       (select count(1)
        from offers_categories oc
        where oc.category_id = c.id) count_articles
from categories c;

select o.id,
       o.title,
       o.sum,
       (select ot.name
          from offers_types ot
         where ot.id = o.type) type_name,
       o.description,
       o.create_date,
       u.name,
       u.surname,
       u.email,
       (select count(1)
          from comments c
         where c.offer_id = o.id) count_comments,
       (select string_agg(c2.name, ',')
          from offers_categories oc
               join categories c2 on oc.category_id = c2.id
         where oc.offer_id = o.id) count_categories
  from offers o
       join users u on u.id = o.user_id
 order by o.create_date;

select o.id,
       o.title,
       o.sum,
       (select ot.name
          from offers_types ot
         where ot.id = o.type) type_name,
       o.description,
       o.create_date,
       u.name,
       u.surname,
       u.email,
       (select count(1)
          from comments c
         where c.offer_id = o.id) count_comments,
       (select string_agg(c2.name, ',')
          from offers_categories oc
               join categories c2 on oc.category_id = c2.id
         where oc.offer_id = o.id) count_categories
  from offers o
       join users u on u.id = o.user_id
 where o.id = :offer_id;

select c.id,
       c.offer_id,
       u.name,
       u.surname,
       c.text
  from comments c
       join users u on c.user_id = u.id
order by c.created
limit 5;

select c.id,
       c.offer_id,
       u.name,
       u.surname,
       c.text
  from comments c
       join users u on c.user_id = u.id
 where c.offer_id = :offer_id
order by c.created;

select *
  from offers o
 where o.type = 1
limit 2;

update offers
set title = 'Уникальное предложние!'
where id = :offer_id
