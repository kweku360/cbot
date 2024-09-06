function formatDate(date, options = {}) {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
    locale: "en-US",
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const formattedDate = date.toLocaleDateString(
    mergedOptions.locale,
    mergedOptions
  );

  return formattedDate;
}

function getCurrentDate(compact = false) {
  const date = new Date();
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  if (compact) {
    const dateString = `${day} ${month} ${year}`;
    return dateString.replace(/\s/g, "");
  } else {
    return `${day} ${month} ${year}`;
  }
}

// Get the current timestamp
function getCurrentTimestamp() {
  return Date.now();
}

// Convert timestamp to a readable date format
function timestampToReadable(timestamp) {
  const date = new Date(timestamp);
  return date.toISOString(); // ISO 8601 format
}

// Convert readable date format to timestamp
function readableToTimestamp(dateString) {
  const date = new Date(dateString);
  return date.getTime();
}

module.exports = { formatDate,getCurrentDate,getCurrentTimestamp, 
  timestampToReadable, readableToTimestamp };
