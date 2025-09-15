// WAP to implement Priority Queue with 3 priority values as -- 1: Low, 2: Medium, 3: High
#include <stdio.h>
#include <stdlib.h>

#define MAX 100

typedef struct {
    int data;
    int priority;  // 1: Low, 2: Medium, 3: High
} Element;

Element queue[MAX];
int size = 0;

void enqueue(int data, int priority) {
    if (size == MAX) {
        printf("Queue Overflow!\n");
        return;
    }

    queue[size].data = data;
    queue[size].priority = priority;
    size++;

    printf("Element %d with priority %d inserted successfully!\n", data, priority);
}

void dequeue() {
    if (size == 0) {
        printf("Queue Underflow!\n");
        return;
    }

    int highest = -1;
    int index = -1;
    for (int i = 0; i < size; i++) {
        if (queue[i].priority > highest) {
            highest = queue[i].priority;
            index = i;
        }
    }

    printf("Dequeued Element: %d (Priority: %d)\n", queue[index].data, queue[index].priority);
    for (int i = index; i < size - 1; i++) {
        queue[i] = queue[i + 1];
    }
    size--;
}

void display() {
    if (size == 0) {
        printf("Queue is empty.\n");
        return;
    }

    printf("Queue Elements [Data (Priority)]:\n");
    for (int i = 0; i < size; i++) {
        printf("%d (%d)  ", queue[i].data, queue[i].priority);
    }
    printf("\n");
}

int main() {
    int choice, data, priority;

    while (1) {
        printf("\n----- Priority Queue Menu -----\n");
        printf("1) Enqueue Element\n");
        printf("2) Dequeue Element\n");
        printf("3) Display Queue\n");
        printf("0) Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter value: ");
                scanf("%d", &data);
                printf("Enter priority (1: Low, 2: Medium, 3: High): ");
                scanf("%d", &priority);
                enqueue(data, priority);
                break;

            case 2:
                dequeue();
                break;

            case 3:
                display();
                break;

            case 0:
                printf("Exiting program.\n");
                exit(0);

            default:
                printf("Invalid choice. Try again.\n");
        }
    }

    return 0;
}
