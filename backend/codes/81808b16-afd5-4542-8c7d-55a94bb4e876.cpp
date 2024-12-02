#include <iostream>
using namespace std;

int main() {
    int sum = 0; // Initialize sum to 0

    // Loop from 1 to 10
    for (int i = 1; i <= 10; i++) {
        sum += i; // Add the current number to the sum
    }

    // Output the result
    cout << "The sum of the first 10 natural numbers is: " << sum << endl;

    return 0; // Return 0 to indicate successful execution
}
