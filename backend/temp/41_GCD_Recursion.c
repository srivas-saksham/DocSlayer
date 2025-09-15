// WAP to calculate GCD of two numbers using recrusion
#include<stdio.h>

int gcd(int a, int b) {
    if (b == 0)
        return a;
    return gcd(b, a % b);
}

int main(){
    int a, b;
    printf("Enter First Number: ");
    scanf("%d", &a);
    printf("Enter Second Number: ");
    scanf("%d", &b);

    int result = gcd(a,b);
    printf("Greatest Common Divisor of %d and %d is %d.", a, b, result);

    return 0;
}