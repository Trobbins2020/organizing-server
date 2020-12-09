const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { isWebUri } = require("valid-url");
const logger = require("./logger");
const store = require("./store");

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route("/bookmarks")
  .get((req, res) => {
    res.json(store.bookmarks);
  })
  .post(bodyParser, (req, res) => {
    // for checking fileds

    for (const field of ["title", "url", "rating"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }
    const { title, url, description, rating } = req.body;

    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`);
      return res.status(400).send(`Must Provide a valid URL`);
    }

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`);
      return res.status(400).send(`Rating must be a number between 0 to 5`);
    }
    const bookmark = { id: uuidv4(), title, url, description, rating };
    store.bookmarks.push(bookmark);
    logger.info(`Bookmark with id ${bookmark.id} created`);
    res
      .status(201)
      .location(`http://localhost:8080/bookmarks/${bookmark.id}`)
      .json(bookmark);
  });

bookmarksRouter
  .route("/bookmarks/:bookmark_id")
  .get((req, res) => {
    const { bookmark_id } = req.params;

    const bookmark = store.bookmarks.find((c) => c.id == bookmark_id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res.status(404).send("Not Found");
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { bookmark_id } = req.params;

    const index = store.bookmarks.findIndex((b) => b.id === bookmark_id);

    if (index === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res.status(404).send("Not Found");
    }

    store.bookmarks.splice(index, 1);

    logger.info(`Bookmark with id ${bookmark_id} deleted.`);
    res.status(204).end();
  });

module.exports = bookmarksRouter;
