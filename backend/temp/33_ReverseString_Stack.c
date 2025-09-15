// WAP to Reverse a String using Stack

#include <stdio.h>
#include <string.h>

#define MAX 100

char stack[MAX];
int top = -1;

void push(char c) {
    if (top == MAX - 1) {
        return;
    }
    stack[++top] = c;
}

char pop() {
    if (top == -1) {
        return '\0';
    }
    return stack[top--];
}

void reverseString(char str[]) {
    int len = strlen(str);
    
    for (int i = 0; i < len; i++) {
        push(str[i]);
    }

    for (int i = 0; i < len; i++) {
        str[i] = pop();
    }
}

int main() {
    char str[MAX];
    printf("Enter String: ");
    scanf("%s", str);

    reverseString(str);

    printf("Reversed String: %s\n", str);

    return 0;
}
