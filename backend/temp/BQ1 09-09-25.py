# Q1: Write a program to perform Linear Search

def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

while True:
    print("\n--- Linear Search Menu ---")
    print("1. Perform Linear Search")
    print("2. Exit")
    choice = int(input("Enter your choice: "))

    if choice == 1:
        arr = list(map(int, input("Enter numbers separated by space: ").split()))
        target = int(input("Enter the element to search: "))
        result = linear_search(arr, target)
        if result != -1:
            print(f"Element found at index {result}")
        else:
            print("Element not found")
    elif choice == 2:
        print("Exiting program...")
        break
    else:
        print("Invalid choice! Try again.")
