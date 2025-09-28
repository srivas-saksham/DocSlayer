// WAP to find Fibonacci Series of n terms;
#include<stdio.h>

void fibonacci(int a, int b, int n){
    if(n == 0){
        return;
    }
    printf("%d ", a);
    fibonacci(b, a+b, n-1);
}

int main(){
    int num;
    printf("Enter Number of Elements: ");
    scanf("%d", &num);

    printf("Fibonacci Series:\n");
    fibonacci(0, 1, num);

    return 0;
}