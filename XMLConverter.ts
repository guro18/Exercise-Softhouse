import * as fs from 'fs';

const args = process.argv;
const inputFile = args[2];
const outputFile = args[3];
const data = fs.readFileSync(inputFile, 'utf8');

const tagsDict: { [key: string]: string[] } = {
    P: ['person', 'firstname', 'lastname'],
    T: ['phone', 'mobile', 'landlinenumber'],
    A: ['address', 'street', 'city', 'postalcode'],
    F: ['family', 'name', 'born']
  };

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

    generateXML(rows: string[][]): string {
        let xml = '<people>\n';

        rows.forEach(row => {
            const recordType = row[0];
            const tags = tagsDict[recordType];

            if (tags) {
                xml += `  <${tags[0]}>\n`;
                for (let i = 1; i < tags.length; i++) {
                    xml += `    <${tags[i]}>${row[i]}</${tags[i]}>\n`;
                }
                xml += `  </${tags[0]}>\n`;
            }
        });
        xml += '</people>';
        return xml;
    }
  };
  
  const converter = new XMLConverter();
  console.log(data);
  const rows = converter.parseRows(data);
  console.log(rows);
  console.log(tagsDict);
  const xmlFile = converter.generateXML(rows);
  console.log(xmlFile);
  fs.writeFileSync(outputFile, xmlFile);
