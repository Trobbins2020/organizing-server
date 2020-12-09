const { v4: uuidv4 } = require("uuid");

const bookmarks = [
  {
    id: uuidv4(),
    title: "Thinkful",
    url: "https://www.thinkful.com",
    description: "Think outside the classroom",
    rating: 5,
  },
  {
    id: uuidv4(),
    title: "Google",
    url: "https://www.google.com",
    description: "Where we find everything else",
    rating: 4,
  },
  {
    id: uuidv4(),
    title: "MDN",
    url: "https://developer.mozilla.org",
    description: "The only place to find web documentation",
    rating: 5,
  },
];

module.exports = { bookmarks };
