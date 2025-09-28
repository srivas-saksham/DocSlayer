// Write a program to Merge unsorted arrays
#include <stdio.h>
#include <stdlib.h>  // For malloc() and free()

// Function to merge two arrays
void mergeArrays(int *arr1, int size1, int *arr2, int size2, int *mergedArr) {
    int i, j;
    
    // Copy elements of arr1 to mergedArr
    for (i = 0; i < size1; i++) {
        mergedArr[i] = arr1[i];
    }

    // Copy elements of arr2 to mergedArr
    for (j = 0; j < size2; j++) {
        mergedArr[i + j] = arr2[j];
    }
}

int main() {
    int size1, size2;

    // Input size of first array
    printf("Enter size of first array: ");
    scanf("%d", &size1);

    // Dynamic memory allocation for first array
    int *arr1 = (int *)malloc(size1 * sizeof(int));
    if (arr1 == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }

    // Input elements of first array
    printf("Enter %d elements of first array:\n", size1);
    for (int i = 0; i < size1; i++) {
        scanf("%d", &arr1[i]);
    }

    // Input size of second array
    printf("Enter size of second array: ");
    scanf("%d", &size2);

    // Dynamic memory allocation for second array
    int *arr2 = (int *)malloc(size2 * sizeof(int));
    if (arr2 == NULL) {
        printf("Memory allocation failed!\n");
        free(arr1); // Free previously allocated memory before exiting
        return 1;
    }

    // Input elements of second array
    printf("Enter %d elements of second array:\n", size2);
    for (int i = 0; i < size2; i++) {
        scanf("%d", &arr2[i]);
    }

    // Allocate memory for merged array
    int *mergedArr = (int *)malloc((size1 + size2) * sizeof(int));
    if (mergedArr == NULL) {
        printf("Memory allocation failed!\n");
        free(arr1);
        free(arr2);
        return 1;
    }

    // Merge the two arrays
    mergeArrays(arr1, size1, arr2, size2, mergedArr);

    // Display merged array
    printf("\nMerged Array:\n");
    for (int i = 0; i < size1 + size2; i++) {
        printf("%d ", mergedArr[i]);
    }
    printf("\n");

    // Free allocated memory
    free(arr1);
    free(arr2);
    free(mergedArr);

    return 0;
}
