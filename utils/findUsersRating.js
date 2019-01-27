module.exports = function findUsersRating(politician, userId) {
  let found = false;
  if (politician.characteristics) {
    for (var index = 0; index < politician.characteristics.length; index++) {
      if (politician.characteristics[index].userId == userId) {
        // Found it
        found = true;
        break;
      }
    }
  }
  if (found) {
    return index;
  } else {
    return -1;
  }
};
