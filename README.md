# Exercise-Softhouse
Exercise Softhouse XML Converter
This project aims to convert old row based file format into specified XML format,
using typescript. The format of the input files are following:

    P|firstname|lastname
    T|mobile|landlinenumber
    A|street|city|postalcode
    F|name|born

P can have child elements: T, A and F
F can have child elements: T and A

Please see the exampleInput.txt and exampleOutput.xml for reference

## Features
- Parse row-based input files
- Convert rows into structured XML format

## Usage
- Go to the directory where the inputfile is located and run