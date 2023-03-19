const setCache = (req, res, next) => {
  const maxAge = 60 * 5;
  if (req.method === 'GET') {
    res.set('Cache-Control', `public, max-age=${maxAge}`);
  } else {
    res.set('Cache-Control', 'no-store');
  }
  return next();
};

module.exports = setCache;
