const rateLimit = require("express-rate-limit");

function getCustomErrorMessage() {
  const minuteWindow = Number(process.env.TIME_REMAINING) || 300000;
  const minuteRemaining = new Date(minuteWindow);

  return `Terlalu banyak request. Coba kembali dalam ${minuteRemaining.getMinutes()} Menit.`;
}

const limiter = rateLimit({
  windowMs: Number(process.env.TIME_REMAINING) || 300000,
  max: Number(process.env.MAX_ATTEMPT) || 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: getCustomErrorMessage,
});

module.exports = { limiter };