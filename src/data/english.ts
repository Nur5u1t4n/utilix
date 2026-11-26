import { categories, tools } from "./tools";

export const englishCategories = categories.map((category, index) => ({
  ...category,
  title: ["Calculators", "Converters", "Text & Data", "Developer Tools"][index],
  description: [
    "Free online calculators for percentages, discounts, markup, profit, and margin.",
    "Convert units of measurement and numbers between numeral systems.",
    "Online tools for CSV, JSON, text comparison, duplicate removal, and text statistics.",
    "Useful developer tools for Base64 and URL encoding, UUIDs, and password generation.",
  ][index],
}));

const translations = [
  ["Percentage Calculator", "Calculate a percentage of any number, including discounts and shares of a total.", "Quickly find a percentage of a number for discounts, proportions, and everyday calculations.", "For example, 15% of 2,000 is 300.", ["Enter a number.", "Enter a percentage.", "Select Calculate."]],
  ["Discount Calculator", "Calculate the discount amount, savings, and final price after a reduction.", "Find out how much you save and what you will pay after a discount.", "A 15% discount on 10,000 saves 1,500, leaving a price of 8,500.", ["Enter the original price.", "Enter the discount percentage.", "See your savings and final price."]],
  ["Markup and Margin Calculator", "Calculate profit, markup percentage, and gross margin from cost and sale price.", "Calculate profit and compare markup on cost with margin on the sale price.", "A cost of 700 and sale price of 1,000 gives 300 profit, 42.86% markup, and 30% margin.", ["Enter the cost.", "Enter the sale price.", "See profit, markup, and margin."]],
  ["Unit Converter", "Convert units of length, mass, volume, and area.", "Convert values between common metric, imperial, and US customary units.", "For example, 1 kilometre equals 1,000 metres.", ["Choose a measurement type.", "Choose the source and target units.", "Enter a value to convert."]],
  ["Temperature Converter", "Convert temperatures between Celsius, Fahrenheit, and Kelvin.", "Convert values between three common temperature scales.", "For example, 0°C equals 32°F and 273.15 K.", ["Enter a temperature.", "Choose the source scale.", "Choose the target scale."]],
  ["Number Base Converter", "Convert integers between bases 2 and 36, including binary, decimal, and hexadecimal.", "Convert integers between numeral systems for study and development.", "Decimal 255 is binary 11111111 and hexadecimal FF.", ["Enter an integer.", "Choose its current base.", "Choose the base to convert to."]],
  ["JSON Formatter", "Format, minify, and validate JSON data in your browser.", "Check JSON syntax, format it for readability, or minify it.", "Format {\"name\":\"Utilix\"} as readable, indented JSON.", ["Paste JSON into the input.", "Choose format or minify.", "Review and copy the result."]],
  ["CSV Viewer", "View CSV data as a table. Choose a delimiter and parse quoted values.", "Turn CSV text into a readable table, including quoted values and embedded line breaks.", "Paste CSV rows and select the delimiter used in the text.", ["Paste CSV text.", "Choose the delimiter.", "Review the table."]],
  ["Remove Duplicate Lines", "Remove repeated lines while preserving their original order.", "Clean up text by keeping the first occurrence of each line.", "In Apple, Pear, Apple, the second Apple is removed.", ["Paste your lines.", "Select Remove duplicates.", "Copy the cleaned text."]],
  ["Text Diff", "Compare two texts line by line and find added, removed, and unchanged lines.", "See how two versions of a text differ.", "Compare two versions of a list to find changed lines.", ["Paste the original text.", "Paste the updated text.", "Select Compare."]],
  ["Base64 Encoder and Decoder", "Encode text as Base64 and decode it back, including Unicode and UTF-8.", "Convert text to and from Base64. Base64 is an encoding format, not encryption.", "Encode a message and decode it back to the original text.", ["Choose encode or decode.", "Enter text or a Base64 string.", "Copy the result."]],
  ["UUID Generator", "Generate 1 to 100 unique version 4 UUIDs.", "Create version 4 UUIDs using your browser’s cryptographic API.", "UUIDs can identify records, objects, and test data.", ["Choose how many UUIDs to generate.", "Select Generate.", "Copy the UUIDs."]],
  ["Password Generator", "Generate random passwords from 8 to 128 characters with configurable character sets.", "Create random passwords using your browser’s cryptographic random number generator.", "Choose a 20-character password and the character sets to include.", ["Choose a length from 8 to 128.", "Select the character sets.", "Generate and copy your password."]],
  ["URL Encoder and Decoder", "Encode or decode URL components and special characters.", "Convert URL text to percent encoding and back.", "Encode ‘hello world’ for use as a URL component.", ["Choose encode or decode.", "Enter text or an encoded string.", "Copy the result."]],
  ["Character and Word Counter", "Count characters, words, lines, and characters without spaces.", "Analyze text length with statistics that update as you type.", "The text ‘Hello, world!’ contains 13 characters and 2 words.", ["Type or paste text.", "View the character, word, and line counts.", "Edit the text to update the statistics."]],
];

export const englishTools = tools.map((tool, index) => {
  const [title, description, intro, example, howTo] = translations[index] as [string, string, string, string, string[]];
  return { ...tool, title, description, intro, example, howTo, categoryTitle: englishCategories.find((item) => item.slug === tool.category)?.title ?? tool.category };
});
