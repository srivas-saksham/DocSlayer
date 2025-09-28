// Write a program to insert a number at a given location in an array.
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

void arrInsert(int arr[], int num, int pos) {
    if (pos < 1 || pos > arrLen + 1) {
        printf("Invalid position!\n");
        return;
    }

    if (arrLen >= MAX_SIZE) {
        printf("Array is full! Cannot insert.\n");
        return;
    }

    for (int i = arrLen; i >= pos; i--) {
        arr[i] = arr[i - 1];
    }
    arr[pos - 1] = num;
    arrLen++;

    printf("Updated Array: ");
    arrPrint(arr);
}

int main() {
    int arr[MAX_SIZE], num, pos;

    printf("Enter Number of Elements in Array: ");
    scanf("%d", &arrLen);

    for (int i = 0; i < arrLen; i++) {
        printf("Enter Element %d: ", i + 1);
        scanf("%d", &arr[i]);
    }

    printf("Enter element to insert: ");
    scanf("%d", &num);
    printf("Enter position: ");
    scanf("%d", &pos);

    arrInsert(arr, num, pos);
    
    return 0;
}
