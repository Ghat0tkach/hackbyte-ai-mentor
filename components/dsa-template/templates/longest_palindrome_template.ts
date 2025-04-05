// C++ template for Longest Palindromic Substring problem
export const longestPalindromeTemplate = `#include <vector>
#include <iostream>
#include <string>
#include <sstream>
#include <algorithm>
using namespace std;

// User's solution function will be inserted here
string longestPalindrome(string s) {
    // This is a placeholder. The actual solution will be provided by the user
    return "";
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
        
        // Remove quotes from the string
        if (sStr.size() >= 2 && sStr.front() == '\"' && sStr.back() == '\"') {
            sStr = sStr.substr(1, sStr.size() - 2);
        }
        
        // Call the solution function
        string result = longestPalindrome(sStr);
        
        // Print the output
        cout << "\"" << result << "\"" << endl;
        
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    
    return 0;
}
`;