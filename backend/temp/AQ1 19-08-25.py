# Write a program to demonstrate the use of different operators in python.

def operators_demo(a, b):
    print("Addition:", a + b)
    print("Subtraction:", a - b)
    print("Multiplication:", a * b)
    print("Division:", a / b if b != 0 else "Undefined")
    print("Modulus:", a % b if b != 0 else "Undefined")
    print("Floor Division:", a // b if b != 0 else "Undefined")
    print("Exponentiation:", a ** b)
    print("Equal:", a == b)
    print("Not Equal:", a != b)
    print("Greater:", a > b)
    print("Smaller:", a < b)
    print("Logical AND:", a > 0 and b > 0)
    print("Logical OR:", a > 0 or b > 0)
    print("Logical NOT:", not(a > 0))

a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
operators_demo(a, b)
