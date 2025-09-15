// Write a Program to implement Binary Search
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

void arrSort(int arr[]) {
    for (int i = 0; i < arrLen - 1; i++) {
        for (int j = i + 1; j < arrLen; j++) {
            if (arr[i] > arr[j]) {
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    printf("Sorted Array: ");
    arrPrint(arr);
}

void arrBiSearch(int arr[], int num) {
    int low = 0, high = arrLen - 1, mid;

    while (low <= high) {
        mid = (low + high) / 2;

        if (arr[mid] == num) {
            printf("Element found at Position: %d\n", mid + 1);
            return;
        } else if (arr[mid] < num) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    printf("Element not found!\n");
}

int main() {
    int arr[MAX_SIZE], num;

    printf("Enter Number of Elements in Array: ");
    scanf("%d", &arrLen);

    for (int i = 0; i < arrLen; i++) {
        printf("Enter Element %d: ", i + 1);
        scanf("%d", &arr[i]);
    }

    arrSort(arr);

    printf("Enter element to search: ");
    scanf("%d", &num);

    arrBiSearch(arr, num);

    return 0;
}
