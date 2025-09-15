# Q3: Write a function to print the sum of numbers in list having 3 at their units place

def sum_with_units_digit_3(numbers):
    return sum(num for num in numbers if num % 10 == 3)

while True:
    print("\n--- Sum of Numbers Ending with 3 Menu ---")
    print("1. Calculate Sum")
    print("2. Exit")
    choice = int(input("Enter your choice: "))

    if choice == 1:
        numbers = list(map(int, input("Enter numbers separated by space: ").split()))
        total = sum_with_units_digit_3(numbers)
        print(f"Sum of numbers ending with 3 is: {total}")
    elif choice == 2:
        print("Exiting program...")
        break
    else:
        print("Invalid choice! Try again.")
