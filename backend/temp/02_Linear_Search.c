/*"Write a Program to implement Linear Search for 
 (a.) First occurence of search item
 (b.) All occurences of search item"*/
#include <stdio.h>
#include <stdlib.h>  // Required for malloc and free

void searchFirstOccurrence(int arr[], int size, int key) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == key) {
            printf("First occurrence of %d found at index %d\n", key, i);
            return;
        }
    }
    printf("Element %d not found in the array.\n", key);
}

void searchAllOccurrences(int arr[], int size, int key) {
    int found = 0;
    printf("All occurrences of %d found at indices: ", key);
    for (int i = 0; i < size; i++) {
        if (arr[i] == key) {
            printf("%d ", i);
            found = 1;
        }
    }
    if (!found) {
        printf("Element %d not found in the array.", key);
    }
    printf("\n");
}

int main() {
    int size, key;

    // Input array size
    printf("\nEnter the size of the array: ");
    scanf("%d", &size);

    // Dynamic memory allocation
    int *arr = (int *)malloc(size * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }

    // Input array elements
    printf("Enter %d elements:\n", size);
    for (int i = 0; i < size; i++) {
        scanf("%d", &arr[i]);
    }

    // Input key to search
    printf("Enter the element to search: ");
    scanf("%d", &key);

    // (a) Find first occurrence
    searchFirstOccurrence(arr, size, key);

    // (b) Find all occurrences
    searchAllOccurrences(arr, size, key);

    // Free allocated memory
    free(arr);

    return 0;
}
