#include <stdio.h>
#include <stdlib.h>

// Structure for a node in the singly linked list
struct Node {
    int data;
    struct Node* next;
};

// Function to display all elements in the list
void printList(struct Node* head) {
    struct Node* temp = head;

    if (temp == NULL) {
        printf("List is empty!\n\n");
        return;
    }

    printf("Linked List Elements: ");
    while (temp != NULL) {
        printf("%d ", temp->data);
        temp = temp->next;
    }
    printf("\n\n");
}

// Function to insert a node at the end of the list
void insertNode(struct Node** head, int value){
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;

    if (*head == NULL){
        *head = newNode;
        return;
    }

    struct Node* temp = *head;
    while (temp->next != NULL){
        temp = temp->next;
    }

    temp->next = newNode;
}

// Insert at the beginning
void insertBeg(struct Node** head, int val){
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = *head;
    *head = newNode;
}

// Insert at the end (with head pointer check)
void insertEnd(struct Node** head, int val){
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = NULL;

    if (*head == NULL) {
        *head = newNode;
        return;
    }

    struct Node* temp = *head;
    while (temp->next != NULL){
        temp = temp->next;
    }

    temp->next = newNode;
}

// Insert after a given position (1-based)
void insertAfter(struct Node* head, int val, int pos){
    struct Node* temp = head;
    int count = 1;

    while (count < pos && temp != NULL){
        temp = temp->next;
        count++;
    }

    if (temp == NULL){
        printf("Invalid position to insert after.\n\n");
        return;
    }

    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = temp->next;
    temp->next = newNode;
}

// Insert before a given position (1-based)
void insertBefore(struct Node** head, int val, int pos) {
    if (pos <= 1 || *head == NULL) {
        insertBeg(head, val);
        return;
    }

    struct Node* temp = *head;
    int count = 1;

    while (count < pos - 1 && temp->next != NULL){
        temp = temp->next;
        count++;
    }

    if (temp->next == NULL){
        printf("Invalid position to insert before.\n\n");
        return;
    }

    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = temp->next;
    temp->next = newNode;
}

int main(){
    struct Node* head = NULL;
    int n, value;

    printf("Enter the number of elements to insert: ");
    scanf("%d", &n);

    printf("Enter %d elements:\n", n);
    for(int i = 0; i < n; i++){
        printf("Enter Element %d: ", i + 1);
        scanf("%d", &value);
        insertNode(&head, value);
    }

    printList(head);

    // Insert at beginning
    int newVal, pos;
    printf("Enter Element to Insert at Beginning: ");
    scanf("%d", &newVal);
    insertBeg(&head, newVal);
    printList(head);

    // Insert at end
    printf("Enter Element to Insert at End: ");
    scanf("%d", &newVal);
    insertEnd(&head, newVal);
    printList(head);

    // Insert after a given position
    printf("Enter Element to Insert: ");
    scanf("%d", &newVal);
    printf("Enter Position After which to Insert (1-based): ");
    scanf("%d", &pos);
    insertAfter(head, newVal, pos);
    printList(head);

    // Insert before a given position
    printf("Enter Element to Insert: ");
    scanf("%d", &newVal);
    printf("Enter Position Before which to Insert (1-based): ");
    scanf("%d", &pos);
    insertBefore(&head, newVal, pos);
    printList(head);

    return 0;
}
