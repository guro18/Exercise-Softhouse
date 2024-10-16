import * as fs from 'fs';

const args = process.argv;
const inputFile = args[2]; //inputfile specified in the command
const outputFile = args[3]; //outputfile specified in the command

//read data from the specified inputfile
let data: string;
try {
  data = fs.readFileSync(inputFile, 'utf8');
} 

// Exit the program on error
catch (error) {
  console.error(`Error reading file: ${inputFile}`, error);
  process.exit(1);
}

//dictionary for creating XMLtags
const tagsDict: { [key: string]: string[] } = {
    P: ['person', 'firstname', 'lastname'],
    T: ['phone', 'mobile', 'landlinenumber'],
    A: ['address', 'street', 'city', 'postalcode'],
    F: ['family', 'name', 'born']
  };

//class to convert the input file to xml file
class XMLConverter {

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
        let xml = '<people>\n'; //start with opening tag for people
        let isPersonClosed = true; //close person by default
        let isFamilyClosed = true; //close family by default

        //iterate through rows
        rows.forEach(row => {
          const recordType = row[0]; //start by set recordType = row[0], person, address etc
          const tags = tagsDict[recordType]; //get tags for the recordType
      
          //case 1: 'P' = person
          if (recordType === 'P') {

              //close previous family and person if they're open
              if (!isPersonClosed) {
                  if (!isFamilyClosed) {
                      xml += `\t\t</family>\n`; //closing tag for family
                      isFamilyClosed = true; //close family
                  }
                  xml += `\t</person>\n`; //closing tag person
              }

              //start new person
              xml += `\t<${tags[0]}>\n`; //persontag
              xml += this.generateTag(tags[1], row[1], 2); //firstname + tags
              xml += this.generateTag(tags[2], row[2], 2); //lastname + tags
      
              isPersonClosed = false; //open person
              isFamilyClosed = true; //keep family closed
          }
      
          //case 2: 'F' = family
          else if (recordType === 'F') {

              //close the previous family if is open
              if (!isFamilyClosed) {
                  xml += `\t\t</family>\n`; //closing tag
              }
      
              //start new family
              xml += `\t\t<${tags[0]}>\n`;
              xml += this.generateTag(tags[1], row[1], 3); //family - name
              xml += this.generateTag(tags[2], row[2], 3); //family - born
      
              isFamilyClosed = false; //open family
          }
      
          // Case 3: 'A' = Address
          else if (recordType === 'A') {

            //case 3.1 family is closed (address is child element to person)
            if (isFamilyClosed) {
              xml += `\t\t<${tags[0]}>\n`; //
              xml += this.generateTag(tags[1], row[1], 3); // street
              xml += this.generateTag(tags[2], row[2], 3); // city
              xml += this.generateTag(tags[3], row[3], 3); // postalcode
              xml += `\t\t</${tags[0]}>\n`; 
            }

            // case 3.2 family is open (address is child element to family)
            else {
              xml += `\t\t\t<${tags[0]}>\n`;
              xml += this.generateTag(tags[1], row[1], 4); // street
              xml += this.generateTag(tags[2], row[2], 4); // city
              xml += this.generateTag(tags[3], row[3], 4); // postalcode
              xml += `\t\t\t</${tags[0]}>\n`;
            }
          }
      
          // Case 4 'T' = Phone
          else if (recordType === 'T') {

            // case 4.1: family is closed (phone is child element to person)
            if (isFamilyClosed) {
              xml += `\t\t<${tags[0]}>\n`;
              xml += this.generateTag(tags[1], row[1], 3); // mobile
              xml += this.generateTag(tags[2], row[2], 3); // landlinenumber
              xml += `\t\t</${tags[0]}>\n`;
            }

            // case 4.2: family is open (phone is child element to family)
            else {
              xml += `\t\t\t<${tags[0]}>\n`;
              xml += this.generateTag(tags[1], row[1], 4);// mobile
              xml += this.generateTag(tags[2], row[2], 4); // landlinenumber
              xml += `\t\t\t</${tags[0]}>\n`;
            }
          }
      });

      //close family tag
      if (!isFamilyClosed) {
        xml += `\t\t</family>\n`;
      }

      //close person tag
      if (!isPersonClosed) {
        xml += `\t</person>\n`;
      }

      //close people tag & xml file
      xml += '</people>\n';
      return xml;
    }
  };
  
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
