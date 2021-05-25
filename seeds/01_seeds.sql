INSERT INTO users (id, name, email, password)
VALUES (1, 'Drake', 'drake@drakemail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  (2, 'Kylian Mbappe', 'soccerislife@fastmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  (3, 'Miley Riley', 'puppes@rainbow.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (id, owner_id, title, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (01, 001, 'Beach-front Villa', 'photo of house', 'photo of house', 500, 4, 6, 8, 'Trinidad & Tobago', '7 Doubles Avenue', 'Port of Spain', 'abc', TRUE),
  (02, 002, 'Downtown Condo', 'photo of condo', 'photo of condo', 300, 2, 2, 2, 'Japan', '180 Kaneki Street', 'Tokyo', 'def', TRUE),
  (03, 003, 'Swiss Cottage', 'photo of house', 'photo of house', 100, 4, 3, 5, 'Switzerland', '123 Vacay Street', 'Bern', 'hij', TRUE);

INSERT INTO reservations (id, start_date, end_date, property_id, guest_id)
VALUES (1, '2021-05-26', '2021-06-26', 01, 1),
  (2, '2020-05-26', '2020-10-26', 02, 2),
  (3, '2021-03-17', '2021-03-27', 03, 3);

INSERT INTO property_reviews (id, guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 01, 1, 8, 'very relaxing'),
  (2, 2, 02, 2, 9, 'fantastique'),
  (3, 3, 03, 3, 5, 'kinda cold, heater not working but nice views');
