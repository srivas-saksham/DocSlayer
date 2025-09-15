/*WAP to implement Header Linked List with Operations: 
 Insertion (Start Between End)
 Deletion (Start Between End)
 Traverse*/

#include <stdio.h>
#include <stdlib.h>

// Node structure
struct Node {
    int data;
    struct Node* next;
};

// Header Linked List structure
struct HeaderList {
    int count;
    struct Node* head;
};

// Function to create a header linked list
struct HeaderList* createHeaderList() {
    struct HeaderList* hlist = (struct HeaderList*)malloc(sizeof(struct HeaderList));
    hlist->count = 0;
    hlist->head = NULL;
    return hlist;
}

// Function to insert a node at the start
void insertBeg(struct HeaderList* hlist, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = hlist->head;
    hlist->head = newNode;
    hlist->count++;
}

// Function to insert a node at the end
void insertEnd(struct HeaderList* hlist, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;

    if (hlist->head == NULL) {
        hlist->head = newNode;
    } else {
        struct Node* temp = hlist->head;
        while (temp->next != NULL) {
            temp = temp->next;
        }
        temp->next = newNode;
    }
    hlist->count++;
}

// Function to insert a node at a given position
void insertPos(struct HeaderList* hlist, int value, int position) {
    if (position < 1 || position > hlist->count + 1) {
        printf("Invalid position!\n");
        return;
    }

    if (position == 1) {
        insertBeg(hlist, value);
        return;
    }

    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;

    struct Node* temp = hlist->head;
    for (int i = 1; i < position - 1; i++) {
        temp = temp->next;
    }

    newNode->next = temp->next;
    temp->next = newNode;
    hlist->count++;
}

// Function to delete a node from the start
void deleteBeg(struct HeaderList* hlist) {
    if (hlist->head == NULL) {
        printf("List is empty!\n");
        return;
    }

    struct Node* temp = hlist->head;
    hlist->head = hlist->head->next;
    free(temp);
    hlist->count--;
}

// Function to delete a node from the end
void deleteEnd(struct HeaderList* hlist) {
    if (hlist->head == NULL) {
        printf("List is empty!\n");
        return;
    }

    struct Node* temp = hlist->head;
    struct Node* prev = NULL;

    if (temp->next == NULL) {
        hlist->head = NULL;
    } else {
        while (temp->next != NULL) {
            prev = temp;
            temp = temp->next;
        }
        prev->next = NULL;
    }

    free(temp);
    hlist->count--;
}

// Function to delete a node from a given position
void deletePos(struct HeaderList* hlist, int position) {
    if (position < 1 || position > hlist->count) {
        printf("Invalid position!\n");
        return;
    }

    if (position == 1) {
        deleteBeg(hlist);
        return;
    }

    struct Node* temp = hlist->head;
    struct Node* prev = NULL;

    for (int i = 1; i < position; i++) {
        prev = temp;
        temp = temp->next;
    }

    prev->next = temp->next;
    free(temp);
    hlist->count--;
}

// Function to traverse the linked list
void traverseList(struct HeaderList* hlist) {
    if (hlist->head == NULL) {
        printf("List is empty!\n");
        return;
    }

    struct Node* temp = hlist->head;
    printf("Linked List: ");
    while (temp != NULL) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\nTotal Nodes: %d\n", hlist->count);
}

// Main function
int main() {
    struct HeaderList* hlist = createHeaderList();
    int n, value, choice, pos;

    printf("Enter Number of Elements: ");
    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        printf("Enter Element %d: ", i+1);
        scanf("%d", &value);
        insertEnd(hlist, value);
    }

    traverseList(hlist);

    while (1) {
        printf("\nOperations:\n");
        printf("1. Insert at beginning\n2. Insert at end\n3. Insert at position\n");
        printf("4. Delete from beginning\n5. Delete from end\n6. Delete from position\n");
        printf("7. Traverse list\n8. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter value to insert at beginning: ");
                scanf("%d", &value);
                insertBeg(hlist, value);
                traverseList(hlist);
                break;

            case 2:
                printf("Enter value to insert at end: ");
                scanf("%d", &value);
                insertEnd(hlist, value);
                traverseList(hlist);
                break;

            case 3:
                printf("Enter value and position to insert: ");
                scanf("%d %d", &value, &pos);
                insertPos(hlist, value, pos);
                traverseList(hlist);
                break;

            case 4:
                deleteBeg(hlist);
                traverseList(hlist);
                break;

            case 5:
                deleteEnd(hlist);
                traverseList(hlist);
                break;

            case 6:
                printf("Enter position to delete: ");
                scanf("%d", &pos);
                deletePos(hlist, pos);
                traverseList(hlist);
                break;

            case 7:
                traverseList(hlist);
                break;

            case 8:
                printf("Exiting...\n");
                return 0;

            default:
                printf("Invalid choice! Please try again.\n");
        }
    }

    return 0;
}
 
