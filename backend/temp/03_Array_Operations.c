/*"Write a program to 
 (a.) create an array of integers and initialize it
 (b.) Find minimum and maximum elements in the array
 (c.) Find sum and average of array elements"*/
#include <stdio.h>
#include <stdlib.h>  // For malloc() and free()

// Function to find the minimum element in the array
int findMin(int arr[]) {
    int size = 0;
    while (arr[size] != '\0') size++;  // Calculate size dynamically

    int min = arr[0];  // Initialize min with the first element
    for (int i = 1; i < size; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
    }
    return min;
}

// Function to find the maximum element in the array
int findMax(int arr[]) {
    int size = 0;
    while (arr[size] != '\0') size++;  // Calculate size dynamically

    int max = arr[0];  // Initialize max with the first element
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

// Function to calculate the sum of array elements
int calculateSum(int arr[]) {
    int size = 0, sum = 0;
    while (arr[size] != '\0') {  // Calculate size dynamically
        sum += arr[size];
        size++;
    }
    return sum;
}

// Function to calculate the average by calling calculateSum
float calculateAverage(int arr[]) {
    int size = 0;
    while (arr[size] != '\0') size++;  // Calculate size dynamically

    int sum = calculateSum(arr);  // Call sum function
    return (float)sum / size;
}

int main() {
    int size;

    // (a) Input array size
    printf("\nEnter the size of the array: ");
    scanf("%d", &size);

    // Dynamic memory allocation
    int *arr = (int *)malloc((size + 1) * sizeof(int));  // +1 to add NULL termination
    if (arr == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }

    // Input array elements
    printf("Enter %d elements:\n", size);
    for (int i = 0; i < size; i++) {
        scanf("%d", &arr[i]);
    }
    arr[size] = '\0';  // Null termination for size calculation

    // (b) Find minimum and maximum elements
    int min = findMin(arr);
    int max = findMax(arr);

    // (c) Calculate sum and average
    int sum = calculateSum(arr);
    float average = calculateAverage(arr);

    // Display results
    printf("\nMinimum element: %d\n", min);
    printf("Maximum element: %d\n", max);
    printf("Sum of elements: %d\n", sum);
    printf("Average of elements: %.2f\n", average);

    // Free allocated memory
    free(arr);

    return 0;
}
