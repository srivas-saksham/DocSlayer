# Write a program to print Fibonacci Series 0 1 1 2 3 5 ………..N

n = int(input("Enter the number of terms: "))
a, b = 0, 1
print("Fibonacci Series:")
for _ in range(n):
    print(a)
    a, b = b, a + b
