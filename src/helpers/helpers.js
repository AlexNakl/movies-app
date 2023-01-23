function shortenText(str, maxLen = 125, separator = ' ') {
  if (str.length <= maxLen) return str;
  return `${str.substr(0, str.lastIndexOf(separator, maxLen))} ...`;
}

export default shortenText;
