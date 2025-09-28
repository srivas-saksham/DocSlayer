# Write a Python program to perform the string slicing.

s = input("Enter a string: ")

while True:
    print("\n--- String Slicing Menu ---")
    print("1. First 5 characters")
    print("2. Last 5 characters")
    print("3. Characters from index 2 to 7")
    print("4. Every second character")
    print("5. Reversed string")
    print("6. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        print("First 5 characters:", s[:5])
    elif choice == 2:
        print("Last 5 characters:", s[-5:])
    elif choice == 3:
        print("Characters from index 2 to 7:", s[2:8])
    elif choice == 4:
        print("Every second character:", s[::2])
    elif choice == 5:
        print("Reversed string:", s[::-1])
    elif choice == 6:
        print("Exiting program...")
        break
    else:
        print("Invalid choice! Try again.")
