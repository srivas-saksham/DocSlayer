// WAP to implement a SIngly Linked List that sotres data as intee and perform following operations:
// Create a new ist that is reverse of the first linked list

#include <stdio.h>
#include <stdlib.h>

struct Node{
    int data;
    struct Node *next;
};

//Function to insert a node at the end of the list
void insertNode(struct Node** head, int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;

    //If the list is empty, make the new node the head
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

// Funtion to insert a node in the beginning
void insertBeg(struct Node** head, int val){
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = *head;
    *head = newNode;
}

void reverseLL(struct Node *start) {
    struct Node *ptr = start;
    struct Node *revLL = NULL;
    
    int i = 0;
    int value;
    while(ptr != NULL){
        value = ptr->data;
        insertBeg(&revLL, value);
        ptr = ptr->next;
    }

    printf("\nReversed List is: \n");
    printList(revLL);

}

int main() {
    struct Node* head = NULL;
    int n, value;

    printf("Enter the number of elements to insert: ");
    scanf("%d", &n);

    printf("Enter %d elements: \n", n);
    for (int i = 0; i < n; i++) {
        printf("Enter Element %d: ", i+1);
        scanf("%d", &value);
        insertNode(&head, value);
    }

    reverseLL(head);
    return 0;
}