/*WAP to implement Singly Linked List that stores data as integer and perform following operations:
Traverse the list to display each element
Search for a specific element in the list*/

#include <stdio.h>
#include <stdlib.h>

//Structure for a node in the singly linked list
struct Node {
    int data;       //Stores integer data
    struct Node* next;  //Pointer to the next node
};

//Function to insert a node at the end of the list
void insertNode(struct Node** head, int value) {
    //Create a new node
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;

    //If the list is empty, make the new node the head
    if (*head == NULL) {
        *head = newNode;
        return;
    }

    //Traverse to the last node
    struct Node* temp = *head;
    while (temp->next != NULL) {
        temp = temp->next;
    }

    //Insert the new node at the end
    temp->next = newNode;
}

//Function to traverse and display all elements in the list
void traverseList(struct Node* head) {
    struct Node* temp = head;

    //If list is empty
    if (temp == NULL) {
        printf("List is empty!\n");
        return;
    }

    printf("Linked List Elements: ");
    while (temp != NULL) {
        printf("%d ", temp->data);
        temp = temp->next;
    }
    printf("\n");
}

//Function to search for an element in the list
void searchElement(struct Node* head, int key) {
    struct Node* temp = head;
    int position = 1;

    while (temp != NULL) {
        if (temp->data == key) {
            printf("Element %d found at position %d.\n", key, position);
            return;
        }
        temp = temp->next;
        position++;
    }

    printf("Element %d not found in the list.\n", key);
}

int main() {
    struct Node* head = NULL;
    int n, value, searchKey;

    //Prompt user for number of elements
    printf("Enter the number of elements to insert: ");
    scanf("%d", &n);

    //Insert elements into the linked list
    printf("Enter %d elements: \n", n);
    for (int i = 0; i < n; i++) {
        printf("Enter Element %d: ", i+1);
        scanf("%d", &value);
        insertNode(&head, value);
    }

    //Display the linked list
    traverseList(head);

    //Search for the element in the linked list
    printf("Enter the element to search: ");
    scanf("%d", &searchKey);
    searchElement(head, searchKey);

    return 0;
}
