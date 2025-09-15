// WAP to find factorial of a number using recursion
#include<stdio.h>

int factorial(int num){
    if(num == 0 || num == 1){
        return 1;
    }
    return num * factorial(num - 1);
}

int main(){
    int num;
    printf("Enter Number: ");
    scanf("%d", &num);

    int fac = factorial(num);
    printf("Factorial of %d is %d", num, fac);

    return 0;
}