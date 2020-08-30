
/* список пользователей */
insert into users(id,email,password,name,surname) values
('1','nov@mail.ru','god','Амфибрахий','Новиков'),('2','pet@ya.ru','evil','Владилен','Феликс');
 
/* справочник категорий */
insert into categories(id,name) values
('1','Журналы'),('2','Книги'),('3','Бытовая техника'),('4','Косметика'),('5','Одежда'),('6','Разное'),('7','Животные'),('8','Электроника'),('9','Игры'),('10','Посуда');
 
/* справочник типов объявлений */
insert into offers_types(id,name) values
('1','offer'),('2','sale');
 
/* справочник картинок */
insert into pictures(id,background,image,image2x) values
('1','07','item07.jpg','item07@2x.jpg'),('2','12','item12.jpg','item12@2x.jpg'),('3','07','item07.jpg','item07@2x.jpg'),('4','07','item07.jpg','item07@2x.jpg'),('5','08','item08.jpg','item08@2x.jpg');
 
/* список объявлений */
insert into offers(id,description,picture_id,title,type,user_id,create_date,updated,sum) values
('1','Даю недельную гарантию. Пользовались бережно и только по большим праздникам. Товар в отличном состоянии. Если товар не понравится — верну всё до последней копейки.','1','Продам новую приставку Sony Playstation 5','2','1','2020-06-14 07:44:05','2020-06-14 07:44:05','86090'),('2','Это настоящая находка для коллекционера! Бонусом отдам все аксессуары. При покупке с меня бесплатная доставка в черте города. Пользовались бережно и только по большим праздникам.','2','Продам нервную систему в отличном состоянии. Заводится с полоборота.','2','2','2020-07-01 14:03:29','2020-07-01 14:03:29','21863'),('3','Продаю с болью в сердце... Если найдёте дешевле — сброшу цену. Пользовались бережно и только по большим праздникам. Последний экземпляр.','3','Продам птичьи надои будущего года','1','1','2020-06-22 22:05:31','2020-06-22 22:05:31','23018'),('4','Это настоящая находка для коллекционера! Даю недельную гарантию. Товар в отличном состоянии. Оптом дешевле - отдаю сразу по 5!','4','Продам отличную подборку фильмов на VHS','2','1','2020-07-01 16:14:46','2020-07-01 16:14:46','26362'),('5','Таких предложений больше нет! Если найдёте дешевле — сброшу цену. Последний экземпляр. Продаю с болью в сердце...','5','Куплю породистого кота','2','1','2020-07-12 05:24:28','2020-07-12 05:24:28','66768');
 
/* категории объявлений */
insert into offers_categories(id,offer_id,category_id) values
('1','1','1'),('2','1','2'),('3','1','3'),('4','1','4'),('5','1','5'),('6','1','6'),('7','1','7'),('8','1','8'),('9','2','1'),('10','2','2'),('11','3','1'),('12','3','2'),('13','4','1'),('14','4','2'),('15','4','3'),('16','4','4'),('17','5','1'),('18','5','2'),('19','5','3'),('20','5','4'),('21','5','5'),('22','5','6'),('23','5','7'),('24','5','8');
 
/* справочник категорий */
insert into comments(id,offer_id,text,user_id,created) values
('1','1','С чем связана продажа? Почему так дешёво? А где блок питания? Почему в таком ужасном состоянии?','1','2020-05-22 11:44:24'),('2','1','А сколько игр в комплекте? Оплата наличными или перевод на карту? С чем связана продажа? Почему так дешёво?','1','2020-05-01 11:41:22'),('3','1','Совсем немного... Продаю в связи с переездом. Отрываю от сердца.','1','2020-06-09 08:11:20'),('4','2','Оплата наличными или перевод на карту?','1','2020-05-03 21:57:36'),('5','3','Совсем немного...','2','2020-05-17 16:12:45'),('6','3','А где блок питания?','2','2020-05-15 03:12:40'),('7','4','Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту? А сколько игр в комплекте?','2','2020-04-13 18:34:15'),('8','5','Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво? Неплохо, но дорого.','2','2020-06-05 04:52:16'),('9','5','Неплохо, но дорого. А где блок питания?','2','2020-06-14 19:34:03'),('10','5','Вы что?! В магазине дешевле.','1','2020-06-16 20:54:08');
 
    