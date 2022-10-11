var express = require('express');
var router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/db.sqlite');


router.get('/', function (req, res, next) {

	const result = {}

	db.all('PRAGMA table_info(test_items)', (err, rows) => {
		if (err) {
			throw err;
		}

		result['head'] = rows
			.filter((row) => {
				if ( row.name !== 'id' ) {
					return row.name
				}
			})
			.map((row) => {
				return {
					name: row.name,
					type: row.type.match(/\w+/)[0],
				}
			})

		db.all("SELECT date, title, quantity, distance FROM test_items WHERE 1", (err, rows) => {
			if (err) {
				throw err;
			}
	
			result['body'] = rows

			res.json(result);
	
		});

	})


});

module.exports = router;
