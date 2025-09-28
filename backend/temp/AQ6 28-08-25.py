# Write a Python program to demonstrate the use of List, Tuple, Dictionary.

my_list = [10, 20, 30, 40]
my_tuple = (1, 2, 3, 4)
my_dict = {"a": 100, "b": 200, "c": 300}

while True:
    print("\n--- Data Structure Menu ---")
    print("1. Show List")
    print("2. Show Tuple")
    print("3. Show Dictionary")
    print("4. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        print("List:", my_list)
        print("Access List element (index 2):", my_list[2])
    elif choice == 2:
        print("Tuple:", my_tuple)
        print("Access Tuple element (index 1):", my_tuple[1])
    elif choice == 3:
        print("Dictionary:", my_dict)
        print("Access Dictionary element (key 'b'):", my_dict["b"])
    elif choice == 4:
        print("Exiting program...")
        break
    else:
        print("Invalid choice! Try again.")
