# Q2: Write a function to find all duplicates in two different lists

def find_duplicates(list1, list2):
    duplicates = set(list1).intersection(set(list2))
    return list(duplicates)

while True:
    print("\n--- Duplicate Finder Menu ---")
    print("1. Find Duplicates")
    print("2. Exit")
    choice = int(input("Enter your choice: "))

    if choice == 1:
        list1 = list(map(int, input("Enter elements of first list separated by space: ").split()))
        list2 = list(map(int, input("Enter elements of second list separated by space: ").split()))
        duplicates = find_duplicates(list1, list2)
        if duplicates:
            print("Duplicates found:", duplicates)
        else:
            print("No duplicates found")
    elif choice == 2:
        print("Exiting program...")
        break
    else:
        print("Invalid choice! Try again.")
