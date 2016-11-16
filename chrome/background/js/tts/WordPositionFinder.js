define([], function() {
	/* matching the word itslef would be nicer (than matching delimiters)
	 * however characters of different languages are hard to match (a-z doesnt work in case of e.g. Hungarian letters) */
	const DELIMITER = /[.!?;:,\-–]*[\s\[\]()]/g;

	var wordPositionFinder = {};

	/** @return array of {start,end,word} positions of words. end is the first character not part of the word */
	wordPositionFinder.getPositions = function(rawText) {
		var text = rawText + " ";	//so the end punctuation is matched too

		//end of each DELIMITER is start-of-word, start is end-of-word	
		var result = [];
		result[0] = {};
		var match;
 		while(match = DELIMITER.exec(text)) {
			var delimiterStart = match.index;
			var delimiterEnd = DELIMITER.lastIndex;
			result[result.length-1].end = delimiterStart;
			result[result.length] = {};	//new marker
			result[result.length-1].start = delimiterEnd;
		}
		result[0].start = 0;
		result[result.length-1].end = text.length;

		//remove emty words
		var filteredResult = result.filter(function(o) {
			if(o.start === o.end) return false;
			return true;
		});

		//populate the word field
		filteredResult.forEach(function(o) {o.word = text.substring(o.start,o.end)});

		return filteredResult;
	}

	/** @return the part of @param text that matches the getPositions logic */
	wordPositionFinder.matchingPart = function(text) {
		var position = wordPositionFinder.getPositions(text)[0];
		return position ? position.word : "";
	}

	return wordPositionFinder;
});