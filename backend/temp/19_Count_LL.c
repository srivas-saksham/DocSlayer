/*WAP to implement Singly Linked List that stores data as integer and perform following operations:
Count the number of nodes in the list
Find minimum and maximum value in the linked list.*/

#include <stdio.h>
#include <stdlib.h>

//Structure fora node in the singly linked list
struct Node {
    int data;       //Stores integer data
    struct Node* next;  //Pointer to the next node
};

//Function to insert a node at the end of the list
void insertNode(struct Node** head, int value){
    //Create a new node
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;

    //ifthe list is empty, make the new node the head
    if(*head == NULL){
        *head = newNode;
        return;
    }

    //Traverse to the last node
    struct Node* temp = *head;
    while(temp->next != NULL){
        temp = temp->next;
    }

    //Insert the new node at the end
    temp->next = newNode;
}

//Function to count elements in list
void countListElm(struct Node* head){
    struct Node* temp = head;
    int count = 0;
    if(temp == NULL){
        printf("List is empty!\n");
        return;
    }
    while(temp != NULL){
        count++;
        temp = temp->next;
    }
    printf("Total Elements = %d\n", count);
}

//Function to Find Max and Min number in List
void maxMinList(struct Node* head) {
    if (head == NULL) {  // Check if the list is empty
        printf("Empty List\n");
        return;
    }

    struct Node* temp = head;
    int max = temp->data;
    int min = temp->data;

    while (temp != NULL) {
        if (temp->data > max) {
            max = temp->data;
        }
        if (temp->data < min) {
            min = temp->data;
        }
        temp = temp->next; // Move to the next node
    }

    printf("Maximum Element in List is %d\n", max);
    printf("Minimum Element in List is %d\n", min);
}

int main(){
    struct Node* head = NULL;
    int n, value, searchKey;

    //Prompt user for number of elements
    printf("Enter the number of elements to insert: ");
    scanf("%d", &n);

    //Insert elements into the linked list
    printf("Enter %d elements: \n", n);
    for(int i = 0; i < n; i++){
        printf("Enter Element %d: ", i+1);
        scanf("%d", &value);
        insertNode(&head, value);
    }

    //Display the linked list
    countListElm(head);

    //Search for the Maximum and Mimimum element in the linked list
    maxMinList(head);

    return 0;
}
