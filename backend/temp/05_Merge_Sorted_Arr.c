// Write a program to Marge sorted arrays
#include <stdio.h>
#include <stdlib.h>  // For malloc() and free()

// Function to merge two sorted arrays into a single sorted array
void mergeSortedArrays(int *arr1, int size1, int *arr2, int size2, int *mergedArr) {
    int i = 0, j = 0, k = 0;

    // Merge elements in sorted order
    while (i < size1 && j < size2) {
        if (arr1[i] <= arr2[j]) {
            mergedArr[k++] = arr1[i++];
        } else {
            mergedArr[k++] = arr2[j++];
        }
    }

    // Copy remaining elements of arr1 (if any)
    while (i < size1) {
        mergedArr[k++] = arr1[i++];
    }

    // Copy remaining elements of arr2 (if any)
    while (j < size2) {
        mergedArr[k++] = arr2[j++];
    }
}

int main() {
    int size1, size2;

    // Input size of first array
    printf("Enter size of first sorted array: ");
    scanf("%d", &size1);

    // Dynamic memory allocation for first array
    int *arr1 = (int *)malloc(size1 * sizeof(int));
    if (arr1 == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }

    // Input elements of first sorted array
    printf("Enter %d elements (in sorted order) for first array:\n", size1);
    for (int i = 0; i < size1; i++) {
        scanf("%d", &arr1[i]);
    }

    // Input size of second array
    printf("Enter size of second sorted array: ");
    scanf("%d", &size2);

    // Dynamic memory allocation for second array
    int *arr2 = (int *)malloc(size2 * sizeof(int));
    if (arr2 == NULL) {
        printf("Memory allocation failed!\n");
        free(arr1);
        return 1;
    }

    // Input elements of second sorted array
    printf("Enter %d elements (in sorted order) for second array:\n", size2);
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

    // Merge the two sorted arrays
    mergeSortedArrays(arr1, size1, arr2, size2, mergedArr);

    // Display merged sorted array
    printf("\nMerged Sorted Array:\n");
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
