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
      
          // Handle 'P' - Person
          if (recordType === 'P') {
              if (!isPersonClosed) {
                  if (!isFamilyClosed) {
                      xml += `\t\t</family>\n`;  // Close open family before closing person
                      isFamilyClosed = true;
                  }
                  xml += `\t</person>\n`;  // Close open person
              }
      
              // Start new person
              xml += `\t<${tags[0]}>\n`; //person
              xml += `\t\t<${tags[1]}>${row[1]}</${tags[1]}>\n`; //firstname
              xml += `\t\t<${tags[2]}>${row[2]}</${tags[2]}>\n`; //lastname
      
              isPersonClosed = false; //dont close person
              isFamilyClosed = true; //keep family closed
          }
      
          // Handle 'F' - Family
          else if (recordType === 'F') {
              if (!isFamilyClosed) {
                  xml += `\t\t</family>\n`;  // Close the previous family if it exists
              }
      
              // Start new family
              xml += `\t\t<${tags[0]}>\n`;
              xml += `\t\t\t<${tags[1]}>${row[1]}</${tags[1]}>\n`;
              xml += `\t\t\t<${tags[2]}>${row[2]}</${tags[2]}>\n`;
      
              isFamilyClosed = false;
          }
      
          // Handle 'A' - Address
          else if (recordType === 'A') {
            if (isFamilyClosed) {
              xml += `\t\t<address>\n`;
              xml += `\t\t\t<${tags[1]}>${row[1]}</${tags[1]}>\n`;
              xml += `\t\t\t<${tags[2]}>${row[2]}</${tags[2]}>\n`;
              if (row[3]) xml += `\t\t\t<${tags[3]}>${row[3]}</${tags[3]}>\n`;  // Handle missing postalcode
              xml += `\t\t</address>\n`;
            }
            else {
              xml += `\t\t\t<address>\n`;
              xml += `\t\t\t\t<${tags[1]}>${row[1]}</${tags[1]}>\n`;
              xml += `\t\t\t\t<${tags[2]}>${row[2]}</${tags[2]}>\n`;
              if (row[3]) xml += `\t\t\t\t<${tags[3]}>${row[3]}</${tags[3]}>\n`;  // Handle missing postalcode
              xml += `\t\t\t</address>\n`;
            }
          }
      
          // Handle 'T' - Phone
          else if (recordType === 'T') {
            if (isFamilyClosed) {
              xml += `\t\t<phone>\n`;
              xml += `\t\t\t<${tags[1]}>${row[1]}</${tags[1]}>\n`;
              xml += `\t\t\t<${tags[2]}>${row[2]}</${tags[2]}>\n`;
              xml += `\t\t</phone>\n`;
            }
            else {
              xml += `\t\t\t<phone>\n`;
              xml += `\t\t\t\t<${tags[1]}>${row[1]}</${tags[1]}>\n`;
              xml += `\t\t\t\t<${tags[2]}>${row[2]}</${tags[2]}>\n`;
              xml += `\t\t\t</phone>\n`;
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
