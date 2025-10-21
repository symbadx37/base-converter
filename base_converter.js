// Credit: JSym on October 21st, 2025.

// Purpose: A simple program for cross-conversion of binary, decimal, and hexadecimal values for
// use within a command terminal window or online JS compiler. Only alphanumerical, 64-bit values
// (or lower) are accepted, anything else will be rejected by the program. Inverting the bit order
// (endianness) for binary values is also supported.

/* READ INSTRUCTIONS BEFORE EXECUTING
   To use this program via an online compiler, visit https://www.programiz.com/javascript/online-compiler/
   and copy paste the code below into the box on the left-hand side. Then click the "Run" button and follow
   the terminal prompts within the box on the right.

   To use this program via a command terminal window, visit https://nodejs.org/en/download and install the native
   package for your system. Run the downloaded installer and follow the installation wizard. After installation,
   copy this code file to a local directory on your system. Open your a command terminal window and run the
   following command, making sure to replace the drive volume and appropiate file path: 
   
      node "X:\PathToFile\value_converter.js"

   If you did everything correctly, the program should start running and display a prompt in the terminal window. If
   this is not the case, double check you have node.js installed by running node -v in the terminal and making sure
   you entered the filepath correctly. If you are still stuck, try consulting the internet for solutions or create an
   issue on the GitHub repository for this project: https://github.com/Symbadx37/base-converter/issues.
*/

// Create global object for storing data
let data = {inputValue: 0, notationType: "", schemeType: "", endianType: "", conversionPath: "", outputValue: 0,
    getKey: function(n) {
        let keys = Object.keys(this)[n];
        return keys;
    }
};

// Create global object for storing error prompts
const e = "ERROR: ", error = {
    invalidValue: e + "Entered value does not fall within the expected range.",
    invalidNotation: e + "Entered notation is not a valid type.",
    invalidScheme: e + "Entered conversion scheme is not a valid type.",
    invalidSize: e + "The entered value is too big (64-bit maximum).",
    invalidEndian: e + "Entered endianness is not a valid type.",
    invalidBin: e + "Entered value is not a valid binary number.",
    invalidDec: e + "Entered value is not a valid decimal number.",
    invalidHex: e + "Entered value is not a valid hexadecimal number.",
    invalidMatch: e + "Entered conversion scheme cannot match entered notation type."
}

// Print welcome message
console.log("BASE CONVERTER - Version 251021" + "\n" + "View GitHub repository: https://github.com/Symbadx37/base-converter" + "\n");

// Program entry point and callback functions
run();
async function run() {
    await getInput().then(() => {
        convertInput();
        displayResult();
    });
    await getAction(1);
    async function getAction(state) {
        switch(state) {
            case 1: console.log("\n" + "SYSTEM: Perform another operation? (Y/N): "); break;
            case 2: console.log("SYSTEM: Perform another operation? (Y/N): "); break;
        }
        await new Promise(function(resolve) {
            process.stdin.once("data", function(input) {
                let action = input.toString().toLowerCase().trim();
                switch(action) {
                    case "y": console.clear(); resolve(); run(); break;
                    case "n": resolve(); process.exit();
                    default:
                        console.error(error.invalidValue); 
                        getAction(2);
                }
            });
        });
    }
}

// Get data from terminal
async function getInput() {
    let index = 0;
    const prompt = [
        "Enter an alphanumeric number (0-9, a-f): ",
        "Enter notation type (from BIN/DEC/HEX): ",
        "Enter desired conversion scheme (to BIN/DEC/HEX): ",
        "Enter desired endianness (BIG/LTL): "
    ];
    while (index < 4) {
        // End loop if notation is not binary
        if (index == 3 && !(data.schemeType == "bin")) {
            break;
        }
        // Reset index if out of bounds
        if (index < 0) {
            index = 0;
        }
        else {
            console.log(prompt[index]);
            await new Promise(function(resolve) {
                process.stdin.once("data", function(input) {
                    data[data.getKey(index)] = input.toString().toLowerCase().trim();
                    const newIndex = validateInput(index);
                    index = newIndex;
                    resolve();
                });
            });  
        }
    }
}

// Validate user input
function validateInput(newIndex) {
    // Check if input value is a valid alphanumerical value
    const checkValue = function() {
        if (/^0x(?=[0-9a-f]+$)|^[0-9a-f]+$/.test(data.inputValue)) {
            newIndex++;
        } else {
            console.error(error.invalidValue);
        }
    }
    // Check notation/scheme type
    const checkType = function(ioType) {
        let activeType;
        switch(ioType) {
            case 1: activeType = data.notationType; break;
            case 2: activeType = data.schemeType; break;
        }
        // Check if entered type is valid
        if (!(activeType == "bin" || activeType == "dec" || activeType == "hex")) {
            if (ioType == 1) {
                console.error(error.invalidNotation);
            } else {
                console.error(error.invalidScheme);
            }
        }
        // Check if entered scheme type matches notation type, excluding binary values
        if (ioType == 2 && data.notationType == data.schemeType) {
            if (!(data.notationType == "bin" || data.schemeType == "bin")) {
                console.error(error.invalidMatch);
                return;
            }
        }
        // Check if input value is valid based on its notation type
        switch(data.notationType) {
            case "bin":
                if (/^[0-1]+$/.test(data.inputValue)) {
                    newIndex++;
                } else {
                    console.error(error.invalidBin);
                } break;
            case "dec": 
                if (/^[0-9]+$/.test(data.inputValue)) {
                    newIndex++;
                } else {
                    console.error(error.invalidDec);
                } break;
            case "hex":
                if (/^[0-9a-f]+$/.test(data.inputValue)) {
                    newIndex++;
                } else {
                    console.error(error.invalidHex);
                } break;
        }
    }
    // Check integer size in bit count
    const checkSize = function() {
        const MAX_VALUE_64b = 2n ** 64n - 1n;
        let base;
        switch (data.notationType) {
            case "bin": base = 2; break;
            case "dec": base = 10; break;
            case "hex": base = 16; break;
        }
        let num = Number.parseInt(data.inputValue, base);
        if (num > MAX_VALUE_64b) {
            console.error(error.invalidSize);
            newIndex -= 2;
        }
    }
    // Check endianness for binary values
    const checkEndian = function() {
        if (/\b(big|ltl)\b/.test(data.endianType)) {
            newIndex++;
        } 
        else if (/\blittle\b/.test(data.endianType)) {
            data.schemeType = "ltl";
            newIndex++;
        }
        else {
            console.error(error.invalidEndian);
        }
    }
    // Call stack
    switch(newIndex) {
        case 0: checkValue(); break;
        case 1: checkType(1); checkSize(); break;
        case 2: checkType(2); break;
        case 3: checkEndian(); break;
    }
    return newIndex;
}

// Parse and convert input
function convertInput() {
    // Generate conversion path
    data.conversionPath = data.notationType + data.schemeType;
    
    // Convert input value
    const convertValue = function(value) {
        let notationBase, schemeBase;
        switch(data.notationType) {
            case "bin": notationBase = 2; break;
            case "dec": notationBase = 10; break;
            case "hex": notationBase = 16; break;
        }
        switch(data.schemeType) {
            case "bin": schemeBase = 2; break;
            case "dec": schemeBase = 10; break;
            case "hex": schemeBase = 16; break;
        }
        const output = (Number.parseInt(value, notationBase)).toString(schemeBase);
        return output;
    }
    // Invert bit order for necessary binary strings
    const invertBitOrder = function (bin) {
        // Slice characters and push to array
        let index = 0, char = [];
        while (index < bin.length) {
            let slice = bin.charAt(index);
            char.push(slice);
            index++;
        }
        // Reverse index and parse to string
        char.reverse();
        let invertedBin = char.join("");
        return invertedBin;
    }
    // Call stack
    switch(data.conversionPath) {
        case "binbin": 
            data.outputValue = invertBitOrder(data.inputValue); break;
        case "decbin":
            data.outputValue = convertValue(data.inputValue);
            if (data.endianType == "ltl") {
                invertBitOrder(data.outputValue);
            } break;
        case "hexbin":
            data.outputValue = convertValue(data.inputValue);
            if (data.endianType == "ltl") {
                invertBitOrder(data.outputValue);
            } break;
        default:
            data.outputValue = convertValue(data.inputValue); break;
    }
}

// Build strings and display results in terminal
function displayResult() {
    let inputBase, outputBase, inputEndian = "", outputEndian = "";
    // Build base string
    switch(data.notationType) {
        case "bin": inputBase = "Base 2"; break;
        case "dec": inputBase = "Base 10"; break;
        case "hex": inputBase = "Base 16"; break;
    }
    switch(data.schemeType) {
        case "bin": outputBase = "Base 2"; break;
        case "dec": outputBase = "Base 10"; break;
        case "hex": outputBase = "Base 16"; break;
    }
    // Build endian string
    if (data.conversionPath == "binbin") {
        if (data.endianType == "big") {
            inputEndian = "(little-endian)";
        }
        else if (data.endianType == "ltl") {
            inputEndian = "(big-endian)";
        }
    }
    if (data.schemeType == "bin") {
        if (data.endianType == "big") {
            outputEndian = "(big-endian)";
        }
        else if (data.endianType == "ltl") {
            outputEndian = "(little-endian)";
        }
    }
    // Build substrings
    let inputString = "INPUT Value:" + "\n" + inputBase + " = " + data.inputValue + " " + inputEndian;
    let outputString = "OUTPUT Value:" + "\n" + outputBase + " = " + data.outputValue  + " " + outputEndian;
    
    // Clear and print to console
    process.stdout.write("\x1Bc");
    console.log("SYSTEM: Conversion successful." + "\n" + inputString + "\n" + outputString);
}