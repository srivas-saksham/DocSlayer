# Create a function Pall_n to print all of the palindrome numbers between two ranges.

def is_palindrome(num):
    return str(num) == str(num)[::-1]

low = int(input("Enter lower range: "))
high = int(input("Enter upper range: "))

print("Palindrome numbers are:", end=" ")
for i in range(low, high + 1):
    if is_palindrome(i):
        print(i, end=" ")
