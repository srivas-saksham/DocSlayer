# Write a program to print the sum of first n prime numbers.

def is_prime(num):
    if num < 2:
        return False
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True

n = int(input("Enter Number of Prime Numbers to Sum: "))
count, num, total = 0, 2, 0
while count < n:
    if is_prime(num):
        total += num
        count += 1
    num += 1
print("Sum of first", n, "prime numbers is:", total)
