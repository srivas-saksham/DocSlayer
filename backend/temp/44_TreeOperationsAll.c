/*WAP to implement following recursive operations on a Binary Search Tree (BST) 
a. Find an element
b. Insert an element
c. Delete an element 
d. Count the number of nodes
e. Find maximum element 
f. Find minimum element 
g. Find height of the tree*/

#include<stdio.h>
#include<stdlib.h>

struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

// Function to create a new node
struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->left = newNode->right = NULL;
    return newNode;
}

// Insert an element into BST
struct Node* insert(struct Node* root, int value) {
    if (root == NULL)
        return createNode(value);
    if (value < root->data)
        root->left = insert(root->left, value);
    else if (value > root->data)
        root->right = insert(root->right, value);
    return root;
}

// Find an element in BST
struct Node* find(struct Node* root, int value) {
    if (root == NULL || root->data == value)
        return root;
    if (value < root->data)
        return find(root->left, value);
    else
        return find(root->right, value);
}

// Find minimum value node
struct Node* findMin(struct Node* root) {
    if (root == NULL || root->left == NULL)
        return root;
    return findMin(root->left);
}

// Find maximum value node
struct Node* findMax(struct Node* root) {
    if (root == NULL || root->right == NULL)
        return root;
    return findMax(root->right);
}

// Delete an element from BST
struct Node* deleteNode(struct Node* root, int value) {
    if (root == NULL)
        return root;
    
    if (value < root->data)
        root->left = deleteNode(root->left, value);
    else if (value > root->data)
        root->right = deleteNode(root->right, value);
    else {
        // Node with one child or no child
        if (root->left == NULL) {
            struct Node* temp = root->right;
            free(root);
            return temp;
        }
        else if (root->right == NULL) {
            struct Node* temp = root->left;
            free(root);
            return temp;
        }
        // Node with two children
        struct Node* temp = findMin(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }
    return root;
}

// Count number of nodes
int countNodes(struct Node* root) {
    if (root == NULL)
        return 0;
    return 1 + countNodes(root->left) + countNodes(root->right);
}

// Find height of BST
int height(struct Node* root) {
    if (root == NULL)
        return -1; // height of empty tree is -1
    int leftHeight = height(root->left);
    int rightHeight = height(root->right);
    return (leftHeight > rightHeight ? leftHeight : rightHeight) + 1;
}

// Inorder Traversal (to view the tree)
void inorderTraversal(struct Node* root) {
    if (root == NULL)
        return;
    inorderTraversal(root->left);
    printf("%d ", root->data);
    inorderTraversal(root->right);
}

int main(){
    struct Node* root = NULL;
    int choice, value;
    struct Node* temp;

    while (1) {
        printf("\n--- Binary Search Tree Menu ---\n");
        printf("1. Insert an element\n");
        printf("2. Find an element\n");
        printf("3. Delete an element\n");
        printf("4. Count number of nodes\n");
        printf("5. Find maximum element\n");
        printf("6. Find minimum element\n");
        printf("7. Find height of the tree\n");
        printf("8. Display Inorder Traversal\n");
        printf("9. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch(choice) {
            case 1:
                printf("Enter value to insert: ");
                scanf("%d", &value);
                root = insert(root, value);
                break;
            case 2:
                printf("Enter value to find: ");
                scanf("%d", &value);
                temp = find(root, value);
                if (temp != NULL)
                    printf("Element %d found in the BST.\n", value);
                else
                    printf("Element %d not found in the BST.\n", value);
                break;
            case 3:
                printf("Enter value to delete: ");
                scanf("%d", &value);
                root = deleteNode(root, value);
                printf("Element %d deleted (if it existed).\n", value);
                break;
            case 4:
                printf("Total number of nodes: %d\n", countNodes(root));
                break;
            case 5:
                temp = findMax(root);
                if (temp != NULL)
                    printf("Maximum element: %d\n", temp->data);
                else
                    printf("Tree is empty.\n");
                break;
            case 6:
                temp = findMin(root);
                if (temp != NULL)
                    printf("Minimum element: %d\n", temp->data);
                else
                    printf("Tree is empty.\n");
                break;
            case 7:
                printf("Height of the tree: %d\n", height(root));
                break;
            case 8:
                printf("Inorder Traversal: ");
                inorderTraversal(root);
                printf("\n");
                break;
            case 9:
                printf("Exiting program.\n");
                return 0;
            default:
                printf("Invalid choice! Please try again.\n");
        }
    }
}
