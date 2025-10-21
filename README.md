# Base Converter

Simple JavaScript program using the `node.js` runtime environment for use in the terminal on Unix and Windows based systems.

### Purpose

A simple program for cross-conversion of binary, decimal, and hexadecimal values for use within a command terminal window or online JS compiler. Only alphanumerical, 64-bit values (or lower) are accepted, anything else will be rejected by the program. Inverting the bit order (endianness) for binary values is also supported.

### Installation

This program can be used one of two ways: a terminal window in conjunction with `node.js`, or in a browser-based JavaScript compiler. If you plan to run this program using a terminal window, make sure to download the latest package before preceding.

To use this program via an online compiler, visit https://www.programiz.com/javascript/online-compiler/
and copy paste the code below into the box on the left-hand side. Then click the "Run" button and follow
the terminal prompts within the box on the right.

To use this program via a command terminal window, visit https://nodejs.org/en/download and install the native
package for your system. Run the downloaded installer and follow the installation wizard. After installation,
copy this code file to a local directory on your system. Open your a command terminal window and run the
following command, making sure to replace the drive volume and appropriate file path:

    node "X:\PathToFile\base_converter.js"

If you did everything correctly, the program should start running and display a prompt in the terminal window. If this is not the case, double check you have node.js installed by running `node -v` in the terminal and making sure you entered the filepath correctly. If you are still stuck, try consulting the internet for solutions or create an issue on the GitHub repository for this project: https://github.com/Symbadx37/base-converter/issues.
