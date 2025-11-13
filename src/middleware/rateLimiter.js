const rateLimit = require("express-rate-limit");

function getCustomErrorMessage() {
  const minuteWindow = Number(process.env.TIME_REMAINING);
  const minuteRemaining = new Date(minuteWindow);

  return `Terlalu banyak request. Coba kembali dalam ${minuteRemaining.getMinutes()} Menit.`;
}

const limiter = rateLimit({
  windowMs: Number(process.env.TIME_REMAINING),
  max: Number(process.env.MAX_ATTEMPT),
  standardHeaders: true,
  legacyHeaders: false,
  message: getCustomErrorMessage,
});

module.exports = { limiter };