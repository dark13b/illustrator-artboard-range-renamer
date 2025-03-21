# illustrator-artboard-range-renamer
A script that renames multiple artboards in Adobe Illustrator 2025 using numeric ranges and partial text replacements.

# Illustrator Artboard Range Renamer

A powerful ExtendScript for Adobe Illustrator 2025 that renames artboards by replacing a specific substring in their names. This script lets you target artboards using numeric ranges (e.g., `1-3, 5, 7-9`), making it easy to update multiple artboard names in one go.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Usage Instructions](#usage-instructions)
- [Error Handling & Compatibility](#error-handling--compatibility)
- [License](#license)

## Overview

This script automates the tedious task of renaming artboards in Illustrator. Instead of manually updating each artboard, you can simply specify the text to find, the replacement text, and a range of artboards to update. The script converts your user-friendly 1-based input into the 0-based indices required by Illustrator.

## Features

- **Range-Based Artboard Selection:**  
  Specify ranges like `1-3, 5, 7-9` to target multiple artboards in one go.
  
- **Substring Replacement:**  
  Replace all occurrences of a specified substring within each artboard name.
  
- **Backward Compatibility:**  
  Designed to work with older ExtendScript versions that lack modern JavaScript methods like `String.trim()` and `Array.indexOf()`.
  
- **Robust Error Handling:**  
  Gracefully exits if no document is open, if prompts are canceled, or if invalid input is provided.

## How It Works

### 1. Initialization and Validation
- The script first checks if an Illustrator document is open.
- All code is wrapped in an Immediately Invoked Function Expression (IIFE) to maintain scope and enable the use of `return` statements.

### 2. User Prompts
- **Text to Find:** Prompts you to enter the substring to search for in the artboard names.
- **Replacement Text:** Prompts you for the text that will replace the found substring.
- **Artboard Range Input:** Prompts you to specify the artboards to rename using 1-based numbering in a range format (e.g., `1-3, 5, 7-9`).

### 3. Processing the Range Input
- The range string is split by commas to handle each segment separately.
- A custom `safeTrim()` function removes any leading or trailing whitespace from each segment.
- Segments containing a dash (`-`) are parsed as ranges and converted from 1-based to 0-based indices.
- Single numbers are similarly converted.
- The script manually removes duplicate indices to ensure each artboard is processed only once.

### 4. Renaming Process
- For every valid and unique artboard index:
  - The script retrieves the current artboard name.
  - A regular expression (with the global flag) is used to replace all occurrences of the specified substring.
  - If a change is made, the artboard's name is updated, and a counter tracks the number of successful changes.

### 5. Completion Notification
- Once all specified artboards are processed, the script displays an alert indicating how many artboards were renamed.

## Usage Instructions

1. **Open Your Document:**  
   Open the Adobe Illustrator file that contains the artboards you want to rename.

2. **Run the Script:**  
   In Illustrator, navigate to **File > Scripts > Other Script...** and select the `.jsx` file.

3. **Follow the Prompts:**  
   - Enter the substring you want to find in the artboard names.
   - Enter the replacement text.
   - Specify the artboard numbers or ranges (e.g., `1-3, 5, 7-9`).

4. **View the Result:**  
   After processing, an alert will indicate how many artboards were renamed.

## Error Handling & Compatibility

- **No Document Open:**  
  The script will alert you if no document is open and then exit gracefully.

- **User Cancellation:**  
  If you cancel any prompt, the script exits without errors.

- **Older ExtendScript Support:**  
  Uses a custom `safeTrim()` function to remove whitespace and manual loops to remove duplicate indices, ensuring compatibility with older ExtendScript versions.

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute the code as needed.

---

*Happy coding and enjoy automating your Illustrator workflow!*
