#include <stdio.h>
#include <stdlib.h>  // For malloc and free

void selectionSort(int arr[], int n) {
    int i, j, minIndex, temp;
    
    for (i = 0; i < n - 1; i++) {
        minIndex = i;
        
        // Find the minimum element in the unsorted part of the array
        for (j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Swap the found minimum element with the element at i
        if (minIndex != i) {
            temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
}

void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int main() {
    int n;
    
    // Prompt the user to enter the size of the array
    printf("Enter the number of elements: ");
    scanf("%d", &n);
    
    // Dynamically allocate memory for the array based on the user input
    int *arr = (int *)malloc(n * sizeof(int));  // Using malloc for dynamic memory allocation
    
    if (arr == NULL) {  // Check if memory allocation was successful
        printf("Memory allocation failed!\n");
        return 1;
    }
    
    // Prompt the user to input the elements of the array
    printf("Enter %d elements: ", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }
    
    printf("Original Array: ");
    printArray(arr, n);
    
    selectionSort(arr, n);
    
    printf("Sorted Array: ");
    printArray(arr, n);
    
    // Free the dynamically allocated memory
    free(arr);
    
    return 0;
}
