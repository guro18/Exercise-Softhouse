import * as fs from 'fs';

const args = process.argv;
const inputFile = args[2];
const data = fs.readFileSync(inputFile, 'utf8');
console.log(data);

class XMLConverter {
    private delimiter: string;
  
    constructor(delimiter: string = '|') {
      this.delimiter = delimiter;
    }
  
    //Function to parse row-based file content
    parseRows(fileContent: string): string[][] {
      return fileContent
        .split('\n')
        .filter(row => row.trim() !== '')
        .map(row => row.split(this.delimiter).map(field => field.trim()));
    }
  }
  
  const converter = new XMLConverter();
  const rows = converter.parseRows(data);
  console.log(rows);
