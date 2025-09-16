#Print the multiplication table of a number
num = int(input("Enter a number to print its multiplication table: "))

for i in range(1, 11):
    print(num, "x", i, "=", num * i)
