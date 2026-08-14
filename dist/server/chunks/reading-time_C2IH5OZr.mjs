//#region src/utils/reading-time.ts
var WORDS_PER_MINUTE = 200;
var CJK_CHARACTERS_PER_MINUTE = 500;
var WHITESPACE_REGEX = /\s+/;
var CJK_CHARACTER_REGEX = /\p{Script=Han}|\p{Script=Hangul}|\p{Script=Hiragana}|\p{Script=Katakana}/gu;
function isTextBlock(block) {
	return block._type === "block" && Array.isArray(block.children);
}
function countWords(text) {
	return text.split(WHITESPACE_REGEX).filter(Boolean).length;
}
function countCjkCharacters(text) {
	return text.match(CJK_CHARACTER_REGEX)?.length ?? 0;
}
/**
* Extract plain text from Portable Text blocks
*/
function extractText(blocks) {
	if (!blocks || !Array.isArray(blocks)) return "";
	return blocks.filter(isTextBlock).map((block) => block.children.filter((child) => child._type === "span" && typeof child.text === "string").map((span) => span.text).join("")).join(" ");
}
/**
* Calculate reading time in minutes from Portable Text content
*/
function getReadingTime(content) {
	const text = extractText(content);
	const cjkCharacterCount = countCjkCharacters(text);
	const wordCount = countWords(text.replace(CJK_CHARACTER_REGEX, " "));
	const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE + cjkCharacterCount / CJK_CHARACTERS_PER_MINUTE);
	return Math.max(1, minutes);
}
//#endregion
export { getReadingTime as t };
