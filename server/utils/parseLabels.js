module.exports = function (markdown) {
	var output;

	// Wrap sequences of moves with sequence tags and moves with move tags
	// @see http://www.regexr.com/3a8ft
	output = markdown.replace(
		/([wW]hite[\s]?|[bB]lack[\s]?|[wWbB][\s]?)?([a-hj-tA-HJ-T][0-1]?[0-9]\b[,; ]{0,2}){2,}|(\b[a-hj-tA-HJ-T][0-1]?[0-9]\b)/g,
		function (match, color, insideMove, offset, string) {
			var str = match;
			var space = '';
			var firstMove = '';

			// Sequences have moves inside them; moves do not
			var type = (insideMove) ? 'sequence' : 'move';

			// Remove any trailing spaces from the series
			// I detest having a trailing space inside the tag rather than outside it
			// If I can write the regex to avoid this step, please let me know
			if (str.substring(str.length - 1) === ' ') {
				str = str.substring(0, str.length - 1);
				space = ' ';
			}

			// If the first move has been specified, set it as the first-move attribute
			if (color) {
				str = str.substring(color.length);
				firstMove = (color.substring(0, 1).toUpperCase() === 'W') ? 'W' : 'B';
				firstMove = ' first-move="' + firstMove + '"';
			} else {
				color = '';
			}

			// Normalize the format of the sequence for easy parsing on the client side
			var sequence = '';
			if (type === 'sequence') {
				sequence= ' sequence="' + str.replace(/[,; ]+/g, '-').toUpperCase() + '"';
			}

			return '<sgf-label' + firstMove + sequence + '>' + color + str + '</sgf-label>' + space;
		}
	);

	return output;
};
