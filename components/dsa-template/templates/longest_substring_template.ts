// C++ template for Longest Substring Without Repeating Characters problem
export const longestSubstringTemplate = `#include <vector>
#include <iostream>
#include <string>
#include <sstream>
#include <algorithm>
#include <unordered_set>
using namespace std;

// User's solution function will be inserted here
int lengthOfLongestSubstring(string s) {
    // This is a placeholder. The actual solution will be provided by the user
    return 0;
}

// Main function to parse input and call the solution
int main() {
    try {
        string input;
        getline(cin, input);
        
        // Parse the input string
        string sStr;
        size_t pos = input.find("s = ");
        if (pos == string::npos) {
            throw invalid_argument("Invalid input format: 's = ' not found");
        }
        
        sStr = input.substr(pos + 4);
        
        // Remove quotes and extra whitespace
        sStr.erase(remove(sStr.begin(), sStr.end(), '\"'), sStr.end());
        sStr.erase(remove(sStr.begin(), sStr.end(), '\\r'), sStr.end()); // carriage return (for Windows)
        sStr.erase(remove(sStr.begin(), sStr.end(), '\\n'), sStr.end()); // newline (for Unix/Windows)
        sStr.erase(sStr.find_last_not_of(" \t") + 1); // trim trailing spaces or tabs
        
        // Call the solution function
        int result = lengthOfLongestSubstring(sStr);
        
        // Print the output
        cout << result << endl;
        
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    
    return 0;
}
`;