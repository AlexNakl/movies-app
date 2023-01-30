function shortenText(str, titleLength, genresLength) {
  const separator = ' ';
  let maxLen = 150;
  let titleN = titleLength;
  let genresN = genresLength;

  while (titleN >= 20 || genresN >= 4) {
    if (titleN >= 20) {
      maxLen -= 40;
      titleN -= 20;
    }
    if (genresN >= 4) {
      maxLen -= 40;
      genresN -= 4;
    }
  }

  if (str.length <= maxLen) return str;
  return `${str.substr(0, str.lastIndexOf(separator, maxLen))} ...`;
}

function getClassNameForAverage(average) {
  let classNameAverage = 'movie-average';

  if (average >= 0 && average <= 3) {
    classNameAverage += ' movie-average__border-rad';
  } else if (average > 3 && average <= 5) {
    classNameAverage += ' movie-average__border-orange';
  } else if (average > 5 && average <= 7) {
    classNameAverage += ' movie-average__border-yellow';
  } else if (average > 7) {
    classNameAverage += ' movie-average__border-green';
  }

  return classNameAverage;
}

export { shortenText, getClassNameForAverage };
