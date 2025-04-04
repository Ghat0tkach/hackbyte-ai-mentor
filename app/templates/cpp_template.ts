// C++ template with main function for Judge0 submissions
export const cppTemplate = `#include <vector>
#include <iostream>
#include <string>
#include <sstream>
#include <algorithm>
using namespace std;

// User's solution function will be inserted here

// Main function to parse input and call the solution
int main() {
    string input;
    getline(cin, input);
    
    // Parse the input string
    string numsStr, targetStr;
    size_t pos = input.find("nums = ");
    if (pos != string::npos) {
        numsStr = input.substr(pos + 7);
        pos = numsStr.find(", target = ");
        if (pos != string::npos) {
            targetStr = numsStr.substr(pos + 11);
            numsStr = numsStr.substr(0, pos);
        }
    }
    
    // Remove brackets from nums array
    numsStr.erase(remove(numsStr.begin(), numsStr.end(), '['), numsStr.end());
    numsStr.erase(remove(numsStr.begin(), numsStr.end(), ']'), numsStr.end());
    
    // Parse nums array
    vector<int> nums;
    stringstream ss(numsStr);
    string token;
    while (getline(ss, token, ',')) {
        nums.push_back(stoi(token));
    }
    
    // Parse target
    int target = stoi(targetStr);
    
    // Call the solution function
    vector<int> result = twoSum(nums, target);
    
    // Format and print the output
    cout << "[";
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) {
            cout << ",";
        }
    }
    cout << "]" << endl;
    
    return 0;
}
`;