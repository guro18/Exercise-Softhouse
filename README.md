# Exercise-Softhouse-XMLConverter
This project aims to convert old row based file format into specified XML format,
using typescript. The format of the input files are following:

    P|firstname|lastname
    T|mobile|landlinenumber
    A|street|city|postalcode
    F|name|born

P can have child elements: T, A and F

F can have child elements: T and A

Please see the exampleInput.txt, exampleOutput.xml and XMLstructures.png for reference

## Features
- Parse row-based input files
- Convert rows into structured XML format

## Prerequisites
- npm (Node Package Manager)

## Usage
- Clone the repo to your local machine
- Run: `npm install ts-node typescript` , to install packages
- Make sure you have the inputfile you want to convert in the same directory
- Run `node --loader ts-node/esm --experimental-specifier-resolution=node main.ts <yourInputFile.txt> <yourOutputFileName>`
- The outputfile should appear in the same directory

## Project Structure
- TagsDict.ts       # Contains the tags dictionary
- XMLConverter.ts   # Contains the XMLConverter class
- Main.ts           # Main script that calls the class & methods & file operations
