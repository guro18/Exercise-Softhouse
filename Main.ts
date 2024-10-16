import * as fs from 'fs';
import { XMLConverter } from './XMLConverter';

const args = process.argv;
const ending = '.xml'
const inputFile = args[2];
const outputFile = args[3] + ending;

let data: string;
try {
  data = fs.readFileSync(inputFile, 'utf8');
} 

catch (error) {
  console.error(`Error reading file: ${inputFile}`, error);
  process.exit(1);
}

const converter = new XMLConverter();
const rows = converter.parseRows(data);
const xmlFile = converter.generateXML(rows);

try {
  fs.writeFileSync(outputFile, xmlFile);
  console.log(`Successfully wrote to ${outputFile}`);
} catch (error) {
  console.error(`Error writing to file: ${outputFile}`, error);
  process.exit(1);
}
