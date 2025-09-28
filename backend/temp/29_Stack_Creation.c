// WAP to perform pop, push, peek, operations on a stack using array.
#include <stdio.h>
#include <stdlib.h>

int top = -1;

int push(int stk[], int val, int maxSize) {
    if (top == maxSize - 1) {
        printf("Stack Overflow! Cannot push %d\n", val);
        return 0;
    }
    stk[++top] = val;
    return 1;
}

int pop(int stk[]) {
    if (top == -1) {
        printf("Stack Underflow! No elements to pop\n");
        return -1;
    }
    return stk[top--];
}

int peek(int stk[]) {
    if (top == -1) {
        printf("Stack is empty!\n");
        return -1;
    }
    printf("Top element: %d\n", stk[top]);
    return stk[top];
}

int main() {
    int len, i, elm, choice;
    
    printf("Stack Creation and Operations \n");
    printf("Enter number of elements in Stack: ");
    scanf("%d", &len);

    int *stk = (int*)malloc(len * sizeof(int));

    if (stk == NULL) {
        printf("Memory allocation failed\n");
        return 1;
    }

    for (i = 0; i < len; i++) {
        printf("Enter Element %d: ", i + 1);
        scanf("%d", &elm);
        push(stk, elm, len);
    }

    do {
        printf("\nChoose operation:\n");
        printf("1. Push\n2. Pop\n3. Peek\n4. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter value to push: ");
                scanf("%d", &elm);
                push(stk, elm, len);
                break;

            case 2:
                elm = pop(stk);
                if (elm != -1)
                    printf("Popped element: %d\n", elm);
                break;

            case 3:
                peek(stk);
                break;

            case 4:
                printf("Exiting...\n");
                break;

            default:
                printf("Invalid choice! Try again.\n");
        }
    } while (choice != 4);

    free(stk);
    return 0;
}
