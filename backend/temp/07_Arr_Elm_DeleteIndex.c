// Write a program to delete a number from a given location in an array.
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
    if (pos < 1 || pos > arrLen) {
        printf("Invalid position!\n");
        return;
    }

    for (int i = pos - 1; i < arrLen - 1; i++) {
        arr[i] = arr[i + 1];
    }
    arrLen--;

    printf("Updated Array: ");
    arrPrint(arr);
}

int main() {
    int arr[MAX_SIZE], pos;

    printf("Enter Number of Elements in Array: ");
    scanf("%d", &arrLen);

    for (int i = 0; i < arrLen; i++) {
        printf("Enter Element %d: ", i + 1);
        scanf("%d", &arr[i]);
    }

    printf("Enter position to delete: ");
    scanf("%d", &pos);

    arrDelete(arr, pos);

    return 0;
}
