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
        let isPersonClosed = true;
        let isFamilyClosed = true;

        rows.forEach(row => {
            const recordType = row[0];
            const tags = tagsDict[recordType];

            if (recordType === 'P') {
              if (!isPersonClosed) {
                  xml += `\t</person>\n`;
              }

              xml += `\t<${tags[0]}>\n`;
              xml += `\t\t<${tags[1]}>${row[1]}</${tags[1]}>\n`;
              xml += `\t\t<${tags[2]}>${row[2]}</${tags[2]}>\n`;

              isPersonClosed = false;
              isFamilyClosed = true;
            }

            else if (recordType === 'F') {
              if (!isFamilyClosed) {
                xml += `\t\t</family>\n`;
              }

              xml += `\t\t<${tags[0]}>\n`;
              xml += `\t\t\t<${tags[1]}>${row[1]}</${tags[1]}>\n`;
              xml += `\t\t\t<${tags[2]}>${row[2]}</${tags[2]}>\n`;
              isFamilyClosed = false;
            }

            else if (recordType === 'A') {
              if (isFamilyClosed) {
                xml += `\t\t<address>\n`;
              }

              xml += `\t\t\t<${tags[1]}>${row[1]}</${tags[1]}>\n`;
              xml += `\t\t\t<${tags[2]}>${row[2]}</${tags[2]}>\n`;
              xml += `\t\t\t<${tags[3]}>${row[3]}</${tags[3]}>\n`;
              if (isFamilyClosed) {
                xml += `\t\t</address>\n`;
              }
            }

            else if (recordType === 'T') {
              if (isFamilyClosed) {
                xml += `\t\t<phone>\n`;
              }

              xml += `\t\t\t<${tags[1]}>${row[1]}</${tags[1]}>\n`;
              xml += `\t\t\t<${tags[2]}>${row[2]}</${tags[2]}>\n`;
              if (isFamilyClosed) {
                xml += `\t\t</phone>\n`;
              }
            }
        });

        if (!isFamilyClosed) {
          xml += `\t\t</family>\n`;
        }

        if (!isPersonClosed) {
          xml += `\t</person>\n`;
        }

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
