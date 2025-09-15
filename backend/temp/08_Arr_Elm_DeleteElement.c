// Write a program to search a number in an array and delete it, if found.
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

void arrSearchDel(int arr[], int num) {
    int pos = -1;
    for (int i = 0; i < arrLen; i++) {
        if (arr[i] == num) {
            pos = i + 1;
            break;
        }
    }

    if (pos == -1) {
        printf("Element not found!\n");
        return;
    }

    arrDelete(arr, pos);
    printf("Updated Array: ");
    arrPrint(arr);
}

int main() {
    int arr[MAX_SIZE], num;

    printf("Enter Number of Elements in Array: ");
    scanf("%d", &arrLen);

    for (int i = 0; i < arrLen; i++) {
        printf("Enter Element %d: ", i + 1);
        scanf("%d", &arr[i]);
    }

    printf("Enter element to search and delete: ");
    scanf("%d", &num);

    arrSearchDel(arr, num);

    return 0;
}
