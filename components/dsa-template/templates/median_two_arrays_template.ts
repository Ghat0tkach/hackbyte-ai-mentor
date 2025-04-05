// C++ template for Median of Two Sorted Arrays problem
export const medianTwoArraysTemplate = `#include <vector>
#include <iostream>
#include <string>
#include <sstream>
#include <algorithm>
#include <iomanip>
using namespace std;

// User's solution function will be inserted here
double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    // This is a placeholder. The actual solution will be provided by the user
    return 0.0;
}

// Main function to parse input and call the solution
int main() {
    try {
        string input;
        getline(cin, input);
        
        // Parse the input string
        string nums1Str, nums2Str;
        size_t pos = input.find("nums1 = ");
        if (pos == string::npos) {
            throw invalid_argument("Invalid input format: 'nums1 = ' not found");
        }
        
        nums1Str = input.substr(pos + 8);
        pos = nums1Str.find(", nums2 = ");
        if (pos == string::npos) {
            throw invalid_argument("Invalid input format: ', nums2 = ' not found");
        }
        
        nums2Str = nums1Str.substr(pos + 10);
        nums1Str = nums1Str.substr(0, pos);
        
        // Remove brackets and spaces from arrays
        nums1Str.erase(remove(nums1Str.begin(), nums1Str.end(), '['), nums1Str.end());
        nums1Str.erase(remove(nums1Str.begin(), nums1Str.end(), ']'), nums1Str.end());
        nums1Str.erase(remove(nums1Str.begin(), nums1Str.end(), ' '), nums1Str.end());
        
        nums2Str.erase(remove(nums2Str.begin(), nums2Str.end(), '['), nums2Str.end());
        nums2Str.erase(remove(nums2Str.begin(), nums2Str.end(), ']'), nums2Str.end());
        nums2Str.erase(remove(nums2Str.begin(), nums2Str.end(), ' '), nums2Str.end());
        
        // Parse nums1 array
        vector<int> nums1;
        stringstream ss1(nums1Str);
        string token;
        while (getline(ss1, token, ',')) {
            if (!token.empty()) {
                nums1.push_back(stoi(token));
            }
        }
        
        // Parse nums2 array
        vector<int> nums2;
        stringstream ss2(nums2Str);
        while (getline(ss2, token, ',')) {
            if (!token.empty()) {
                nums2.push_back(stoi(token));
            }
        }
        
        // Call the solution function
        double result = findMedianSortedArrays(nums1, nums2);
        
        // Print the output with 5 decimal places
        cout << fixed << setprecision(5) << result << endl;
        
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    
    return 0;
}
`;