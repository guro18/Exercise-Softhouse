import { tagsDict } from './tags-dict';

//class to convert the input file to xml file
export class XMLConverter {

    //function to parse row-based file content
    parseRows(fileContent: string): string[][] {
      return fileContent
        .split('\n')
        .filter(row => row.trim() !== '')
        .map(row => row.split('|').map(field => field.trim()));
    }

    //function to generate tags, if value exists
    generateTag(tag: string, content: string, indentLevel: number = 2): string {
      if (!content) {
        return '';
      }
      const indent = '\t'.repeat(indentLevel);
      return `${indent}<${tag}>${content}</${tag}>\n`
    }

    //function to generate XML from output of parseRows
    generateXML(rows: string[][]): string {
        let xml = '<people>\n';
        let isPersonClosed = true;
        let isFamilyClosed = true;

        rows.forEach(row => {
          const recordType = row[0];
          const tags = tagsDict[recordType];
      
          //case 1: 'P' = person
          if (recordType === 'P') {

              if (!isPersonClosed) {
                  if (!isFamilyClosed) {
                      xml += `\t\t</family>\n`;
                      isFamilyClosed = true;
                  }
                  xml += `\t</${tags[0]}>\n`;
              }

              xml += `\t<${tags[0]}>\n`;
              xml += this.generateTag(tags[1], row[1], 2);
              xml += this.generateTag(tags[2], row[2], 2);
      
              isPersonClosed = false;
              isFamilyClosed = true;
          }
      
          //case 2: 'F' = family
          else if (recordType === 'F') {

              if (!isFamilyClosed) {
                  xml += `\t\t</${tags[0]}>\n`;
              }

              xml += `\t\t<${tags[0]}>\n`;
              xml += this.generateTag(tags[1], row[1], 3);
              xml += this.generateTag(tags[2], row[2], 3);
      
              isFamilyClosed = false;
          }

          //case 3: 'A' = Address
          else if (recordType === 'A') {

            //case 3.1 family is closed (address is child element to person)
            if (isFamilyClosed) {
              xml += `\t\t<${tags[0]}>\n`;
              xml += this.generateTag(tags[1], row[1], 3);
              xml += this.generateTag(tags[2], row[2], 3);
              xml += this.generateTag(tags[3], row[3], 3);
              xml += `\t\t</${tags[0]}>\n`;
            }

            //case 3.2 family is open (address is child element to family)
            else {
              xml += `\t\t\t<${tags[0]}>\n`;
              xml += this.generateTag(tags[1], row[1], 4);
              xml += this.generateTag(tags[2], row[2], 4);
              xml += this.generateTag(tags[3], row[3], 4);
              xml += `\t\t\t</${tags[0]}>\n`;
            }
          }
      
          //case 4 'T' = Phone
          else if (recordType === 'T') {

            //case 4.1: family is closed (phone is child element to person)
            if (isFamilyClosed) {
              xml += `\t\t<${tags[0]}>\n`;
              xml += this.generateTag(tags[1], row[1], 3);
              xml += this.generateTag(tags[2], row[2], 3);
              xml += `\t\t</${tags[0]}>\n`;
            }

            //case 4.2: family is open (phone is child element to family)
            else {
              xml += `\t\t\t<${tags[0]}>\n`;
              xml += this.generateTag(tags[1], row[1], 4);
              xml += this.generateTag(tags[2], row[2], 4);
              xml += `\t\t\t</${tags[0]}>\n`;
            }
          }
      });

      if (!isFamilyClosed) {
        xml += `\t\t</family>\n`;
      }

      if (!isPersonClosed) {
        xml += `\t</person>\n`;
      }

      xml += '</people>\n';
      return xml;
    }
  };
