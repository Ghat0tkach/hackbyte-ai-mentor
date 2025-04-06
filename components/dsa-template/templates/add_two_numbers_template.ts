// C++ template for Add Two Numbers problem (linked list addition)
export const addTwoNumbersTemplate = `#include <vector>
#include <iostream>
#include <string>
#include <sstream>
#include <algorithm>
using namespace std;

// Definition for singly-linked list
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

// User's solution function will be inserted here
ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    // This is a placeholder. The actual solution will be provided by the user
    return nullptr;
}

// Helper function to create a linked list from a vector
ListNode* createLinkedList(const vector<int>& nums) {
    if (nums.empty()) return nullptr;
    
    ListNode* head = new ListNode(nums[0]);
    ListNode* current = head;
    
    for (size_t i = 1; i < nums.size(); i++) {
        current->next = new ListNode(nums[i]);
        current = current->next;
    }
    
    return head;
}

// Helper function to convert linked list to vector for output
vector<int> linkedListToVector(ListNode* head) {
    vector<int> result;
    while (head) {
        result.push_back(head->val);
        head = head->next;
    }
    return result;
}

// Helper function to free memory of a linked list
void deleteLinkedList(ListNode* head) {
    while (head) {
        ListNode* temp = head;
        head = head->next;
        delete temp;
    }
}

// Main function to parse input and call the solution
int main() {
    try {
        string input;
        getline(cin, input);
        
        // Parse the input string
        string l1Str, l2Str;
        size_t pos = input.find("l1 = ");
        if (pos == string::npos) {
            throw invalid_argument("Invalid input format: 'l1 = ' not found");
        }
        
        l1Str = input.substr(pos + 5);
        pos = l1Str.find(", l2 = ");
        if (pos == string::npos) {
            throw invalid_argument("Invalid input format: ', l2 = ' not found");
        }
        
        l2Str = l1Str.substr(pos + 7);
        l1Str = l1Str.substr(0, pos);
        
        // Remove brackets and spaces from lists
        l1Str.erase(remove(l1Str.begin(), l1Str.end(), '['), l1Str.end());
        l1Str.erase(remove(l1Str.begin(), l1Str.end(), ']'), l1Str.end());
        l1Str.erase(remove(l1Str.begin(), l1Str.end(), ' '), l1Str.end());
        
        l2Str.erase(remove(l2Str.begin(), l2Str.end(), '['), l2Str.end());
        l2Str.erase(remove(l2Str.begin(), l2Str.end(), ']'), l2Str.end());
        l2Str.erase(remove(l2Str.begin(), l2Str.end(), ' '), l2Str.end());
        
        // Parse l1 array
        vector<int> l1Nums;
        stringstream ss1(l1Str);
        string token;
        while (getline(ss1, token, ',')) {
            if (!token.empty()) {
                l1Nums.push_back(stoi(token));
            }
        }
        
        // Parse l2 array
        vector<int> l2Nums;
        stringstream ss2(l2Str);
        while (getline(ss2, token, ',')) {
            if (!token.empty()) {
                l2Nums.push_back(stoi(token));
            }
        }
        
        // Create linked lists
        ListNode* l1 = createLinkedList(l1Nums);
        ListNode* l2 = createLinkedList(l2Nums);
        
        // Call the solution function
        ListNode* result = addTwoNumbers(l1, l2);
        
        // Convert result to vector for output
        vector<int> resultVector = linkedListToVector(result);
        
        // Format and print the output
        cout << "[";
        for (size_t i = 0; i < resultVector.size(); i++) {
            cout << resultVector[i];
            if (i < resultVector.size() - 1) {
                cout << ",";
            }
        }
        cout << "]" << endl;
        
        // Clean up memory
        deleteLinkedList(l1);
        deleteLinkedList(l2);
        deleteLinkedList(result);
        
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    
    return 0;
}
`;