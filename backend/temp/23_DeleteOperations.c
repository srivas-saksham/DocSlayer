#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

// Insert node at the end
void insertNode(struct Node** head, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;

    if (*head == NULL) {
        *head = newNode;
        return;
    }

    struct Node* temp = *head;
    while (temp->next != NULL) {
        temp = temp->next;
    }

    temp->next = newNode;
}

// Display the list
void printList(struct Node* head) {
    if (head == NULL) {
        printf("List is empty!\n\n");
        return;
    }

    printf("Linked List Elements: ");
    while (head != NULL) {
        printf("%d ", head->data);
        head = head->next;
    }
    printf("\n\n");
}

// Delete first node
struct Node* deleteFirst(struct Node* head) {
    if (head == NULL) {
        printf("List is already empty.\n");
        return NULL;
    }

    struct Node* temp = head;
    head = head->next;
    free(temp);

    return head;
}

// Delete last node
struct Node* deleteLast(struct Node* head) {
    if (head == NULL) {
        printf("List is already empty.\n");
        return NULL;
    }

    if (head->next == NULL) {
        free(head);
        return NULL;
    }

    struct Node* temp = head;
    while (temp->next->next != NULL) {
        temp = temp->next;
    }

    free(temp->next);
    temp->next = NULL;

    return head;
}

// Delete node after a given value
struct Node* deleteAfter(struct Node* head, int val) {
    struct Node* temp = head;

    while (temp != NULL && temp->data != val) {
        temp = temp->next;
    }

    if (temp == NULL || temp->next == NULL) {
        printf("No node found after value %d.\n", val);
        return head;
    }

    struct Node* toDelete = temp->next;
    temp->next = toDelete->next;
    free(toDelete);

    return head;
}

// Delete a node with specific value (search and delete)
struct Node* deleteValue(struct Node* head, int val) {
    if (head == NULL) {
        printf("List is empty.\n");
        return NULL;
    }

    // If value is in the head node
    if (head->data == val) {
        struct Node* temp = head;
        head = head->next;
        free(temp);
        return head;
    }

    struct Node* temp = head;
    while (temp->next != NULL && temp->next->data != val) {
        temp = temp->next;
    }

    if (temp->next == NULL) {
        printf("Element %d not found in the list.\n", val);
        return head;
    }

    struct Node* toDelete = temp->next;
    temp->next = toDelete->next;
    free(toDelete);

    return head;
}

// Main function
int main() {
    struct Node* start = NULL;
    int n, value;

    printf("Enter the number of elements to insert: ");
    scanf("%d", &n);

    printf("Enter %d elements:\n", n);
    for (int i = 0; i < n; i++) {
        printf("Enter Element %d: ", i + 1);
        scanf("%d", &value);
        insertNode(&start, value);
    }

    printList(start);

    // Delete First Node
    printf("Deleting First Node...\n");
    start = deleteFirst(start);
    printList(start);

    // Delete Last Node
    printf("Deleting Last Node...\n");
    start = deleteLast(start);
    printList(start);

    // Delete After Value
    printf("Enter Value whose next node is to be deleted: ");
    scanf("%d", &value);
    start = deleteAfter(start, value);
    printList(start);

    // Search and Delete a Value
    printf("Enter the Element to Delete (Search and Delete): ");
    scanf("%d", &value);
    start = deleteValue(start, value);
    printList(start);

    return 0;
}
