// WAP to perform different queue operations such as insert, delete, display of elements using circular queue
#include<stdio.h>
#include <stdlib.h>

int front = -1, rear = -1;

int enqueue(int* queue, int val, int size){
    if((rear+1) % size == front){
        printf("Quere Overflow!");
        return 0;
    }
    else{
        if(front == -1)
            front = 0;
        rear = (rear + 1) % size;
        queue[rear] = val;
    }
    return 1;
}

int dequeue(int* queue, int size){
    if(front == -1){
        printf("Queue Underflow!");
        return -1;
    }
    else{
        int val = queue[front];
        if(front == rear){
            front = -1;
            rear = -1;
        }
        else{
            front = (front + 1) % size;
        }
        printf("Element Inserted Successfully!");
        return val;
    }
}

void displayQ(int* queue, int size) {
    if(front == -1) {
        printf("Queue is empty.\n");
    } 
    else{
        printf("Queue elements: ");
        int i = front;
        while(1) {
            printf("%d ", queue[i]);
            if(i == rear)
                break;
            i = (i + 1) % size;
        }
        printf("\n");
    }
}

int main(){
    int size;
    printf("Enter Size of Queue: ");
    scanf("%d", &size);

    int* queue = (int*)malloc(size * sizeof(int));
    if (!queue) {
        printf("Memory allocation failed!\n");
        return 1;
    }
    
    int choice;
    while(1){
        printf("\n1) Enqueue Element: ");
        printf("\n2) Dequeue Element: ");
        printf("\n3) Display Elements: ");
        printf("\n0) Exit: ");
        printf("\n\n Enter Choice: ");
        scanf("%d", &choice);

        switch(choice){
            case 1: {
                int val;
                printf("Enter Value: ");
                scanf("%d", &val);
                enqueue(queue, val, size);
                break;
            }
            
            case 2: {
                int delVal = dequeue(queue, size);
                if(delVal != -1)
                    printf("Deleted Element: %d", delVal);
                break;
            }
            
            case 3:
                displayQ(queue, size);
                break;
            
            case 0:
                printf("Exiting Program.");
                exit(0);
        }
    }
}