// WAP to perform stack operations (enqueue, dequeue, display) using a dynamic queue (linked list)
#include <stdio.h>
#include <stdlib.h>

typedef struct ListNode {
    int data;
    struct ListNode* next;
} NODE;

// Function to create a new node
NODE* createNode(int val) {
    NODE* newNode = (NODE*)malloc(sizeof(NODE));
    newNode->data = val;
    newNode->next = NULL;
    return newNode;
}

// Enqueue operation
int enqueue(NODE** front, NODE** rear, int val) {
    NODE* newNode = createNode(val);

    if (*rear == NULL) {
        *front = newNode;
        *rear = newNode;
    } else {
        (*rear)->next = newNode;
        *rear = newNode;
    }

    printf("Element %d inserted successfully!\n", val);
    return 1;
}

// Dequeue operation
int dequeue(NODE** front, NODE** rear) {
    if (*front == NULL) {
        printf("Queue Underflow!\n");
        return -1;
    }

    int val = (*front)->data;
    NODE* temp = *front;
    *front = (*front)->next;

    if (*front == NULL)
        *rear = NULL;

    free(temp);
    return val;
}

// Display queue
void display(NODE* head) {
    if (head == NULL) {
        printf("Queue is Empty!\n");
        return;
    }

    NODE* temp = head;
    printf("Queue Elements: ");
    while (temp != NULL) {
        printf("%d ", temp->data);
        temp = temp->next;
    }
    printf("\n");
}

// Main menu-driven system
int main() {
    NODE* front = NULL;
    NODE* rear = NULL;
    int choice, val;

    while (1) {
        printf("\n====== Queue Operations Menu ======\n");
        printf("1) Enqueue Element\n");
        printf("2) Dequeue Element\n");
        printf("3) Display Queue\n");
        printf("0) Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter value to insert: ");
                scanf("%d", &val);
                enqueue(&front, &rear, val);
                break;

            case 2:
                val = dequeue(&front, &rear);
                if (val != -1)
                    printf("Deleted Element: %d\n", val);
                break;

            case 3:
                display(front);
                break;

            case 0:
                printf("Exiting program. Goodbye!\n");
                exit(0);

            default:
                printf("Invalid choice. Please try again.\n");
        }
    }

    return 0;
}
