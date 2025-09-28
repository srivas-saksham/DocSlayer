// WAP to perform stack operations (push, pop, peek, display) using a dynamic stack (linked list)
#include <stdio.h>
#include <stdlib.h>

typedef struct ListNode {
    int data;
    struct ListNode* next;
} NODE;

NODE* createNode(int val) {
    NODE* newNode = (NODE*)malloc(sizeof(NODE));
    newNode->data = val;
    newNode->next = NULL;
    return newNode;
}

void push(NODE** head, int val) {
    NODE* newNode = createNode(val);
    newNode->next = *head;
    *head = newNode;
    printf("Element %d Pushed Successfully!\n", val);
}

int pop(NODE** head) {
    if (*head == NULL) {
        printf("Stack Underflow!\n");
        return -1;
    }

    NODE* temp = *head;
    int val = temp->data;
    *head = (*head)->next; 
    free(temp);

    printf("Element %d Popped Successfully!\n", val);
    return val;
}

int peek(NODE* head) {
    if (head == NULL) {
        printf("Stack is Empty!\n");
        return -1;
    }

    return head->data;
}

void display(NODE* head) {
    if (head == NULL) {
        printf("Stack is Empty!\n");
        return;
    }

    NODE* temp = head;
    printf("Stack Elements: ");
    while (temp != NULL) {
        printf("%d ", temp->data);
        temp = temp->next;
    }
    printf("\n");
}

int main() {
    NODE* head = NULL;
    int choice, val;

    while (1) {
        printf("\n1) Push Element\n");
        printf("2) Pop Element\n");
        printf("3) Peek Element\n");
        printf("4) Display Stack\n");
        printf("0) Exit\n");
        printf("\nEnter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter Value to Push: ");
                scanf("%d", &val);
                push(&head, val);
                break;

            case 2:
                val = pop(&head);
                if (val != -1) {
                    printf("Popped Element: %d\n", val);
                }
                break;

            case 3:
                val = peek(head);
                if (val != -1) {
                    printf("Top Element: %d\n", val);
                }
                break;

            case 4:
                display(head);
                break;

            case 0:
                printf("Exiting Program.\n");
                exit(0);

            default:
                printf("Invalid Choice! Please try again.\n");
        }
    }

    return 0;
}

