/*WAP to implement Circular Linked List with Operations: 
 Insertion (Start Between End)
 Deletion (Start Between End)
 Traverse
 Linear Search*/

 #include <stdio.h>
 #include <stdlib.h>
 
 // Node structure
 struct Node {
     int data;
     struct Node* next;
 };
 
 // Circular Linked List structure
 struct CircularList {
     struct Node* head;
 };
 
 // Function to create an empty circular linked list
 struct CircularList* createCircularList() {
     struct CircularList* clist = (struct CircularList*)malloc(sizeof(struct CircularList));
     clist->head = NULL;
     return clist;
 }
 
 // Function to insert a node at the beginning
 void insertBeg(struct CircularList* clist, int value) {
     struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
     newNode->data = value;
 
     if (clist->head == NULL) { 
         newNode->next = newNode;
         clist->head = newNode;
     } else {
         struct Node* temp = clist->head;
         while (temp->next != clist->head) {
             temp = temp->next;
         }
         newNode->next = clist->head;
         temp->next = newNode;
         clist->head = newNode;
     }
 }
 
 // Function to insert a node at the end
 void insertEnd(struct CircularList* clist, int value) {
     struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
     newNode->data = value;
 
     if (clist->head == NULL) {
         newNode->next = newNode;
         clist->head = newNode;
     } else {
         struct Node* temp = clist->head;
         while (temp->next != clist->head) {
             temp = temp->next;
         }
         temp->next = newNode;
         newNode->next = clist->head;
     }
 }
 
 // Function to insert a node at a given position
 void insertPos(struct CircularList* clist, int value, int position) {
     if (position < 1) {
         printf("Invalid position!\n");
         return;
     }
 
     if (position == 1) {
         insertBeg(clist, value);
         return;
     }
 
     struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
     newNode->data = value;
     
     struct Node* temp = clist->head;
     for (int i = 1; i < position - 1; i++) {
         if (temp->next == clist->head) {
             printf("Position out of range!\n");
             free(newNode);
             return;
         }
         temp = temp->next;
     }
 
     newNode->next = temp->next;
     temp->next = newNode;
 }
 
 // Function to delete a node from the beginning
 void deleteBeg(struct CircularList* clist) {
     if (clist->head == NULL) {
         printf("List is empty!\n");
         return;
     }
 
     struct Node* temp = clist->head;
     struct Node* last = clist->head;
 
     if (clist->head->next == clist->head) { 
         clist->head = NULL;
     } else {
         while (last->next != clist->head) {
             last = last->next;
         }
         clist->head = clist->head->next;
         last->next = clist->head;
     }
     free(temp);
 }
 
 // Function to delete a node from the end
 void deleteEnd(struct CircularList* clist) {
     if (clist->head == NULL) {
         printf("List is empty!\n");
         return;
     }
 
     struct Node* temp = clist->head;
     struct Node* prev = NULL;
 
     if (clist->head->next == clist->head) { 
         clist->head = NULL;
     } else {
         while (temp->next != clist->head) {
             prev = temp;
             temp = temp->next;
         }
         prev->next = clist->head;
     }
     free(temp);
 }
 
 // Function to delete a node from a given position
 void deletePos(struct CircularList* clist, int position) {
     if (clist->head == NULL || position < 1) {
         printf("List is empty or invalid position!\n");
         return;
     }
 
     struct Node* temp = clist->head;
     struct Node* prev = NULL;
 
     if (position == 1) {
         deleteBeg(clist);
         return;
     }
 
     for (int i = 1; i < position; i++) {
         prev = temp;
         temp = temp->next;
         if (temp == clist->head) {
             printf("Position out of range!\n");
             return;
         }
     }
 
     prev->next = temp->next;
     free(temp);
 }
 
 // Function to traverse and display the circular linked list
 void traverseList(struct CircularList* clist) {
     if (clist->head == NULL) {
         printf("List is empty!\n");
         return;
     }
 
     struct Node* temp = clist->head;
     printf("Circular Linked List: ");
     do {
         printf("%d -> ", temp->data);
         temp = temp->next;
     } while (temp != clist->head);
     printf("(Back to Start)\n");
 }
 
 // Function to search for an element in the list
 void searchElement(struct CircularList* clist, int key) {
     if (clist->head == NULL) {
         printf("List is empty!\n");
         return;
     }
 
     struct Node* temp = clist->head;
     int pos = 1;
     do {
         if (temp->data == key) {
             printf("Element %d found at position %d\n", key, pos);
             return;
         }
         temp = temp->next;
         pos++;
     } while (temp != clist->head);
 
     printf("Element %d not found in the list.\n", key);
 }
 
 // Main function
 int main() {
     struct CircularList* clist = createCircularList();
     int n, value, choice, pos;
 
     printf("Enter the number of elements: ");
     scanf("%d", &n);
 
     for (int i = 0; i < n; i++) {
        printf("Enter Element %d: ", i+1);
        scanf("%d", &value);
        insertEnd(clist, value);
    }
 
     traverseList(clist);
 
     while (1) {
         printf("\nOperations:\n");
         printf("1. Insert at beginning\n2. Insert at end\n3. Insert at position\n");
         printf("4. Delete from beginning\n5. Delete from end\n6. Delete from position\n");
         printf("7. Search element\n8. Traverse list\n9. Exit\n");
         printf("Enter your choice: ");
         scanf("%d", &choice);
 
         switch (choice) {
             case 1:
                 printf("Enter value to insert at beginning: ");
                 scanf("%d", &value);
                 insertBeg(clist, value);
                 traverseList(clist);
                 break;
 
             case 2:
                 printf("Enter value to insert at end: ");
                 scanf("%d", &value);
                 insertEnd(clist, value);
                 traverseList(clist);
                 break;
 
             case 3:
                 printf("Enter value and position to insert: ");
                 scanf("%d %d", &value, &pos);
                 insertPos(clist, value, pos);
                 traverseList(clist);
                 break;
 
             case 4:
                 deleteBeg(clist);
                 traverseList(clist);
                 break;
 
             case 5:
                 deleteEnd(clist);
                 traverseList(clist);
                 break;
 
             case 6:
                 printf("Enter position to delete: ");
                 scanf("%d", &pos);
                 deletePos(clist, pos);
                 traverseList(clist);
                 break;
 
             case 7:
                 printf("Enter value to search: ");
                 scanf("%d", &value);
                 searchElement(clist, value);
                 break;
 
             case 8:
                 traverseList(clist);
                 break;
 
             case 9:
                 printf("Exiting...\n");
                 return 0;
 
             default:
                 printf("Invalid choice! Please try again.\n");
         }
     }
 
     return 0;
 }
 