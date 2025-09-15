/*"Write a program to 
 (a.) create an array of integers and initialize it at compile-time
 (b.) create another array of floating values and initialize it at run-time
 (c.) display the elements of both the arrays with proper headings"*/
#include <stdio.h>

int main() {
    // (a) Create and initialize an array of integers at compile-time
    int intArray[] = {10, 20, 30, 40, 50}; 
    int intArraySize = sizeof(intArray) / sizeof(intArray[0]);

    // (b) Create another array of floating values and initialize it at run-time
    float floatArray[5];  // Array for 5 floating-point numbers
    int floatArraySize = sizeof(floatArray) / sizeof(floatArray[0]);

    printf("\nEnter %d floating-point values:\n", floatArraySize);
    for (int i = 0; i < floatArraySize; i++) {
        scanf("%f", &floatArray[i]);
    }

    // (c) Display both arrays with proper headings
    printf("\nInteger Array (Compile-time initialized):\n");
    for (int i = 0; i < intArraySize; i++) {
        printf("%d ", intArray[i]);
    }
    printf("\n");

    printf("\nFloating-point Array (Run-time initialized):\n");
    for (int i = 0; i < floatArraySize; i++) {
        printf("%.2f ", floatArray[i]);
    }
    printf("\n");

    return 0;
}
