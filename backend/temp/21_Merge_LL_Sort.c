/*WAP to implement two Singly Linked List that stores data as integer and perform following operation:
Merge the two lists to create a new sorted list*/

#include <stdio.h>
#include <stdlib.h>

// Structure for a node in the singly linked list
struct Node {
    int data;           // Stores integer data
    struct Node* next;  // Pointer to the next node
};

// Function to insert a node at the end of the list
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

// Function to merge two sorted linked lists into a new sorted list
struct Node* mergeSortedLists(struct Node* list1, struct Node* list2) {
    // Create a dummy node to simplify merging
    struct Node dummy;
    struct Node* tail = &dummy;
    dummy.next = NULL;

    while (list1 != NULL && list2 != NULL) {
        if (list1->data <= list2->data) {
            tail->next = list1;
            list1 = list1->next;
        } else {
            tail->next = list2;
            list2 = list2->next;
        }
        tail = tail->next;
    }

    // Attach remaining elements
    if (list1 != NULL) {
        tail->next = list1;
    } else {
        tail->next = list2;
    }

    return dummy.next;
}

// Main function
int main() {
    struct Node* head1 = NULL;
    struct Node* head2 = NULL;
    struct Node* mergedHead = NULL;
    int n, value;

    // Creating first linked list
    printf("Enter the number of elements for first sorted list: ");
    scanf("%d", &n);
    printf("Enter %d elements in sorted order:\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &value);
        insertNode(&head1, value);
    }

    // Creating second linked list
    printf("\nEnter the number of elements for second sorted list: ");
    scanf("%d", &n);
    printf("Enter %d elements in sorted order:\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &value);
        insertNode(&head2, value);
    }

    // Merging the two sorted lists
    mergedHead = mergeSortedLists(head1, head2);

    // Display the merged sorted list
    printf("\nMerged Sorted List:\n");
    printList(mergedHead);

    return 0;
}
