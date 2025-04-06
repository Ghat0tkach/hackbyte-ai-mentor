// C++ template with main function for Judge0 submissions
export const cppTemplate = `#include <vector>
#include <iostream>
#include <string>
#include <sstream>
#include <algorithm>
using namespace std;

// Function to find two numbers that add up to target
vector<int> twoSum(vector<int>& nums, int target) {
    // This is a placeholder. The actual solution will be provided by the user
    return vector<int>{0, 0};
}

// Main function to parse input and call the solution
int main() {
    try {
        string input;
        getline(cin, input);
        
        // Parse the input string
        string numsStr, targetStr;
        size_t pos = input.find("nums = ");
        if (pos == string::npos) {
            throw invalid_argument("Invalid input format: 'nums = ' not found");
        }
        
        numsStr = input.substr(pos + 7);
        pos = numsStr.find(", target = ");
        if (pos == string::npos) {
            throw invalid_argument("Invalid input format: ', target = ' not found");
        }
        
        targetStr = numsStr.substr(pos + 11);
        numsStr = numsStr.substr(0, pos);
        
        // Remove brackets and spaces from nums array
        numsStr.erase(remove(numsStr.begin(), numsStr.end(), '['), numsStr.end());
        numsStr.erase(remove(numsStr.begin(), numsStr.end(), ']'), numsStr.end());
        numsStr.erase(remove(numsStr.begin(), numsStr.end(), ' '), numsStr.end());
        
        // Parse nums array
        vector<int> nums;
        stringstream ss(numsStr);
        string token;
        while (getline(ss, token, ',')) {
            if (!token.empty()) {
                nums.push_back(stoi(token));
            }
        }
        
        // Parse target
        targetStr.erase(remove(targetStr.begin(), targetStr.end(), ' '), targetStr.end());
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
        
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    
    return 0;
}
`;