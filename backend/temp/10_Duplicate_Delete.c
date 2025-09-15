// Write a Program to perform elimination of duplicate elements from an existing list of elements.
#include <stdio.h>

#define MAX_SIZE 100  // Define a maximum size for safety

int arrLen;

void arrPrint(int arr[]) {
    printf("\n");
    for (int i = 0; i < arrLen; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

void arrDelete(int arr[], int pos) {
    for (int i = pos - 1; i < arrLen - 1; i++) {
        arr[i] = arr[i + 1];
    }
    arrLen--;
}

void arrElmDup(int arr[]) {
    for (int i = 0; i < arrLen; i++) {
        for (int j = i + 1; j < arrLen; ) {
            if (arr[i] == arr[j]) {
                arrDelete(arr, j + 1);
            } else {
                j++;  // Only increment when no deletion occurs
            }
        }
    }

    printf("Updated Array: ");
    arrPrint(arr);
}

int main() {
    int arr[MAX_SIZE];

    printf("Enter Number of Elements in Array: ");
    scanf("%d", &arrLen);

    for (int i = 0; i < arrLen; i++) {
        printf("Enter Element %d: ", i + 1);
        scanf("%d", &arr[i]);
    }

    arrElmDup(arr);

    return 0;
}
