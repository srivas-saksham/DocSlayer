// WAP to Evaluate Postfix Expression
#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>

#define MAX 100

int stack[MAX];
int top = -1;

void push(int val) {
    if (top == MAX - 1) {
        printf("Stack Overflow\n");
        return;
    }
    stack[++top] = val;
}

int pop() {
    if (top == -1) {
        printf("Stack Underflow\n");
        exit(1);
    }
    return stack[top--];
}

int calVal(int a, int b, char op) {
    switch (op) {
        case '+': return (a + b);
        case '-': return (a - b);
        case '*': return (a * b);
        case '/': return (a / b);
        case '^': return (pow(a, b));
        default:
            printf("Invalid Operator Encountered!\n");
            exit(1);
    }
}

int evalPostfix(char* postfix) {
    int i;
    for (i = 0; postfix[i] != '\0'; i++) {
        if (isdigit(postfix[i])) {  
            push(postfix[i] - '0');  
        } else {  
            int B = pop();
            int A = pop();
            int val = calVal(A, B, postfix[i]);
            push(val);
        }
    }
    return pop();  
}

int main() {
    char postfix[MAX], eval[MAX];

    printf("Enter Postfix Expression: ");
    scanf("%s", postfix);
    
    int result = evalPostfix(postfix);

    printf("Evaluated Expression: %d\n", result);

    return 0;
}
