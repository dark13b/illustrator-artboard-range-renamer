# illustrator-artboard-range-renamer
A script that renames multiple artboards in Adobe Illustrator 2025 using numeric ranges and partial text replacements.

Overview
This script is designed for Adobe Illustrator 2025 using ExtendScript. It allows you to rename artboards by replacing a specific substring in their names. You can specify which artboards to modify by entering ranges (for example, "1-3, 5, 7-9"). The script converts these user-friendly, 1-based artboard numbers into the 0-based indices that Illustrator uses internally.

How It Works
Initialization and Validation

The script starts by checking if an Illustrator document is open. If not, it alerts you and stops execution.
All the main code is wrapped inside a self-invoking function to keep the global scope clean and to allow the use of return statements without errors.
User Prompts

Text to Find: The script first prompts you to enter the text you want to replace in the artboard names.
Replacement Text: Next, you provide the text that will replace the found string.
Artboard Range Input: You then enter a range string (like "1-3,5,7-9"). This input tells the script which artboards should have their names updated.
Processing the Range Input

The range input is split by commas to handle each segment separately.
A helper function (named safeTrim) removes any extra spaces from each segment, ensuring that the input is clean. This is especially useful for older versions of ExtendScript that do not support String.trim().
Each segment is analyzed:
If it contains a dash (e.g., "2-5"), it is treated as a range. The script parses the starting and ending numbers, then converts each number in that range from 1-based to 0-based indexing.
If it is a single number, it is also converted accordingly.
The script builds an array of valid artboard indices and then removes any duplicate entries manually (using a simple loop instead of Array.indexOf()) to ensure each artboard is processed only once.
Renaming Process

For each valid, unique artboard index, the script retrieves the current artboard name.
It creates a regular expression using the text you want to find and the "g" flag, which replaces all instances of that text within the artboard name.
If the new name differs from the original, the artboard's name is updated, and a counter increases to track how many artboards were modified.
Completion Notification

After processing all specified artboards, the script displays an alert showing the number of artboards that were successfully renamed.
Key Benefits
User-Friendly Input: By allowing numeric ranges (e.g., "1-3,5,7-9"), the script makes it easy for you to specify multiple artboards without having to list each one separately.
Backward Compatibility: The script includes custom functions to handle cases where modern JavaScript methods (like trim() or Array.indexOf()) are not available in older ExtendScript environments.
Robust Error Handling: The script gracefully handles situations such as no document being open or the user canceling one of the prompts, ensuring that it exits without causing errors.
