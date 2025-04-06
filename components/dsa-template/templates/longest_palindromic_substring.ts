export const longestPalindromicSubstringTemplate = `#include <string>
#include <iostream>
using namespace std;

// User's solution function will be inserted here
string longestPalindrome(string s) {
    return "";
}

int main() {
    try {
        string input;
        getline(cin, input);
        
        size_t pos = input.find("s = ");
        if (pos == string::npos) throw invalid_argument("Missing 's = '");
        
        string s = input.substr(pos + 4);
        if (s.front() == '"') s = s.substr(1, s.size() - 2);
        
        string result = longestPalindrome(s);
        cout << '"' << result << '"' << endl;
        
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    return 0;
}`;
