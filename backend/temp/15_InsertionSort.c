// WAP to implement Insertion Sort
#include <stdio.h>
#include <stdlib.h>

void insertionSort(int arr[], int n){
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;

        // Move elements that are greater than key to one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key; // Insert key at the correct position
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
    
    insertionSort(arr, n);

    printf("Sorted Array: ");
    printArray(arr, n);
    
    // Free the dynamically allocated memory
    free(arr);
    
    return 0;
}
