const generateIdentifier = () => {
  return Math.random().toString(36).substring(2, 8);
};

module.exports = { generateIdentifier };
