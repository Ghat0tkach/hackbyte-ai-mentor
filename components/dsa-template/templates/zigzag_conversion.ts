export const zigzagConversionTemplate = `#include <string>
#include <iostream>
#include <sstream>
using namespace std;

// User's solution function will be inserted here
string convert(string s, int numRows) {
    return "";
}

int main() {
    try {
        string input;
        getline(cin, input);

        // Parse input in format: s = "PAYPALISHIRING", numRows = 3
        size_t pos = input.find("s = ");
        if (pos == string::npos) throw invalid_argument("Missing 's = '");
        
        string s = input.substr(pos + 4);
        pos = s.find(", numRows = ");
        if (pos == string::npos) throw invalid_argument("Missing 'numRows = '");
        
        string numRowsStr = s.substr(pos + 11);
        s = s.substr(0, pos);
        
        // Remove quotes if present
        if (s.front() == '"') s = s.substr(1, s.size() - 2);
        
        int numRows = stoi(numRowsStr);
        
        string result = convert(s, numRows);
        cout << '"' << result << '"' << endl;
        
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    return 0;
}`;