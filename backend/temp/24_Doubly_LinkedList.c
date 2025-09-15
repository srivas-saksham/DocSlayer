#include <stdio.h>
#include <stdlib.h>

struct Node {
    struct Node *prev;
    int data;
    struct Node *next;
};

// Function to insert a node at the end of the list
struct Node* insertNode(struct Node* head, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->prev = NULL;
    newNode->data = value;
    newNode->next = NULL;

    // If the list is empty, make the new node the head
    if (head == NULL) {
        return newNode;  // Return the new head
    }

    struct Node* temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }

    temp->next = newNode;
    newNode->prev = temp;

    return head;  // Return the updated head
}

// Function to display all elements in the list
void printList(struct Node* head) {
    if (head == NULL) {
        printf("List is empty!\n");
        return;
    }

    struct Node* temp = head;
    printf("Linked List Elements: ");
    while (temp != NULL) {
        printf("%d ", temp->data);
        temp = temp->next;
    }
    printf("\n");
}

// Function to search for a specific element in the list
void searchList(struct Node* head, int key) {
    struct Node* temp = head;
    int pos = 1;

    while (temp != NULL) {
        if (temp->data == key) {
            printf("Element %d found at position %d\n", key, pos);
            return;
        }
        temp = temp->next;
        pos++;
    }

    printf("Element %d not found in the list\n", key);
}

int main() {
    struct Node* start = NULL;
    int n, value, key;

    printf("Enter the number of elements to insert: ");
    scanf("%d", &n);

    printf("Enter %d elements: \n", n);
    for (int i = 0; i < n; i++) {
        printf("Enter Element %d: ", i + 1);
        scanf("%d", &value);
        start = insertNode(start, value);  // Fix: Update start with the new head
    }

    printf("\nThe List is: \n");
    printList(start);

    // Search for an element
    printf("\nEnter the element to search for: ");
    scanf("%d", &key);
    searchList(start, key);

    return 0;  // Fix: Standard return statement for main()
}
