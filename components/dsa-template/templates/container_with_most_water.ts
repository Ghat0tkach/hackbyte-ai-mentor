// C++ template for Container With Most Water problem
export const containerWithMostWaterTemplate = `#include <vector>
#include <iostream>
#include <sstream>
using namespace std;

// User's solution function will be inserted here
int maxArea(vector<int>& height) {
    return 0;
}

int main() {
    try {
        string input;
        getline(cin, input);
        
        size_t pos = input.find("height = ");
        if (pos == string::npos) throw invalid_argument("Missing 'height = '");
        
        string arrayStr = input.substr(pos + 8);
        if (arrayStr.front() != '[' || arrayStr.back() != ']') 
            throw invalid_argument("Invalid array format");
            
        arrayStr = arrayStr.substr(1, arrayStr.size() - 2);
        stringstream ss(arrayStr);
        vector<int> height;
        string num;
        
        while (getline(ss, num, ',')) {
            height.push_back(stoi(num));
        }
        
        int result = maxArea(height);
        cout << result << endl;
        
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    return 0;
}`;