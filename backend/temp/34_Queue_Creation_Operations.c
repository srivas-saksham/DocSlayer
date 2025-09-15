// WAP to perform different operations with Queue such as Insert, Delete, Display of elements using dynamically allocated array (Linear Queue)

#include <stdio.h>
#include <stdlib.h>

int front = -1, rear = -1;

// Enqueue Operation
int enqueue(int* queue, int val, int size) {
    if (rear == size - 1) {
        printf("Queue Overflow!\n");
        return 0;
    } else {
        if (front == -1)
            front = 0;
        rear++;
        queue[rear] = val;
        printf("Element Inserted Successfully!\n");
        return 1;
    }
}

// Dequeue Operation
int dequeue(int* queue) {
    if (front == -1 || front > rear) {
        printf("Queue Underflow!\n");
        return -1;
    } else {
        int deleted = queue[front];
        front++;
        if (front > rear) {
            // Reset queue if it's now empty
            front = -1;
            rear = -1;
        }
        return deleted;
    }
}

// Display Queue Elements
void displayQ(int* queue) {
    if (front == -1 || front > rear) {
        printf("Queue is empty.\n");
    } else {
        printf("Queue elements: ");
        for (int i = front; i <= rear; i++) {
            printf("%d ", queue[i]);
        }
        printf("\n");
    }
}

int main() {
    int size;
    printf("Enter Size of Queue: ");
    scanf("%d", &size);

    int* queue = (int*)malloc(size * sizeof(int));
    if (!queue) {
        printf("Memory allocation failed!\n");
        return 1;
    }

    int choice;
    while (1) {
        printf("\n1) Enqueue Element");
        printf("\n2) Dequeue Element");
        printf("\n3) Display Elements");
        printf("\n0) Exit");
        printf("\n\nEnter Choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1: {
                int val;
                printf("Enter Value: ");
                scanf("%d", &val);
                enqueue(queue, val, size);
                break;
            }

            case 2: {
                int delVal = dequeue(queue);
                if (delVal != -1)
                    printf("Deleted Element: %d\n", delVal);
                break;
            }

            case 3:
                displayQ(queue);
                break;

            case 0:
                printf("Exiting Program.\n");
                free(queue);
                exit(0);

            default:
                printf("Invalid Choice. Please try again.\n");
        }
    }

    return 0;
}
