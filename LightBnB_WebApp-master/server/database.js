const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

/// Users

const pool = new Pool({
  user: "vagrant",
  password: "password",
  host: "localhost",
  database: "lightbnb",
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

//Accepts an email address and will return a promise
const getUserWithEmail = function (email) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE users.email = $1`,
      [email]
    )
    .then((res) => {
      if (res.rows) {
        return res.rows[0];
      }
      return null;
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE users.id = $1`,
      [id]
    )
    .then((res) => {
      if (res.rows) {
        return res.rows[0];
      }
      return null;
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `
  const userInfo = [user.name, user.email, user.password];
  return pool.query(query, userInfo)
  .then(res => res.rows[0]);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query(`
    SELECT properties.*, reservations.*, AVG(property_reviews.rating) as average_rating
    FROM reservations
    JOIN property_reviews ON properties.id = property_reviews.property_id
    JOIN properties ON reservations.property_id = properties.id
    WHERE end_date < now()
    AND reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY reservations.start_date DESC
    LIMIT $2;
  `, [guest_id, limit])
  .then(res => res.rows)
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

//new implementation of function
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
    SELECT * 
    FROM properties 
    LIMIT $1
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if(options.owner_id) {
    queryParams.push(options.owner_id)
    if (queryParams[1]) {
      queryString += `AND users.id = $${queryParams.length}`;
    } else {
      queryString += `WHERE users.id = $${queryParams.length}`;
    }
  }
  
  if (options.minumum_price_per_night){
    queryParams.push(options.minimum_price_per_night);
    if (queryParams[1]) {
      queryString += `AND cost_per_night > $${queryParams.length}`
    } else {
      queryString += `WHERE cost_per_night > $${queryParams.length}`
    }
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    if (queryParams[1]) {
      queryString += `AND cost_per_night > $${queryParams.length}`
    } else {
      queryString += `WHERE cost_per_night > $${queryParams.length}`
    }
  }

  queryString += `GROUP BY properties`;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then((result) => {
      console.log(result.rows);
    })
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  let queryString = `
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, parking_spaces, number_of_bathrooms, number_of_bedrooms, cost_per_night, country, street, city, province, post_code) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `
  const queryParams = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.cost_per_night, property.country, property.street, property.city, property.province, property.post_code]

  return pool.query(queryString, queryParams)
    .then((res) => {
      return res.rows[0];
    })
};

exports.addProperty = addProperty;
